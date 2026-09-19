import { useSyncExternalStore } from 'react';

/* Per-device preferences of the player, kept in localStorage: they are a comfort setting,
   not something the teacher grades, so they cost no Firestore writes. */

export const DEFAULT_QUESTION_SECONDS: number = 45;
export const MIN_QUESTION_SECONDS: number = 2;
export const MAX_QUESTION_SECONDS: number = 120;

const QUESTION_SECONDS_STORAGE_KEY: string = 'learn.practice.questionSeconds';

const listeners: Set<() => void> = new Set();

export function clampQuestionSeconds(seconds: number): number {
  if (!Number.isFinite(seconds)) return DEFAULT_QUESTION_SECONDS;
  return Math.min(MAX_QUESTION_SECONDS, Math.max(MIN_QUESTION_SECONDS, Math.round(seconds)));
}

function readQuestionSeconds(): number {
  try {
    const stored = window.localStorage.getItem(QUESTION_SECONDS_STORAGE_KEY);
    return stored === null ? DEFAULT_QUESTION_SECONDS : clampQuestionSeconds(Number(stored));
  } catch {
    // Private windows and blocked site data throw on access; the default still works.
    return DEFAULT_QUESTION_SECONDS;
  }
}

export function saveQuestionSeconds(seconds: number): void {
  try {
    window.localStorage.setItem(QUESTION_SECONDS_STORAGE_KEY, String(clampQuestionSeconds(seconds)));
  } catch {
    // Nothing to do: the setting just will not survive a reload.
  }
  listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void): () => void {
  listeners.add(notify);
  window.addEventListener('storage', notify);
  return () => {
    listeners.delete(notify);
    window.removeEventListener('storage', notify);
  };
}

/** Live across the page: the config dialog in the header changes it while the player runs. */
export function useQuestionSeconds(): number {
  return useSyncExternalStore(subscribe, readQuestionSeconds, () => DEFAULT_QUESTION_SECONDS);
}
