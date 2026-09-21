import { collection, doc, onSnapshot, serverTimestamp, writeBatch } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { EXAM_QUESTIONS_COLLECTION, QUESTIONS_COLLECTION, newAnswerId } from '../../data/practice';
import type { PracticeAnswer, PracticeQuestion } from '../../data/practice';
import { parseQuestion } from '../../data/practice/parse';
import { getFirestoreDb } from '../../lib/firebase';

/* Firestore layout (rules in firebase/firestore.rules):
   questions/{questionId}      one document per question, readable by any signed-in user,
                               written only by teachers (see progress.ts for the rest)
   examQuestions/{questionId}  same model, teachers only: never practiced, picked by id into exams */

const MAX_BATCH_WRITES: number = 500;

export type QuestionBank =
  | { status: 'loading' }
  | { status: 'ready'; questions: PracticeQuestion[] }
  | { status: 'error'; error: unknown };

export { parseQuestionList } from '../../data/practice/parse';

function withId(answer: PracticeAnswer): PracticeAnswer {
  return answer.id ? answer : { ...answer, id: newAnswerId() };
}

/* Firestore rejects `undefined` fields, so optional ones are only spread when present. */
function toDocument(question: PracticeQuestion): DocumentData {
  return {
    ...(question.topic ? { topic: question.topic } : {}),
    ...(question.slides && question.slides.length > 0 ? { slides: question.slides } : {}),
    prompt: question.prompt,
    correct: question.correct.map(withId),
    incorrect: question.incorrect.map(withId),
    ...(question.explanation ? { explanation: question.explanation } : {}),
    retired: question.retired,
    updatedAt: serverTimestamp(),
  };
}

function byId(a: PracticeQuestion, b: PracticeQuestion): number {
  return a.id.localeCompare(b.id);
}

function useBankOf(collectionName: string, examOnly: boolean): QuestionBank {
  const [bank, setBank] = useState<QuestionBank>({ status: 'loading' });

  useEffect(() => {
    return onSnapshot(
      collection(getFirestoreDb(), collectionName),
      (snapshot) => {
        const questions: PracticeQuestion[] = [];
        for (const questionDoc of snapshot.docs) {
          try {
            const question = parseQuestion(questionDoc.id, questionDoc.data());
            questions.push(examOnly ? { ...question, examOnly: true } : question);
          } catch (error) {
            console.warn('Skipping a malformed question', error);
          }
        }
        setBank({ status: 'ready', questions: questions.sort(byId) });
      },
      (error) => setBank({ status: 'error', error })
    );
  }, [collectionName, examOnly]);

  return bank;
}

/** Live view of the whole practice bank, including retired questions, sorted by id. */
export function useQuestionBank(): QuestionBank {
  return useBankOf(QUESTIONS_COLLECTION, false);
}

/** Teacher only (the rules refuse it to students): the questions that exist for exams. */
export function useExamOnlyBank(): QuestionBank {
  return useBankOf(EXAM_QUESTIONS_COLLECTION, true);
}

export function activeQuestions(bank: QuestionBank): PracticeQuestion[] {
  return bank.status === 'ready' ? bank.questions.filter((question) => !question.retired) : [];
}

/** The bank in the format Import JSON reads, so an export edited by hand (or tagged with slides
    outside the site) goes back in unchanged. Answer ids travel too: exam attempts point at them. */
export function toExportJson(questions: readonly PracticeQuestion[]): string {
  const exported = questions.map((question) => ({
    id: question.id,
    ...(question.topic ? { topic: question.topic } : {}),
    ...(question.slides && question.slides.length > 0 ? { slides: question.slides } : {}),
    prompt: question.prompt,
    correct: question.correct,
    incorrect: question.incorrect,
    ...(question.explanation ? { explanation: question.explanation } : {}),
    retired: question.retired,
  }));
  return JSON.stringify(exported, null, 2);
}

/** Teacher only. Creates or fully replaces the question with that id, in the bank `examOnly` names. */
export async function saveQuestions(questions: readonly PracticeQuestion[]): Promise<void> {
  const db = getFirestoreDb();
  for (let start = 0; start < questions.length; start += MAX_BATCH_WRITES) {
    const batch = writeBatch(db);
    for (const question of questions.slice(start, start + MAX_BATCH_WRITES)) {
      const collectionName = question.examOnly ? EXAM_QUESTIONS_COLLECTION : QUESTIONS_COLLECTION;
      batch.set(doc(db, collectionName, question.id), toDocument(question));
    }
    await batch.commit();
  }
}
