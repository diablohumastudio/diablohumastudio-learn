import { SUBMIT_GRACE_MS } from '../exam/types';

/* A deliverable is a homework or an exam the student hands in as something other than multiple
   choice: text written on the platform, a link to a repository, or a link to a document. Shared
   by the browser and the scripts' documentation, so it holds no Firebase types: every moment is
   a number of milliseconds since the epoch. See docs/deliverables.md. */

export const DELIVERABLES_COLLECTION: string = 'deliverables';
export const SUBMISSIONS_SUBCOLLECTION: string = 'submissions';
export const REVIEWS_SUBCOLLECTION: string = 'reviews';

/** Where a deliverable is listed and graded: with the specific homeworks or with the exams. */
export const DELIVERABLE_ROLES = ['homework', 'exam'] as const;
export type DeliverableRole = (typeof DELIVERABLE_ROLES)[number];

/** What the student hands in. */
export const DELIVERABLE_KINDS = ['text', 'repo', 'docLink'] as const;
export type DeliverableKind = (typeof DELIVERABLE_KINDS)[number];

export type DeliverableStatus = 'draft' | 'opened';

/** A save that reaches the server this long after the close still counts as on time (slow networks). */
export const SAVE_GRACE_MS: number = SUBMIT_GRACE_MS;
/** The student's text is saved by itself this often while it changes. */
export const AUTOSAVE_MS: number = 60_000;
/** A failed save is tried again this often while the page stays open. */
export const SAVE_RETRY_MS: number = 5000;
/** A closed deliverable stays on the course page this long, so students see how it ended. */
export const SHOWN_AFTER_CLOSE_MS: number = 7 * 24 * 60 * 60 * 1000;
export const DEFAULT_MAX_SCORE: number = 10;
export const DEFAULT_DURATION_MINUTES: number = 90;

/* Typing signals. Pasting and dropping are refused by the page, which is friction and not
   security: what tells a copied text apart is the record of how it was typed. */
/** Characters added to a field in one input event from this count up are recorded as a jump. */
export const JUMP_CHARS: number = 20;
export const SAMPLE_INTERVAL_MS: number = 10_000;
/** The sampled timeline stops growing here (over five hours at one sample every ten seconds). */
export const MAX_SAMPLES: number = 2000;
export const MAX_JUMPS: number = 200;

const QUESTION_ID_LENGTH: number = 6;
const MS_PER_SECOND: number = 1000;
const REPO_HOSTS: readonly string[] = ['gitlab.com', 'www.gitlab.com', 'github.com', 'www.github.com'];
/** `owner/repo` at least: a bare host is not a repository. */
const REPO_PATH_MIN_SEGMENTS: number = 2;

export type DeliverableQuestion = {
  /** Opaque and permanent within its deliverable: the answers are keyed by it. */
  id: string;
  text: string;
  /** The answer is cut here; null for no limit. */
  maxChars: number | null;
};

/** What a teacher sets. */
export type DeliverableSettings = {
  title: string;
  courseSlug: string;
  role: DeliverableRole;
  kind: DeliverableKind;
  /** Link to the guide (a PDF in Google Drive, for instance); empty for none. */
  guideUrl: string;
  /** Shown above the form; empty for none. */
  instructions: string;
  /** Only for `kind === 'text'`; empty otherwise. */
  questions: DeliverableQuestion[];
  maxScore: number;
  /** Exam role: Open fixes the close this many minutes ahead. */
  durationMinutes: number;
  /** Homework role: the close Open will fix, chosen in the form; null until chosen. */
  deadlineMs: number | null;
  /** The accounts it is for; empty for everybody enrolled in the course. */
  assignedUids: string[];
};

export type Deliverable = DeliverableSettings & {
  id: string;
  status: DeliverableStatus;
  /** Stored beside `assignedUids` so a student's query can ask for it by equality. */
  forEveryone: boolean;
  createdAtMs: number | null;
  openedAtMs: number | null;
  /** Fixed when the teacher opens the deliverable; Close now moves it to that moment. */
  closesAtMs: number | null;
};

/** Question id → the student's text. */
export type SubmissionAnswers = Record<string, string>;

export type TypingJump = {
  /** Seconds of the timeline (`TypingSignals.elapsedSeconds`) when it happened. */
  atSeconds: number;
  chars: number;
  questionId: string;
};

export type TypingSample = {
  atSeconds: number;
  /** Characters in every answer together at that moment. */
  chars: number;
};

export type TypingSignals = {
  pasteAttempts: number;
  dropAttempts: number;
  /** Times the window lost focus after the student started typing. */
  focusLosses: number;
  jumps: TypingJump[];
  samples: TypingSample[];
  /** Seconds the page was visible since the first keystroke, over every visit. */
  elapsedSeconds: number;
  /** Seconds of sample windows with at least one keystroke. */
  activeSeconds: number;
  /** The fastest sample window, in characters per minute. */
  maxCharsPerMinute: number;
};

export type Submission = {
  uid: string;
  displayName: string;
  email: string;
  answers: SubmissionAnswers;
  url: string;
  typing: TypingSignals | null;
  firstSavedAtMs: number | null;
  /** The server's clock at the last save: what says whether it came late. */
  savedAtMs: number | null;
};

export type Review = {
  uid: string;
  score: number | null;
  maxScore: number;
  comment: string;
  reviewedAtMs: number | null;
  reviewedBy: string;
};

export function emptyTypingSignals(): TypingSignals {
  return {
    pasteAttempts: 0,
    dropAttempts: 0,
    focusLosses: 0,
    jumps: [],
    samples: [],
    elapsedSeconds: 0,
    activeSeconds: 0,
    maxCharsPerMinute: 0,
  };
}

export function newQuestionId(): string {
  return Array.from({ length: QUESTION_ID_LENGTH }, () => Math.floor(Math.random() * 36).toString(36)).join('');
}

export function isDeliverableRole(value: unknown): value is DeliverableRole {
  return DELIVERABLE_ROLES.includes(value as DeliverableRole);
}

export function isDeliverableKind(value: unknown): value is DeliverableKind {
  return DELIVERABLE_KINDS.includes(value as DeliverableKind);
}

export function isDeliverableRunning(deliverable: Deliverable, nowMs: number): boolean {
  return deliverable.status === 'opened' && deliverable.closesAtMs !== null && nowMs < deliverable.closesAtMs;
}

export function isDeliverableOver(deliverable: Deliverable, nowMs: number): boolean {
  return deliverable.status === 'opened' && deliverable.closesAtMs !== null && nowMs >= deliverable.closesAtMs;
}

/** From its opening until a few days after its close. */
export function isDeliverableShown(deliverable: Deliverable, nowMs: number): boolean {
  if (deliverable.status !== 'opened' || deliverable.closesAtMs === null) return false;
  return nowMs <= deliverable.closesAtMs + SHOWN_AFTER_CLOSE_MS;
}

/** A save stamped by the server after the close and its grace. */
export function isSavedLate(submission: Submission, deliverable: Deliverable): boolean {
  if (submission.savedAtMs === null || deliverable.closesAtMs === null) return false;
  return submission.savedAtMs > deliverable.closesAtMs + SAVE_GRACE_MS;
}

export function lateBySeconds(submission: Submission, deliverable: Deliverable): number {
  if (submission.savedAtMs === null || deliverable.closesAtMs === null) return 0;
  return Math.max(0, Math.round((submission.savedAtMs - deliverable.closesAtMs) / MS_PER_SECOND));
}

function parseUrl(value: string): URL | null {
  try {
    return new URL(value.trim());
  } catch {
    return null;
  }
}

export function isHttpUrl(value: string): boolean {
  const url = parseUrl(value);
  return url !== null && (url.protocol === 'https:' || url.protocol === 'http:');
}

/** A repository, a branch or anything under one, on gitlab.com or github.com. */
export function isRepoUrl(value: string): boolean {
  const url = parseUrl(value);
  if (!url || !isHttpUrl(value) || !REPO_HOSTS.includes(url.hostname.toLowerCase())) return false;
  return url.pathname.split('/').filter(Boolean).length >= REPO_PATH_MIN_SEGMENTS;
}

/** What the student's link must be, by kind; text deliverables have no link. */
export function isValidSubmissionUrl(kind: DeliverableKind, value: string): boolean {
  if (kind === 'repo') return isRepoUrl(value);
  if (kind === 'docLink') return isHttpUrl(value);
  return value === '';
}

/** Whether a deliverable is for this account: for everybody, or listed. */
export function isDeliverableFor(deliverable: Deliverable, uid: string): boolean {
  return deliverable.forEveryone || deliverable.assignedUids.includes(uid);
}

export function hasContent(submission: Submission): boolean {
  return submission.url !== '' || Object.values(submission.answers).some((answer) => answer.trim() !== '');
}
