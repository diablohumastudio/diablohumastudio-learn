import type { User } from 'firebase/auth';
import { addDoc, collection, onSnapshot, query, serverTimestamp, where } from 'firebase/firestore';
import type { CollectionReference, DocumentData, QuerySnapshot, Timestamp, Unsubscribe } from 'firebase/firestore';
import {
  QUESTION_PROPOSALS_COLLECTION,
  byNewestProposal,
  isProposalStatus,
  parseProposalContent,
} from '../../data/practice/proposal';
import type { ProposalContent, ProposalStatus, QuestionProposal } from '../../data/practice/proposal';
import { getFirestoreDb } from '../../lib/firebase';
import { identityOf } from '../course/members';

/* Firestore layout (rules in firebase/firestore.rules, model in docs/practice.md):
   questionProposals/{id}   a question a student proposes for a course's bank; created by a student
                            the teacher allowed (`canProposeQuestions` on the membership), read by
                            its author and by teachers, decided by a teacher */

const PENDING_STATUS: ProposalStatus = 'pending';

function proposalsCollection(): CollectionReference {
  return collection(getFirestoreDb(), QUESTION_PROPOSALS_COLLECTION);
}

function millisOf(value: unknown): number | null {
  return value && typeof (value as Timestamp).toMillis === 'function' ? (value as Timestamp).toMillis() : null;
}

function textOf(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function toProposal(id: string, data: DocumentData): QuestionProposal {
  if (!isProposalStatus(data.status)) throw new Error(`${id}: unknown status`);
  return {
    id,
    ...parseProposalContent(id, data),
    courseSlug: textOf(data.courseSlug),
    status: data.status,
    proposedByUid: textOf(data.proposedByUid),
    proposedByName: textOf(data.proposedByName),
    proposedByEmail: textOf(data.proposedByEmail),
    createdAtMs: millisOf(data.createdAt),
    ...(typeof data.questionId === 'string' ? { questionId: data.questionId } : {}),
    ...(typeof data.decidedByUid === 'string' ? { decidedByUid: data.decidedByUid } : {}),
    ...(typeof data.decidedByName === 'string' ? { decidedByName: data.decidedByName } : {}),
    ...(data.decidedAt !== undefined ? { decidedAtMs: millisOf(data.decidedAt) } : {}),
    ...(typeof data.reason === 'string' && data.reason !== '' ? { reason: data.reason } : {}),
  };
}

/* A malformed proposal is skipped with a warning, like a malformed question of the bank. */
function toProposals(snapshot: QuerySnapshot): QuestionProposal[] {
  const proposals: QuestionProposal[] = [];
  for (const proposalDoc of snapshot.docs) {
    try {
      proposals.push(toProposal(proposalDoc.id, proposalDoc.data()));
    } catch (error) {
      console.warn('Skipping a malformed proposal', error);
    }
  }
  return proposals.sort(byNewestProposal);
}

/* Firestore rejects `undefined` fields, so optional ones are only spread when present. */
function contentDocument(content: ProposalContent): DocumentData {
  return {
    ...(content.topic ? { topic: content.topic } : {}),
    prompt: content.prompt,
    correct: content.correct,
    incorrect: content.incorrect,
    ...(content.explanation ? { explanation: content.explanation } : {}),
  };
}

/** A student sends a proposal for a course. The rules refuse it unless a teacher ticked
    "Proposes questions" on the student's membership of that course. */
export async function createProposal(courseSlug: string, user: User, content: ProposalContent): Promise<void> {
  const author = identityOf(user);
  await addDoc(proposalsCollection(), {
    courseSlug,
    ...contentDocument(content),
    status: PENDING_STATUS,
    proposedByUid: author.uid,
    proposedByName: author.displayName,
    proposedByEmail: author.email,
    createdAt: serverTimestamp(),
  });
}

/** The student's own proposals for one course, newest first, live. The query names the author
    because the rule reads `proposedByUid`: a query without it is refused. The course is filtered
    here, in the browser. */
export function subscribeOwnProposals(
  courseSlug: string,
  uid: string,
  onProposals: (proposals: QuestionProposal[]) => void,
  onError: (error: unknown) => void
): Unsubscribe {
  const ownProposals = query(proposalsCollection(), where('proposedByUid', '==', uid));
  return onSnapshot(
    ownProposals,
    (snapshot) => onProposals(toProposals(snapshot).filter((proposal) => proposal.courseSlug === courseSlug)),
    onError
  );
}
