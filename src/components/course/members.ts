import type { User } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import type { DocumentData, Timestamp, Unsubscribe } from 'firebase/firestore';
import {
  COURSES_COLLECTION,
  GRANTED_BY_ENROLL_ALL,
  MEMBERS_SUBCOLLECTION,
  REQUESTS_SUBCOLLECTION,
  byMemberName,
} from '../../data/course/types';
import type { AccessRequest, CourseMember } from '../../data/course/types';
import { getFirestoreDb } from '../../lib/firebase';

/* Firestore layout (rules in firebase/firestore.rules, model in docs/courses.md):
   courses/{courseSlug}/members/{uid}    an enrolled student; teachers write, the owner reads
   courses/{courseSlug}/requests/{uid}   a student asking for access; the owner creates, teachers delete
   The course document itself does not exist: Firestore keeps subcollections without a parent. */

/** The fields the member and request documents share, copied from the account at the time. */
export type AccountIdentity = {
  uid: string;
  displayName: string;
  email: string;
};

function millisOf(value: unknown): number | null {
  return value && typeof (value as Timestamp).toMillis === 'function' ? (value as Timestamp).toMillis() : null;
}

function memberRef(courseSlug: string, uid: string) {
  return doc(getFirestoreDb(), COURSES_COLLECTION, courseSlug, MEMBERS_SUBCOLLECTION, uid);
}

function requestRef(courseSlug: string, uid: string) {
  return doc(getFirestoreDb(), COURSES_COLLECTION, courseSlug, REQUESTS_SUBCOLLECTION, uid);
}

function toMember(uid: string, data: DocumentData): CourseMember {
  return {
    uid,
    displayName: typeof data.displayName === 'string' ? data.displayName : '',
    email: typeof data.email === 'string' ? data.email : '',
    joinedAtMs: millisOf(data.joinedAt),
    grantedBy: typeof data.grantedBy === 'string' ? data.grantedBy : '',
  };
}

function toRequest(uid: string, data: DocumentData): AccessRequest {
  return {
    uid,
    displayName: typeof data.displayName === 'string' ? data.displayName : '',
    email: typeof data.email === 'string' ? data.email : '',
    requestedAtMs: millisOf(data.requestedAt),
  };
}

export function identityOf(user: User): AccountIdentity {
  return { uid: user.uid, displayName: user.displayName ?? '', email: user.email ?? '' };
}

/** Whether this account is enrolled: its own member document, which the rules let it read. */
export function subscribeMembership(
  courseSlug: string,
  uid: string,
  onChange: (isMember: boolean) => void,
  onError: (error: unknown) => void
): Unsubscribe {
  return onSnapshot(memberRef(courseSlug, uid), (snapshot) => onChange(snapshot.exists()), onError);
}

/** Whether this account has asked for access and nobody has answered yet. */
export function subscribeOwnRequest(
  courseSlug: string,
  uid: string,
  onChange: (hasRequested: boolean) => void,
  onError: (error: unknown) => void
): Unsubscribe {
  return onSnapshot(requestRef(courseSlug, uid), (snapshot) => onChange(snapshot.exists()), onError);
}

export async function requestAccess(courseSlug: string, user: User): Promise<void> {
  await setDoc(requestRef(courseSlug, user.uid), { ...identityOf(user), requestedAt: serverTimestamp() });
}

/** Teacher only: everybody enrolled, alphabetical, live. */
export function subscribeMembers(
  courseSlug: string,
  onMembers: (members: CourseMember[]) => void,
  onError: (error: unknown) => void
): Unsubscribe {
  return onSnapshot(
    collection(getFirestoreDb(), COURSES_COLLECTION, courseSlug, MEMBERS_SUBCOLLECTION),
    (snapshot) => onMembers(snapshot.docs.map((item) => toMember(item.id, item.data())).sort(byMemberName)),
    onError
  );
}

export async function fetchMembers(courseSlug: string): Promise<CourseMember[]> {
  const snapshot = await getDocs(collection(getFirestoreDb(), COURSES_COLLECTION, courseSlug, MEMBERS_SUBCOLLECTION));
  return snapshot.docs.map((item) => toMember(item.id, item.data())).sort(byMemberName);
}

/** Teacher only: the pending requests, oldest first. */
export function subscribeRequests(
  courseSlug: string,
  onRequests: (requests: AccessRequest[]) => void,
  onError: (error: unknown) => void
): Unsubscribe {
  return onSnapshot(
    collection(getFirestoreDb(), COURSES_COLLECTION, courseSlug, REQUESTS_SUBCOLLECTION),
    (snapshot) =>
      onRequests(
        snapshot.docs
          .map((item) => toRequest(item.id, item.data()))
          .sort((a, b) => (a.requestedAtMs ?? 0) - (b.requestedAtMs ?? 0))
      ),
    onError
  );
}

/** Enrolls one account and, if it had asked, closes its request in the same write. */
export async function addMember(courseSlug: string, account: AccountIdentity, grantedBy: string): Promise<void> {
  const batch = writeBatch(getFirestoreDb());
  batch.set(memberRef(courseSlug, account.uid), {
    displayName: account.displayName,
    email: account.email,
    joinedAt: serverTimestamp(),
    grantedBy,
  });
  batch.delete(requestRef(courseSlug, account.uid));
  await batch.commit();
}

export async function removeMember(courseSlug: string, uid: string): Promise<void> {
  await deleteDoc(memberRef(courseSlug, uid));
}

/** Rejecting is deleting the request: the student may ask again. */
export async function deleteRequest(courseSlug: string, uid: string): Promise<void> {
  await deleteDoc(requestRef(courseSlug, uid));
}

/** Enrolls every account given that is not enrolled yet: the migration of a course whose every
    account already belongs to it. */
export async function enrollAll(courseSlug: string, accounts: readonly AccountIdentity[], alreadyMembers: ReadonlySet<string>): Promise<number> {
  const batch = writeBatch(getFirestoreDb());
  let count = 0;
  for (const account of accounts) {
    if (alreadyMembers.has(account.uid)) continue;
    batch.set(memberRef(courseSlug, account.uid), {
      displayName: account.displayName,
      email: account.email,
      joinedAt: serverTimestamp(),
      grantedBy: GRANTED_BY_ENROLL_ALL,
    });
    batch.delete(requestRef(courseSlug, account.uid));
    count += 1;
  }
  if (count > 0) await batch.commit();
  return count;
}
