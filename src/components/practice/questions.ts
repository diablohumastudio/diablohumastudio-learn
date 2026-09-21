import { collection, doc, onSnapshot, serverTimestamp, writeBatch } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { newAnswerId } from '../../data/practice';
import type { PracticeAnswer, PracticeQuestion } from '../../data/practice';
import { parseQuestion } from '../../data/practice/parse';
import { getFirestoreDb } from '../../lib/firebase';

/* Firestore layout (rules in firebase/firestore.rules):
   questions/{questionId}  one document per question, readable by any signed-in user,
                           written only by teachers (see progress.ts for the rest) */

const QUESTIONS_COLLECTION: string = 'questions';
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

/** Live view of the whole bank, including retired questions, sorted by id. */
export function useQuestionBank(): QuestionBank {
  const [bank, setBank] = useState<QuestionBank>({ status: 'loading' });

  useEffect(() => {
    return onSnapshot(
      collection(getFirestoreDb(), QUESTIONS_COLLECTION),
      (snapshot) => {
        const questions: PracticeQuestion[] = [];
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

export function activeQuestions(bank: QuestionBank): PracticeQuestion[] {
  return bank.status === 'ready' ? bank.questions.filter((question) => !question.retired) : [];
}

/** Teacher only. Creates or fully replaces the question with that id. */
export async function saveQuestions(questions: readonly PracticeQuestion[]): Promise<void> {
  const db = getFirestoreDb();
  for (let start = 0; start < questions.length; start += MAX_BATCH_WRITES) {
    const batch = writeBatch(db);
    for (const question of questions.slice(start, start + MAX_BATCH_WRITES)) {
      batch.set(doc(db, QUESTIONS_COLLECTION, question.id), toDocument(question));
    }
    await batch.commit();
  }
}
