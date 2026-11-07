import { useSyncExternalStore } from 'react';

/* Per-device preferences, kept in localStorage: the player's time per question and the text
   size of the pages. They are comfort settings, not something the teacher grades, so they cost
   no Firestore writes. */

export const DEFAULT_QUESTION_SECONDS: number = 45;
export const MIN_QUESTION_SECONDS: number = 2;
export const MAX_QUESTION_SECONDS: number = 120;

/** Pixels added to the text of the pages (menus, practice, teacher), from smaller to larger. */
export const DEFAULT_TEXT_DELTA: number = 0;
export const MIN_TEXT_DELTA: number = -4;
export const MAX_TEXT_DELTA: number = 4;

const QUESTION_SECONDS_STORAGE_KEY: string = 'learn.practice.questionSeconds';
const TEXT_DELTA_STORAGE_KEY: string = 'learn.textDelta';

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

export function clampTextDelta(delta: number): number {
  if (!Number.isFinite(delta)) return DEFAULT_TEXT_DELTA;
  return Math.min(MAX_TEXT_DELTA, Math.max(MIN_TEXT_DELTA, Math.round(delta)));
}

function readTextDelta(): number {
  try {
    const stored = window.localStorage.getItem(TEXT_DELTA_STORAGE_KEY);
    return stored === null ? DEFAULT_TEXT_DELTA : clampTextDelta(Number(stored));
  } catch {
    return DEFAULT_TEXT_DELTA;
  }
}

export function saveTextDelta(delta: number): void {
  try {
    window.localStorage.setItem(TEXT_DELTA_STORAGE_KEY, String(clampTextDelta(delta)));
  } catch {
    // Nothing to do: the setting just will not survive a reload.
  }
  listeners.forEach((notify) => notify());
}

/** The layout reads it to size the text of the whole page while the dialog changes it. */
export function useTextDelta(): number {
  return useSyncExternalStore(subscribe, readTextDelta, () => DEFAULT_TEXT_DELTA);
}
