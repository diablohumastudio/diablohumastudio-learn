import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import type { DocumentData, Unsubscribe } from 'firebase/firestore';
import { assignmentOf, storedAssignment } from '../../data/course/assignment';
import {
  DEFAULT_DURATION_MINUTES,
  DEFAULT_MAX_SCORE,
  DELIVERABLES_COLLECTION,
  REVIEWS_SUBCOLLECTION,
  SUBMISSIONS_SUBCOLLECTION,
  emptyTypingSignals,
  isDeliverableKind,
  isDeliverableRole,
} from '../../data/deliverable/types';
import type {
  Deliverable,
  DeliverableQuestion,
  DeliverableSettings,
  Review,
  Submission,
  SubmissionAnswers,
  TypingJump,
  TypingSample,
  TypingSignals,
} from '../../data/deliverable/types';
import { getFirestoreDb } from '../../lib/firebase';
import { subscribeAssignedTo } from '../course/assignedQuery';

/* Firestore layout (rules in firebase/firestore.rules, model in docs/deliverables.md):
   deliverables/{id}                   settings, status, openedAt, closesAt; teachers write it all
   deliverables/{id}/submissions/{uid} what the student saved, stamped by the server; the owner writes
   deliverables/{id}/reviews/{uid}     score and comment, written by a teacher, read by the owner */

function millisOf(value: unknown): number | null {
  return value && typeof (value as Timestamp).toMillis === 'function' ? (value as Timestamp).toMillis() : null;
}

function toQuestions(value: unknown): DeliverableQuestion[] {
  const stored: unknown[] = Array.isArray(value) ? value : [];
  return stored
    .filter((question): question is DocumentData => typeof question === 'object' && question !== null)
    .filter((question) => typeof question.id === 'string' && typeof question.text === 'string')
    .map((question) => ({
      id: question.id,
      text: question.text,
      maxChars: typeof question.maxChars === 'number' && question.maxChars > 0 ? question.maxChars : null,
    }));
}

function toDeliverable(id: string, data: DocumentData): Deliverable {
  return {
    id,
    title: data.title ?? '',
    courseSlug: data.courseSlug ?? '',
    role: isDeliverableRole(data.role) ? data.role : 'homework',
    kind: isDeliverableKind(data.kind) ? data.kind : 'text',
    guideUrl: typeof data.guideUrl === 'string' ? data.guideUrl : '',
    instructions: typeof data.instructions === 'string' ? data.instructions : '',
    questions: toQuestions(data.questions),
    maxScore: Number(data.maxScore) || DEFAULT_MAX_SCORE,
    durationMinutes: Number(data.durationMinutes) || DEFAULT_DURATION_MINUTES,
    deadlineMs: millisOf(data.deadline),
    ...assignmentOf(data),
    status: data.status === 'opened' ? 'opened' : 'draft',
    createdAtMs: millisOf(data.createdAt),
    openedAtMs: millisOf(data.openedAt),
    closesAtMs: millisOf(data.closesAt),
  };
}

function toAnswers(value: unknown): SubmissionAnswers {
  if (typeof value !== 'object' || value === null) return {};
  const answers: SubmissionAnswers = {};
  for (const [questionId, answer] of Object.entries(value)) {
    if (typeof answer === 'string') answers[questionId] = answer;
  }
  return answers;
}

function toJumps(value: unknown): TypingJump[] {
  const stored: unknown[] = Array.isArray(value) ? value : [];
  return stored
    .filter((jump): jump is DocumentData => typeof jump === 'object' && jump !== null)
    .map((jump) => ({
      atSeconds: Number(jump.atSeconds) || 0,
      chars: Number(jump.chars) || 0,
      questionId: typeof jump.questionId === 'string' ? jump.questionId : '',
    }));
}

function toSamples(value: unknown): TypingSample[] {
  const stored: unknown[] = Array.isArray(value) ? value : [];
  return stored
    .filter((sample): sample is DocumentData => typeof sample === 'object' && sample !== null)
    .map((sample) => ({ atSeconds: Number(sample.atSeconds) || 0, chars: Number(sample.chars) || 0 }));
}

function toTypingSignals(value: unknown): TypingSignals | null {
  if (typeof value !== 'object' || value === null) return null;
  const data = value as DocumentData;
  return {
    ...emptyTypingSignals(),
    pasteAttempts: Number(data.pasteAttempts) || 0,
    dropAttempts: Number(data.dropAttempts) || 0,
    focusLosses: Number(data.focusLosses) || 0,
    jumps: toJumps(data.jumps),
    samples: toSamples(data.samples),
    elapsedSeconds: Number(data.elapsedSeconds) || 0,
    activeSeconds: Number(data.activeSeconds) || 0,
    maxCharsPerMinute: Number(data.maxCharsPerMinute) || 0,
  };
}

function toSubmission(uid: string, data: DocumentData): Submission {
  return {
    uid,
    displayName: data.displayName ?? '',
    email: data.email ?? '',
    answers: toAnswers(data.answers),
    url: typeof data.url === 'string' ? data.url : '',
    typing: toTypingSignals(data.typing),
    firstSavedAtMs: millisOf(data.firstSavedAt),
    savedAtMs: millisOf(data.savedAt),
  };
}

function toReview(uid: string, data: DocumentData): Review {
  return {
    uid,
    score: typeof data.score === 'number' ? data.score : null,
    maxScore: Number(data.maxScore) || DEFAULT_MAX_SCORE,
    comment: typeof data.comment === 'string' ? data.comment : '',
    reviewedAtMs: millisOf(data.reviewedAt),
    reviewedBy: typeof data.reviewedBy === 'string' ? data.reviewedBy : '',
  };
}

function newestFirst(a: Deliverable, b: Deliverable): number {
  return (b.openedAtMs ?? b.createdAtMs ?? Infinity) - (a.openedAtMs ?? a.createdAtMs ?? Infinity);
}

function deliverableRef(deliverableId: string) {
  return doc(getFirestoreDb(), DELIVERABLES_COLLECTION, deliverableId);
}

function submissionRef(deliverableId: string, uid: string) {
  return doc(deliverableRef(deliverableId), SUBMISSIONS_SUBCOLLECTION, uid);
}

function reviewRef(deliverableId: string, uid: string) {
  return doc(deliverableRef(deliverableId), REVIEWS_SUBCOLLECTION, uid);
}

/** Firestore refuses `undefined` and a `deadline` of null is a value; the form always sends every field. */
function toStoredSettings(settings: DeliverableSettings): DocumentData {
  return {
    title: settings.title,
    courseSlug: settings.courseSlug,
    role: settings.role,
    kind: settings.kind,
    guideUrl: settings.guideUrl,
    instructions: settings.instructions,
    questions: settings.questions.map((question) => ({ ...question })),
    maxScore: settings.maxScore,
    durationMinutes: settings.durationMinutes,
    deadline: settings.deadlineMs === null ? null : Timestamp.fromMillis(settings.deadlineMs),
    ...storedAssignment(settings.assignedUids),
  };
}

/** Teacher only: every deliverable, drafts included. */
export function subscribeAllDeliverables(
  onDeliverables: (deliverables: Deliverable[]) => void,
  onError: (error: unknown) => void
): Unsubscribe {
  return onSnapshot(
    collection(getFirestoreDb(), DELIVERABLES_COLLECTION),
    (snapshot) =>
      onDeliverables(snapshot.docs.map((item) => toDeliverable(item.id, item.data())).sort(newestFirst)),
    onError
  );
}

/** The opened deliverables of a course that are for this student: the rules only let a student
    read what is for them, so the query names the course and the status and splits in two
    (`subscribeAssignedTo`). */
export function subscribeStudentDeliverables(
  courseSlug: string,
  uid: string,
  onDeliverables: (deliverables: Deliverable[]) => void,
  onError: (error: unknown) => void
): Unsubscribe {
  const opened = query(
    collection(getFirestoreDb(), DELIVERABLES_COLLECTION),
    where('status', '==', 'opened'),
    where('courseSlug', '==', courseSlug)
  );
  return subscribeAssignedTo(opened, uid, toDeliverable, (deliverables) => onDeliverables(deliverables.sort(newestFirst)), onError);
}

export function subscribeDeliverable(
  deliverableId: string,
  onDeliverable: (deliverable: Deliverable | null) => void,
  onError: (error: unknown) => void
): Unsubscribe {
  return onSnapshot(
    deliverableRef(deliverableId),
    (snapshot) => onDeliverable(snapshot.exists() ? toDeliverable(snapshot.id, snapshot.data()) : null),
    onError
  );
}

/** Returns the new deliverable's id: the teacher is taken to its own page. */
export async function createDeliverable(settings: DeliverableSettings): Promise<string> {
  const created = await addDoc(collection(getFirestoreDb(), DELIVERABLES_COLLECTION), {
    ...toStoredSettings(settings),
    status: 'draft',
    createdAt: serverTimestamp(),
  });
  return created.id;
}

export async function updateDeliverable(deliverableId: string, settings: DeliverableSettings): Promise<void> {
  await updateDoc(deliverableRef(deliverableId), toStoredSettings(settings));
}

/** The submissions already saved stay in the subcollection; nothing shows them any more. */
export async function deleteDeliverable(deliverableId: string): Promise<void> {
  await deleteDoc(deliverableRef(deliverableId));
}

/** Opens for every student at once; `closesAtMs` is the teacher's clock, which the rules then enforce. */
export async function openDeliverable(deliverableId: string, closesAtMs: number): Promise<void> {
  await updateDoc(deliverableRef(deliverableId), {
    status: 'opened',
    openedAt: serverTimestamp(),
    closesAt: Timestamp.fromMillis(closesAtMs),
  });
}

export async function closeDeliverableNow(deliverableId: string): Promise<void> {
  await updateDoc(deliverableRef(deliverableId), { closesAt: serverTimestamp() });
}

export async function setDeliverableClose(deliverableId: string, closesAtMs: number): Promise<void> {
  await updateDoc(deliverableRef(deliverableId), { closesAt: Timestamp.fromMillis(closesAtMs) });
}

export function subscribeSubmissions(
  deliverableId: string,
  onSubmissions: (submissions: Submission[]) => void,
  onError: (error: unknown) => void
): Unsubscribe {
  return onSnapshot(
    collection(deliverableRef(deliverableId), SUBMISSIONS_SUBCOLLECTION),
    (snapshot) => onSubmissions(snapshot.docs.map((item) => toSubmission(item.id, item.data()))),
    onError
  );
}

export function subscribeReviews(
  deliverableId: string,
  onReviews: (reviews: Review[]) => void,
  onError: (error: unknown) => void
): Unsubscribe {
  return onSnapshot(
    collection(deliverableRef(deliverableId), REVIEWS_SUBCOLLECTION),
    (snapshot) => onReviews(snapshot.docs.map((item) => toReview(item.id, item.data()))),
    onError
  );
}

/** One student's submission: their own, or anybody's for a teacher (the rules decide). */
export async function fetchSubmission(deliverableId: string, uid: string): Promise<Submission | null> {
  const snapshot = await getDoc(submissionRef(deliverableId, uid));
  return snapshot.exists() ? toSubmission(uid, snapshot.data()) : null;
}

export async function fetchReview(deliverableId: string, uid: string): Promise<Review | null> {
  const snapshot = await getDoc(reviewRef(deliverableId, uid));
  return snapshot.exists() ? toReview(uid, snapshot.data()) : null;
}

export function subscribeReview(
  deliverableId: string,
  uid: string,
  onReview: (review: Review | null) => void,
  onError: (error: unknown) => void
): Unsubscribe {
  return onSnapshot(
    reviewRef(deliverableId, uid),
    (snapshot) => onReview(snapshot.exists() ? toReview(uid, snapshot.data()) : null),
    onError
  );
}

export type SubmissionPayload = {
  displayName: string;
  email: string;
  answers: SubmissionAnswers;
  url: string;
  typing: TypingSignals | null;
};

/** The server stamps `savedAt`; the rules refuse any other value, so lateness is never the device's word.
    `firstSavedAt` is set with the first save only: the rules keep it from changing afterwards. */
export async function saveSubmission(
  deliverableId: string,
  uid: string,
  payload: SubmissionPayload,
  isFirstSave: boolean
): Promise<void> {
  await setDoc(
    submissionRef(deliverableId, uid),
    {
      ...payload,
      savedAt: serverTimestamp(),
      ...(isFirstSave ? { firstSavedAt: serverTimestamp() } : {}),
    },
    { merge: true }
  );
}

export type ReviewPayload = {
  score: number | null;
  maxScore: number;
  comment: string;
  reviewedBy: string;
};

export async function saveReview(deliverableId: string, uid: string, payload: ReviewPayload): Promise<void> {
  await setDoc(reviewRef(deliverableId, uid), { ...payload, reviewedAt: serverTimestamp() });
}
