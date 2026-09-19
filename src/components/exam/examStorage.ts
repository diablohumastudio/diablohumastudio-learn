import type { ExamAnswers } from '../../data/exam/types';

/* The answers live in this browser until the server confirms it has them: a reload, a closed
   tab or a dropped connection never loses them. The record existing at all also means "the exam
   was taken on this device", which is what allows sending it without the student asking. */

export type StoredExam = {
  answers: ExamAnswers;
  /** Submit was pressed (or the clock ended) and the server has not confirmed yet. */
  submitPending: boolean;
};

function storageKey(examId: string, uid: string): string {
  return `exam:${examId}:${uid}`;
}

export function readStoredExam(examId: string, uid: string): StoredExam | null {
  try {
    const raw = window.localStorage.getItem(storageKey(examId, uid));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return { answers: parsed.answers ?? {}, submitPending: Boolean(parsed.submitPending) };
  } catch {
    return null;
  }
}

export function writeStoredExam(examId: string, uid: string, stored: StoredExam): void {
  try {
    window.localStorage.setItem(storageKey(examId, uid), JSON.stringify(stored));
  } catch (error) {
    console.error('Could not keep the answers in this browser', error);
  }
}

export function clearStoredExam(examId: string, uid: string): void {
  try {
    window.localStorage.removeItem(storageKey(examId, uid));
  } catch {
    // Nothing to clear when storage is unavailable.
  }
}
