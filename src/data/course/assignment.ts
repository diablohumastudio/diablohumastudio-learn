/* Who a homework, an exam or a deliverable is for: everybody enrolled in its course, or the
   accounts listed. Stored as `assignedUids` with `forEveryone` beside it, because a student's
   list query has to ask for one or the other by equality for the rules to check it
   (docs/courses.md). Shared by the browser, the API routes and the scripts' documentation, so
   it holds no Firebase types. */

export type Assignment = {
  /** The accounts it is for; empty when it is for everybody enrolled in the course. */
  assignedUids: string[];
  /** True exactly when `assignedUids` is empty; stored so a query can ask for it. */
  forEveryone: boolean;
};

/** What listing the assigned needs of an account. */
export type AssignedAccount = { uid: string; displayName: string; email: string };

/** The two fields as stored. A document saved before they existed is for everybody. */
export function assignmentOf(data: Record<string, unknown>): Assignment {
  const assignedUids = Array.isArray(data.assignedUids)
    ? data.assignedUids.filter((uid): uid is string => typeof uid === 'string')
    : [];
  return { assignedUids, forEveryone: data.forEveryone === true || assignedUids.length === 0 };
}

/** The two fields to store for a list of accounts; an empty list means everybody. */
export function storedAssignment(assignedUids: readonly string[]): Assignment {
  return { assignedUids: [...assignedUids], forEveryone: assignedUids.length === 0 };
}

export function isAssignedTo(assignment: Assignment, uid: string): boolean {
  return assignment.forEveryone || assignment.assignedUids.includes(uid);
}

/** The accounts something is for: every member when it is for everybody, else the listed ones.
    A listed account that is no longer enrolled keeps only its uid. */
export function assignedAccounts(assignment: Assignment, members: readonly AssignedAccount[]): AssignedAccount[] {
  if (assignment.forEveryone) return [...members];
  return assignment.assignedUids.map(
    (uid) => members.find((member) => member.uid === uid) ?? { uid, displayName: '', email: '' }
  );
}
