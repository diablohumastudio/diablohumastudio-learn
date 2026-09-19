import type { Dictionary } from '../../i18n/useT';

/* Shared by the browser and the exam API routes, so it holds no Firebase types:
   every moment is a number of milliseconds since the epoch. See docs/exam.md. */

export const EXAMS_COLLECTION: string = 'exams';
export const ATTEMPTS_SUBCOLLECTION: string = 'attempts';
export const GRADES_SUBCOLLECTION: string = 'grades';
export const PRIVATE_SUBCOLLECTION: string = 'private';
export const PAPER_DOC_ID: string = 'paper';
export const SETTINGS_COLLECTION: string = 'settings';
export const EXAM_LOCK_DOC_ID: string = 'examLock';

/** Answers that reach the server this long after the end still count as on time (slow networks). */
export const SUBMIT_GRACE_MS: number = 60_000;

export type ExamStatus = 'draft' | 'opened';

export type ExamSettings = {
  title: string;
  courseSlug: string | null;
  classSlug: string | null;
  /** Class slugs the scope resolves to, or null for the whole bank. Resolved in the browser
      because the server does not load the Learn registry. */
  topics: string[] | null;
  maxQuestions: number;
  durationMinutes: number;
};

export type Exam = ExamSettings & {
  id: string;
  status: ExamStatus;
  createdAtMs: number | null;
  openedAtMs: number | null;
  /** Fixed when the teacher opens the exam; "Close early" moves it to that moment. */
  closesAtMs: number | null;
  /** Active questions the scope held when the exam was opened; a student gets at most this many. */
  paperSize: number | null;
};

export type ExamOption = {
  id: string;
  text: Dictionary<string>;
};

/** What a student sees: the options in the order they were shown, nothing marking the right one. */
export type ExamQuestion = {
  id: string;
  prompt: Dictionary<string>;
  options: ExamOption[];
};

/** Server only (exams/{id}/private/paper). */
export type PaperQuestion = ExamQuestion & {
  correctOptionId: string;
};

/** Question id → chosen option id. */
export type ExamAnswers = Record<string, string>;

export type AttemptStatus = 'started' | 'submitted';

export type ExamAttempt = {
  uid: string;
  displayName: string;
  email: string;
  status: AttemptStatus;
  questions: ExamQuestion[];
  answers: ExamAnswers;
  startedAtMs: number | null;
  submittedAtMs: number | null;
  late: boolean;
  lateBySeconds: number;
};

export type ExamGrade = {
  uid: string;
  score: number;
  total: number;
  /** Question id → correct option id, only for the questions of this attempt. */
  correctOptionIds: Record<string, string>;
};

export type ExamApiErrorCode =
  | 'unauthenticated'
  | 'notTeacher'
  | 'badRequest'
  | 'notFound'
  | 'notDraft'
  | 'notRunning'
  | 'anotherExamRunning'
  | 'noQuestions'
  | 'notStarted'
  | 'serverNotConfigured'
  | 'internal';

export type StartExamResponse = {
  attemptStatus: AttemptStatus;
  questions: ExamQuestion[];
  closesAtMs: number;
  /** The browser counts down from this, never from the device clock. */
  serverNowMs: number;
};

export function questionsPerStudent(exam: Exam): number {
  return exam.paperSize === null ? exam.maxQuestions : Math.min(exam.maxQuestions, exam.paperSize);
}

export function isExamRunning(exam: Exam, nowMs: number): boolean {
  return exam.status === 'opened' && exam.closesAtMs !== null && nowMs < exam.closesAtMs;
}

export function isExamOver(exam: Exam, nowMs: number): boolean {
  return exam.status === 'opened' && exam.closesAtMs !== null && nowMs >= exam.closesAtMs;
}
