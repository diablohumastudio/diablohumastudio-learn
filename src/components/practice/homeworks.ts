import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import type { DocumentData, Unsubscribe } from 'firebase/firestore';
import { assignmentOf, storedAssignment } from '../../data/course/assignment';
import {
  DEFAULT_HOMEWORK_DAILY_GOAL,
  HOMEWORKS_COLLECTION,
  LEGACY_ROUND_ID,
  isDayKey,
  parseQuestionIds,
} from '../../data/practice';
import type { Homework, HomeworkRound, HomeworkSettings } from '../../data/practice';
import { getFirestoreDb } from '../../lib/firebase';
import { fetchAssignedTo } from '../course/assignedQuery';

/* Firestore layout (rules in firebase/firestore.rules):
   homeworks/{homeworkId}   a specific homework: the students it is for read it, only teachers write it.
   Its answers are counted with the student, one doc per round and day:
   students/{uid}/days/hw-{homeworkId}-{roundId}_{day} (progress.ts). */

function goalOf(value: unknown): number {
  return Number(value) || DEFAULT_HOMEWORK_DAILY_GOAL;
}

function toRounds(data: DocumentData): HomeworkRound[] {
  const stored: unknown[] = Array.isArray(data.rounds) ? data.rounds : [];
  const rounds = stored
    .filter((round): round is DocumentData => typeof round === 'object' && round !== null)
    .map((round) => ({
      id: typeof round.id === 'string' ? round.id : LEGACY_ROUND_ID,
      questionIds: parseQuestionIds(round.questionIds),
      goal: goalOf(round.goal),
    }));
  if (rounds.length > 0) return rounds;
  // Saved before rounds existed: its questions and its answers per day are its only round.
  return [{ id: LEGACY_ROUND_ID, questionIds: parseQuestionIds(data.questionIds), goal: goalOf(data.dailyGoal) }];
}

function toHomework(id: string, data: DocumentData): Homework {
  return {
    id,
    title: data.title ?? '',
    courseSlug: data.courseSlug ?? '',
    rounds: toRounds(data),
    firstDay: isDayKey(data.firstDay) ? data.firstDay : '',
    lastDay: isDayKey(data.lastDay) ? data.lastDay : '',
    ...assignmentOf(data),
  };
}

function newestFirst(a: Homework, b: Homework): number {
  return b.firstDay.localeCompare(a.firstDay);
}

/** Teacher page: the homeworks of every course, live. */
export function subscribeAllHomeworks(
  onHomeworks: (homeworks: Homework[]) => void,
  onError: (error: unknown) => void
): Unsubscribe {
  return onSnapshot(
    collection(getFirestoreDb(), HOMEWORKS_COLLECTION),
    (snapshot) =>
      onHomeworks(snapshot.docs.map((homeworkDoc) => toHomework(homeworkDoc.id, homeworkDoc.data())).sort(newestFirst)),
    onError
  );
}

/** The homeworks of a course that are for this student, whatever their dates: the rules only let
    a student read what is for them, so the query names the course and splits in two
    (`fetchAssignedTo`). */
export async function fetchStudentHomeworks(courseSlug: string, uid: string): Promise<Homework[]> {
  const ofCourse = query(collection(getFirestoreDb(), HOMEWORKS_COLLECTION), where('courseSlug', '==', courseSlug));
  const homeworks = await fetchAssignedTo(ofCourse, uid, toHomework);
  return homeworks.sort(newestFirst);
}

/** Firestore refuses `undefined`; the form always sends every field. */
function toStoredSettings(settings: HomeworkSettings): DocumentData {
  return { ...settings, ...storedAssignment(settings.assignedUids) };
}

export async function fetchHomework(homeworkId: string): Promise<Homework | null> {
  const snapshot = await getDoc(doc(getFirestoreDb(), HOMEWORKS_COLLECTION, homeworkId));
  return snapshot.exists() ? toHomework(snapshot.id, snapshot.data()) : null;
}

/** Returns the new homework's id: the teacher is taken to its own page. */
export async function createHomework(settings: HomeworkSettings): Promise<string> {
  const created = await addDoc(collection(getFirestoreDb(), HOMEWORKS_COLLECTION), {
    ...toStoredSettings(settings),
    createdAt: serverTimestamp(),
  });
  return created.id;
}

export async function updateHomework(homeworkId: string, settings: HomeworkSettings): Promise<void> {
  await updateDoc(doc(getFirestoreDb(), HOMEWORKS_COLLECTION, homeworkId), {
    ...toStoredSettings(settings),
    // Where a homework older than the rounds kept what is now in its round.
    questionIds: deleteField(),
    dailyGoal: deleteField(),
  });
}

/** The days students already filled stay in their accounts; nothing shows them any more. */
export async function deleteHomework(homeworkId: string): Promise<void> {
  await deleteDoc(doc(getFirestoreDb(), HOMEWORKS_COLLECTION, homeworkId));
}
