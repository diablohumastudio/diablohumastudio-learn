import { getDocs, onSnapshot, query, where } from 'firebase/firestore';
import type { DocumentData, Query, QuerySnapshot, Unsubscribe } from 'firebase/firestore';

/* A student may read only what is for them, and a list query has to prove it to the rules, so
   two queries run over the same base, one for the documents for everybody and one for those
   naming the student, and their results are merged (docs/courses.md). The base query already
   names the course and whatever else the rule reads. If Firestore ever asks for a composite
   index for one of them, the error in the console carries the link to create it. */

type ToItem<T> = (id: string, data: DocumentData) => T;

function assignedQueries(base: Query, uid: string): Query[] {
  return [query(base, where('forEveryone', '==', true)), query(base, where('assignedUids', 'array-contains', uid))];
}

function merged<T extends { id: string }>(snapshots: readonly QuerySnapshot[], toItem: ToItem<T>): T[] {
  const byId: Map<string, T> = new Map();
  for (const snapshot of snapshots) {
    for (const item of snapshot.docs) byId.set(item.id, toItem(item.id, item.data()));
  }
  return Array.from(byId.values());
}

/** Live: `onItems` runs whenever either query changes, with everything seen so far, unsorted. */
export function subscribeAssignedTo<T extends { id: string }>(
  base: Query,
  uid: string,
  toItem: ToItem<T>,
  onItems: (items: T[]) => void,
  onError: (error: unknown) => void
): Unsubscribe {
  const latest: Map<number, QuerySnapshot> = new Map();
  const stops = assignedQueries(base, uid).map((partial, index) =>
    onSnapshot(
      partial,
      (snapshot) => {
        latest.set(index, snapshot);
        onItems(merged(Array.from(latest.values()), toItem));
      },
      onError
    )
  );
  return () => stops.forEach((stop) => stop());
}

/** Once: both queries, merged, unsorted. */
export async function fetchAssignedTo<T extends { id: string }>(base: Query, uid: string, toItem: ToItem<T>): Promise<T[]> {
  const snapshots = await Promise.all(assignedQueries(base, uid).map((partial) => getDocs(partial)));
  return merged(snapshots, toItem);
}
