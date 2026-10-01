import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import type { DocumentData, Unsubscribe } from 'firebase/firestore';
import { DEFAULT_HOMEWORK_DAILY_GOAL, HOMEWORKS_COLLECTION, isDayKey, parseQuestionIds } from '../../data/practice';
import type { Homework, HomeworkSettings } from '../../data/practice';
import { getFirestoreDb } from '../../lib/firebase';

/* Firestore layout (rules in firebase/firestore.rules):
   homeworks/{homeworkId}   a specific homework: any signed-in user reads it, only teachers write it.
   Its answers are counted with the student: students/{uid}/days/hw-{homeworkId}_{day} (progress.ts). */

function toHomework(id: string, data: DocumentData): Homework {
  return {
    id,
    title: data.title ?? '',
    courseSlug: data.courseSlug ?? '',
    questionIds: parseQuestionIds(data.questionIds),
    firstDay: isDayKey(data.firstDay) ? data.firstDay : '',
    lastDay: isDayKey(data.lastDay) ? data.lastDay : '',
    dailyGoal: Number(data.dailyGoal) || DEFAULT_HOMEWORK_DAILY_GOAL,
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

export async function fetchCourseHomeworks(courseSlug: string): Promise<Homework[]> {
  const snapshot = await getDocs(
    query(collection(getFirestoreDb(), HOMEWORKS_COLLECTION), where('courseSlug', '==', courseSlug))
  );
  return snapshot.docs.map((homeworkDoc) => toHomework(homeworkDoc.id, homeworkDoc.data())).sort(newestFirst);
}

export async function fetchHomework(homeworkId: string): Promise<Homework | null> {
  const snapshot = await getDoc(doc(getFirestoreDb(), HOMEWORKS_COLLECTION, homeworkId));
  return snapshot.exists() ? toHomework(snapshot.id, snapshot.data()) : null;
}

export async function createHomework(settings: HomeworkSettings): Promise<void> {
  await addDoc(collection(getFirestoreDb(), HOMEWORKS_COLLECTION), { ...settings, createdAt: serverTimestamp() });
}

export async function updateHomework(homeworkId: string, settings: HomeworkSettings): Promise<void> {
  await updateDoc(doc(getFirestoreDb(), HOMEWORKS_COLLECTION, homeworkId), { ...settings });
}

/** The days students already filled stay in their accounts; nothing shows them any more. */
export async function deleteHomework(homeworkId: string): Promise<void> {
  await deleteDoc(doc(getFirestoreDb(), HOMEWORKS_COLLECTION, homeworkId));
}
