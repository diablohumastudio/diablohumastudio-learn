import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import type { DocumentData, Timestamp, Unsubscribe } from 'firebase/firestore';
import { ATTEMPTS_SUBCOLLECTION, EXAMS_COLLECTION, GRADES_SUBCOLLECTION } from '../../data/exam/types';
import type {
  Exam,
  ExamApiErrorCode,
  ExamAttempt,
  ExamGrade,
  ExamSettings,
  StartExamResponse,
  ExamAnswers,
} from '../../data/exam/types';
import { parseQuestionIds } from '../../data/practice/selection';
import { getFirebaseAuth, getFirestoreDb } from '../../lib/firebase';

/* Firestore layout (rules in firebase/firestore.rules, model in docs/exam.md):
   exams/{examId}                  settings, status, openedAt, closesAt; browsers write drafts only
   exams/{examId}/attempts/{uid}   frozen questions and answers, written by the API routes
   exams/{examId}/grades/{uid}     score and correct options, readable by the student after the end
   exams/{examId}/private/paper    server only */

const EXAM_API_PATH: string = '/api/exam';

export class ExamRequestError extends Error {
  code: ExamApiErrorCode | 'network';

  constructor(code: ExamApiErrorCode | 'network') {
    super(code);
    this.code = code;
  }
}

function millisOf(value: unknown): number | null {
  return value && typeof (value as Timestamp).toMillis === 'function' ? (value as Timestamp).toMillis() : null;
}

function toExam(id: string, data: DocumentData): Exam {
  return {
    id,
    title: data.title ?? '',
    courseSlug: data.courseSlug ?? null,
    questionIds: parseQuestionIds(data.questionIds),
    maxQuestions: Number(data.maxQuestions) || 0,
    durationMinutes: Number(data.durationMinutes) || 0,
    status: data.status === 'opened' ? 'opened' : 'draft',
    createdAtMs: millisOf(data.createdAt),
    openedAtMs: millisOf(data.openedAt),
    closesAtMs: millisOf(data.closesAt),
    paperSize: typeof data.paperSize === 'number' ? data.paperSize : null,
  };
}

function toAttempt(uid: string, data: DocumentData): ExamAttempt {
  return {
    uid,
    displayName: data.displayName ?? '',
    email: data.email ?? '',
    status: data.status === 'submitted' ? 'submitted' : 'started',
    questions: Array.isArray(data.questions) ? data.questions : [],
    answers: data.answers ?? {},
    startedAtMs: millisOf(data.startedAt),
    submittedAtMs: millisOf(data.submittedAt),
    late: Boolean(data.late),
    lateBySeconds: Number(data.lateBySeconds) || 0,
  };
}

function toGrade(uid: string, data: DocumentData): ExamGrade {
  return {
    uid,
    score: Number(data.score) || 0,
    total: Number(data.total) || 0,
    correctOptionIds: data.correctOptionIds ?? {},
  };
}

function newestFirst(a: Exam, b: Exam): number {
  return (b.openedAtMs ?? b.createdAtMs ?? Infinity) - (a.openedAtMs ?? a.createdAtMs ?? Infinity);
}

/** Teacher only: every exam, drafts included. */
export function subscribeAllExams(onExams: (exams: Exam[]) => void, onError: (error: unknown) => void): Unsubscribe {
  return onSnapshot(
    collection(getFirestoreDb(), EXAMS_COLLECTION),
    (snapshot) => onExams(snapshot.docs.map((examDoc) => toExam(examDoc.id, examDoc.data())).sort(newestFirst)),
    onError
  );
}

/** The rules only let a student list opened exams, so the query has to ask for exactly those. */
export function subscribeOpenedExams(onExams: (exams: Exam[]) => void, onError: (error: unknown) => void): Unsubscribe {
  return onSnapshot(
    query(collection(getFirestoreDb(), EXAMS_COLLECTION), where('status', '==', 'opened')),
    (snapshot) => onExams(snapshot.docs.map((examDoc) => toExam(examDoc.id, examDoc.data())).sort(newestFirst)),
    onError
  );
}

export function subscribeExam(
  examId: string,
  onExam: (exam: Exam | null) => void,
  onError: (error: unknown) => void
): Unsubscribe {
  return onSnapshot(
    doc(getFirestoreDb(), EXAMS_COLLECTION, examId),
    (snapshot) => onExam(snapshot.exists() ? toExam(snapshot.id, snapshot.data()) : null),
    onError
  );
}

export async function createDraft(settings: ExamSettings): Promise<void> {
  await addDoc(collection(getFirestoreDb(), EXAMS_COLLECTION), {
    ...settings,
    status: 'draft',
    createdAt: serverTimestamp(),
  });
}

export async function updateDraft(examId: string, settings: ExamSettings): Promise<void> {
  await updateDoc(doc(getFirestoreDb(), EXAMS_COLLECTION, examId), { ...settings });
}

export async function deleteDraft(examId: string): Promise<void> {
  await deleteDoc(doc(getFirestoreDb(), EXAMS_COLLECTION, examId));
}

export function subscribeAttempts(
  examId: string,
  onAttempts: (attempts: ExamAttempt[]) => void,
  onError: (error: unknown) => void
): Unsubscribe {
  return onSnapshot(
    collection(getFirestoreDb(), EXAMS_COLLECTION, examId, ATTEMPTS_SUBCOLLECTION),
    (snapshot) => onAttempts(snapshot.docs.map((attemptDoc) => toAttempt(attemptDoc.id, attemptDoc.data()))),
    onError
  );
}

export function subscribeGrades(
  examId: string,
  onGrades: (grades: ExamGrade[]) => void,
  onError: (error: unknown) => void
): Unsubscribe {
  return onSnapshot(
    collection(getFirestoreDb(), EXAMS_COLLECTION, examId, GRADES_SUBCOLLECTION),
    (snapshot) => onGrades(snapshot.docs.map((gradeDoc) => toGrade(gradeDoc.id, gradeDoc.data()))),
    onError
  );
}

export async function fetchOwnAttempt(examId: string, uid: string): Promise<ExamAttempt | null> {
  const snapshot = await getDoc(doc(getFirestoreDb(), EXAMS_COLLECTION, examId, ATTEMPTS_SUBCOLLECTION, uid));
  return snapshot.exists() ? toAttempt(uid, snapshot.data()) : null;
}

/** Denied by the rules until the exam clock is over. */
export async function fetchOwnGrade(examId: string, uid: string): Promise<ExamGrade | null> {
  const snapshot = await getDoc(doc(getFirestoreDb(), EXAMS_COLLECTION, examId, GRADES_SUBCOLLECTION, uid));
  return snapshot.exists() ? toGrade(uid, snapshot.data()) : null;
}

async function callExamApi<T>(action: string, body: Record<string, unknown>): Promise<T> {
  const user = getFirebaseAuth().currentUser;
  if (!user) throw new ExamRequestError('unauthenticated');
  let response: Response;
  try {
    response = await fetch(`${EXAM_API_PATH}/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await user.getIdToken()}` },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ExamRequestError('network');
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new ExamRequestError(payload.error ?? 'internal');
  return payload as T;
}

export function openExam(examId: string): Promise<unknown> {
  return callExamApi('open', { examId });
}

export function closeExam(examId: string): Promise<unknown> {
  return callExamApi('close', { examId });
}

export function startExam(examId: string): Promise<StartExamResponse> {
  return callExamApi<StartExamResponse>('start', { examId });
}

export function submitExam(examId: string, answers: ExamAnswers): Promise<unknown> {
  return callExamApi('submit', { examId, answers });
}
