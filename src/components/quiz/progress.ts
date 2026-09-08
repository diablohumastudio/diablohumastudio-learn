import type { User } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  onSnapshot,
  serverTimestamp,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import type { DocumentData, Timestamp, Unsubscribe } from 'firebase/firestore';
import { getFirestoreDb } from '../../lib/firebase';

/* Firestore layout (rules in firebase/firestore.rules):
   students/{uid}                         profile + lifetime counters
   students/{uid}/questions/{questionId}  attempts per question
   students/{uid}/sessions/{sessionId}    one doc per visit with at least one answer
   teachers/{uid}                         created by hand; grants read access to every student */

const STUDENTS_COLLECTION: string = 'students';
const QUESTIONS_SUBCOLLECTION: string = 'questions';
const SESSIONS_SUBCOLLECTION: string = 'sessions';

export type StudentStats = {
  uid: string;
  displayName: string;
  email: string;
  sessionsPlayed: number;
  totalAnswered: number;
  totalCorrect: number;
  lastPlayedAt: Timestamp | null;
};

export type QuestionStats = {
  questionId: string;
  attempts: number;
  correct: number;
  lastCorrect: boolean;
  lastAnsweredAt: Timestamp | null;
};

function studentRef(uid: string) {
  return doc(getFirestoreDb(), STUDENTS_COLLECTION, uid);
}

function toStudentStats(uid: string, data: DocumentData): StudentStats {
  return {
    uid,
    displayName: data.displayName ?? '',
    email: data.email ?? '',
    sessionsPlayed: data.sessionsPlayed ?? 0,
    totalAnswered: data.totalAnswered ?? 0,
    totalCorrect: data.totalCorrect ?? 0,
    lastPlayedAt: data.lastPlayedAt ?? null,
  };
}

function toQuestionStats(questionId: string, data: DocumentData): QuestionStats {
  return {
    questionId,
    attempts: data.attempts ?? 0,
    correct: data.correct ?? 0,
    lastCorrect: Boolean(data.lastCorrect),
    lastAnsweredAt: data.lastAnsweredAt ?? null,
  };
}

/** Creates the student's profile on first sign-in and keeps name and email current. */
export async function ensureStudentProfile(user: User): Promise<void> {
  const ref = studentRef(user.uid);
  const snapshot = await getDoc(ref);
  const profile = { displayName: user.displayName ?? '', email: user.email ?? '' };
  if (snapshot.exists()) {
    await setDoc(ref, profile, { merge: true });
    return;
  }
  await setDoc(ref, {
    ...profile,
    createdAt: serverTimestamp(),
    sessionsPlayed: 0,
    totalAnswered: 0,
    totalCorrect: 0,
    lastPlayedAt: null,
  });
}

export function subscribeStudent(uid: string, onChange: (stats: StudentStats | null) => void): Unsubscribe {
  return onSnapshot(studentRef(uid), (snapshot) => {
    onChange(snapshot.exists() ? toStudentStats(uid, snapshot.data()) : null);
  });
}

/** A client-side id; the session doc is only written with the first answer. */
export function newSessionId(uid: string): string {
  return doc(collection(studentRef(uid), SESSIONS_SUBCOLLECTION)).id;
}

export async function recordAnswer(
  uid: string,
  sessionId: string,
  questionId: string,
  isCorrect: boolean,
  isFirstAnswerOfSession: boolean
): Promise<void> {
  const db = getFirestoreDb();
  const batch = writeBatch(db);
  const now = serverTimestamp();
  const correctDelta = isCorrect ? 1 : 0;

  batch.set(
    studentRef(uid),
    {
      totalAnswered: increment(1),
      totalCorrect: increment(correctDelta),
      sessionsPlayed: increment(isFirstAnswerOfSession ? 1 : 0),
      lastPlayedAt: now,
    },
    { merge: true }
  );
  batch.set(
    doc(studentRef(uid), QUESTIONS_SUBCOLLECTION, questionId),
    { attempts: increment(1), correct: increment(correctDelta), lastCorrect: isCorrect, lastAnsweredAt: now },
    { merge: true }
  );
  batch.set(
    doc(studentRef(uid), SESSIONS_SUBCOLLECTION, sessionId),
    {
      answered: increment(1),
      correct: increment(correctDelta),
      lastAnswerAt: now,
      ...(isFirstAnswerOfSession ? { startedAt: now } : {}),
    },
    { merge: true }
  );

  await batch.commit();
}

/** Teacher only (the rules reject anyone not in `teachers`). */
export async function fetchAllStudents(): Promise<StudentStats[]> {
  const snapshot = await getDocs(collection(getFirestoreDb(), STUDENTS_COLLECTION));
  return snapshot.docs.map((studentDoc) => toStudentStats(studentDoc.id, studentDoc.data()));
}

export async function fetchStudentQuestions(uid: string): Promise<QuestionStats[]> {
  const snapshot = await getDocs(collection(studentRef(uid), QUESTIONS_SUBCOLLECTION));
  return snapshot.docs.map((questionDoc) => toQuestionStats(questionDoc.id, questionDoc.data()));
}

export function isPermissionDenied(error: unknown): boolean {
  return typeof error === 'object' && error !== null && (error as { code?: string }).code === 'permission-denied';
}
