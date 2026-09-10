import { collection, doc, getDoc, onSnapshot, serverTimestamp, writeBatch } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { MIN_CORRECT_ANSWERS, MIN_INCORRECT_ANSWERS } from '../../data/quiz';
import type { QuizQuestion } from '../../data/quiz';
import { LOCALES } from '../../i18n/locales';
import type { Dictionary } from '../../i18n/useT';
import { getFirestoreDb } from '../../lib/firebase';

/* Firestore layout (rules in firebase/firestore.rules):
   questions/{questionId}  one document per question, readable by any signed-in user,
                           written only by teachers (see progress.ts for the rest) */

const QUESTIONS_COLLECTION: string = 'questions';
const TEACHERS_COLLECTION: string = 'teachers';
const MAX_BATCH_WRITES: number = 500;

export type QuestionBank =
  | { status: 'loading' }
  | { status: 'ready'; questions: QuizQuestion[] }
  | { status: 'error'; error: unknown };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseText(value: unknown, field: string): Dictionary<string> {
  if (!isRecord(value)) throw new Error(`${field}: expected an object with one text per language`);
  const text = {} as Dictionary<string>;
  for (const locale of LOCALES) {
    const localized = value[locale];
    if (typeof localized !== 'string' || localized.trim() === '') {
      throw new Error(`${field}.${locale}: missing text`);
    }
    text[locale] = localized;
  }
  return text;
}

function parseTextList(value: unknown, field: string, minimum: number): Dictionary<string>[] {
  if (!Array.isArray(value) || value.length < minimum) throw new Error(`${field}: needs at least ${minimum}`);
  return value.map((item, index) => parseText(item, `${field}[${index}]`));
}

/** Validates any raw shape (a Firestore doc or pasted JSON) into a question, or throws. */
export function parseQuestion(id: string, data: unknown): QuizQuestion {
  if (!isRecord(data)) throw new Error(`${id}: expected an object`);
  const topic = typeof data.topic === 'string' ? data.topic : undefined;
  if (data.topic !== undefined && topic === undefined) throw new Error(`${id}: topic must be text`);
  const question: QuizQuestion = {
    id,
    prompt: parseText(data.prompt, `${id}.prompt`),
    correct: parseTextList(data.correct, `${id}.correct`, MIN_CORRECT_ANSWERS),
    incorrect: parseTextList(data.incorrect, `${id}.incorrect`, MIN_INCORRECT_ANSWERS),
    retired: Boolean(data.retired),
  };
  if (topic) question.topic = topic;
  if (data.explanation !== undefined) question.explanation = parseText(data.explanation, `${id}.explanation`);
  return question;
}

/** Pasted JSON: an array of questions, each carrying its own `id`. */
export function parseQuestionList(json: string): QuizQuestion[] {
  const parsed: unknown = JSON.parse(json);
  if (!Array.isArray(parsed)) throw new Error('expected an array of questions');
  return parsed.map((item, index) => {
    const id = isRecord(item) && typeof item.id === 'string' ? item.id.trim() : '';
    if (id === '') throw new Error(`question ${index + 1}: missing id`);
    return parseQuestion(id, item);
  });
}

/* Firestore rejects `undefined` fields, so optional ones are only spread when present. */
function toDocument(question: QuizQuestion): DocumentData {
  return {
    ...(question.topic ? { topic: question.topic } : {}),
    prompt: question.prompt,
    correct: question.correct,
    incorrect: question.incorrect,
    ...(question.explanation ? { explanation: question.explanation } : {}),
    retired: question.retired,
    updatedAt: serverTimestamp(),
  };
}

function byId(a: QuizQuestion, b: QuizQuestion): number {
  return a.id.localeCompare(b.id);
}

/** Live view of the whole bank, including retired questions, sorted by id. */
export function useQuestionBank(): QuestionBank {
  const [bank, setBank] = useState<QuestionBank>({ status: 'loading' });

  useEffect(() => {
    return onSnapshot(
      collection(getFirestoreDb(), QUESTIONS_COLLECTION),
      (snapshot) => {
        const questions: QuizQuestion[] = [];
        for (const questionDoc of snapshot.docs) {
          try {
            questions.push(parseQuestion(questionDoc.id, questionDoc.data()));
          } catch (error) {
            console.warn('Skipping a malformed question', error);
          }
        }
        setBank({ status: 'ready', questions: questions.sort(byId) });
      },
      (error) => setBank({ status: 'error', error })
    );
  }, []);

  return bank;
}

export function activeQuestions(bank: QuestionBank): QuizQuestion[] {
  return bank.status === 'ready' ? bank.questions.filter((question) => !question.retired) : [];
}

/** Teacher only. Creates or fully replaces the question with that id. */
export async function saveQuestions(questions: readonly QuizQuestion[]): Promise<void> {
  const db = getFirestoreDb();
  for (let start = 0; start < questions.length; start += MAX_BATCH_WRITES) {
    const batch = writeBatch(db);
    for (const question of questions.slice(start, start + MAX_BATCH_WRITES)) {
      batch.set(doc(db, QUESTIONS_COLLECTION, question.id), toDocument(question));
    }
    await batch.commit();
  }
}

/** The rules let an account read only its own `teachers` doc, so this is a safe self-check. */
export async function isTeacher(uid: string): Promise<boolean> {
  const snapshot = await getDoc(doc(getFirestoreDb(), TEACHERS_COLLECTION, uid));
  return snapshot.exists();
}
