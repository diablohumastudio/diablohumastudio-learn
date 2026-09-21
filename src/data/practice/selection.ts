import type { PracticeQuestion } from './types';

/* Which questions an exam draws from: a plain list of question ids. The picker's course, class
   and slide boxes only tick and untick ids, so what the teacher sees ticked is exactly what is
   stored. Kept free of Firebase and of the Learn registry: the exam API route builds the paper
   on the server with the same code the manager uses for its count. */

/** Tolerant read of a stored id list (a Firestore doc written by any version of the site). */
export function parseQuestionIds(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

export function questionsWithIds(
  questions: readonly PracticeQuestion[],
  questionIds: readonly string[]
): PracticeQuestion[] {
  return questions.filter((question) => questionIds.includes(question.id));
}
