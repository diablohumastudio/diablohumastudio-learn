import { emptyTypingSignals } from '../../data/deliverable/types';
import type { SubmissionAnswers, TypingSignals } from '../../data/deliverable/types';

/* What the student wrote lives in this browser until the server confirms it has it: a reload,
   a closed tab or a dropped connection never loses it. The record existing at all means there
   is something not saved yet, so the page saves it as soon as it can. */

export type StoredDraft = {
  answers: SubmissionAnswers;
  url: string;
  typing: TypingSignals;
};

function storageKey(deliverableId: string, uid: string): string {
  return `deliverable:${deliverableId}:${uid}`;
}

export function readStoredDraft(deliverableId: string, uid: string): StoredDraft | null {
  try {
    const raw = window.localStorage.getItem(storageKey(deliverableId, uid));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      answers: typeof parsed.answers === 'object' && parsed.answers !== null ? parsed.answers : {},
      url: typeof parsed.url === 'string' ? parsed.url : '',
      typing: { ...emptyTypingSignals(), ...(parsed.typing ?? {}) },
    };
  } catch {
    return null;
  }
}

export function writeStoredDraft(deliverableId: string, uid: string, draft: StoredDraft): void {
  try {
    window.localStorage.setItem(storageKey(deliverableId, uid), JSON.stringify(draft));
  } catch (error) {
    console.error('Could not keep the draft in this browser', error);
  }
}

export function clearStoredDraft(deliverableId: string, uid: string): void {
  try {
    window.localStorage.removeItem(storageKey(deliverableId, uid));
  } catch {
    // Nothing to clear when storage is unavailable.
  }
}
