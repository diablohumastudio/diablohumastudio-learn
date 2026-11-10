import type { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import type { MembershipStatus, OwnMembership } from '../../data/course/types';
import { useAuthUser } from '../learn/useAuthUser';
import { useTeacherStatus } from '../learn/useTeacherStatus';
import { subscribeMembership, subscribeOwnRequest } from './members';

export type Membership = {
  status: MembershipStatus;
  /** The signed-in account, or null. */
  user: User | null;
  /** The teacher ticked "Proposes questions" on this student's membership. False for everybody
      else, teachers included: they write the bank from the editor. */
  canProposeQuestions: boolean;
};

/** Where the signed-in account stands in a course: enrolled, waiting for an answer, or neither.
    A teacher is a member of every course. */
export function useMembership(courseSlug: string): Membership {
  const auth = useAuthUser();
  const teacherStatus = useTeacherStatus();
  const uid = auth.status === 'signedIn' ? auth.user.uid : null;
  const [ownMembership, setOwnMembership] = useState<OwnMembership | null>(null);
  const [hasRequested, setHasRequested] = useState<boolean | null>(null);

  useEffect(() => {
    // Without a course yet (the route is still arriving) there is nothing to subscribe to.
    if (!uid || courseSlug === '') return undefined;
    setOwnMembership(null);
    setHasRequested(null);
    const onError = (error: unknown) => console.error('Could not read the membership', error);
    const stopMembership = subscribeMembership(courseSlug, uid, setOwnMembership, onError);
    const stopRequest = subscribeOwnRequest(courseSlug, uid, setHasRequested, onError);
    return () => {
      stopMembership();
      stopRequest();
    };
  }, [courseSlug, uid]);

  if (auth.status === 'loading') return { status: 'loading', user: null, canProposeQuestions: false };
  if (auth.status === 'signedOut') return { status: 'signedOut', user: null, canProposeQuestions: false };
  if (teacherStatus === 'teacher') return { status: 'member', user: auth.user, canProposeQuestions: false };
  if (courseSlug === '' || teacherStatus === 'loading' || ownMembership === null || hasRequested === null) {
    return { status: 'loading', user: auth.user, canProposeQuestions: false };
  }
  if (ownMembership.isMember) {
    return { status: 'member', user: auth.user, canProposeQuestions: ownMembership.canProposeQuestions };
  }
  return { status: hasRequested ? 'requested' : 'notMember', user: auth.user, canProposeQuestions: false };
}
