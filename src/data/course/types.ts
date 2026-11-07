/* A course has members: the students enrolled in it. Signing in creates an account, not a
   membership; a student asks for access from the course page and a teacher grants it (a payment
   gateway could write the same member document from the server). See docs/courses.md. */

export const COURSES_COLLECTION: string = 'courses';
export const MEMBERS_SUBCOLLECTION: string = 'members';
export const REQUESTS_SUBCOLLECTION: string = 'requests';

/** Who wrote the membership: a teacher's uid, or one of these. */
export const GRANTED_BY_ENROLL_ALL: string = 'enroll-all';

export type CourseMember = {
  uid: string;
  displayName: string;
  email: string;
  joinedAtMs: number | null;
  grantedBy: string;
};

export type AccessRequest = {
  uid: string;
  displayName: string;
  email: string;
  requestedAtMs: number | null;
};

/** Where an account stands in a course. Teachers count as members everywhere. */
export type MembershipStatus = 'loading' | 'signedOut' | 'member' | 'requested' | 'notMember';

export function memberName(member: { displayName: string; email: string; uid: string }): string {
  return member.displayName || member.email || member.uid;
}

/** Alphabetical, the order of a class list; an account without a name sorts by its email. */
export function byMemberName(a: CourseMember, b: CourseMember): number {
  return memberName(a).localeCompare(memberName(b), undefined, { sensitivity: 'base' });
}
