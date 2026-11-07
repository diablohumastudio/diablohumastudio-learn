import type { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import type { MembershipStatus } from '../../data/course/types';
import { useAuthUser } from '../learn/useAuthUser';
import { useTeacherStatus } from '../learn/useTeacherStatus';
import { subscribeMembership, subscribeOwnRequest } from './members';

export type Membership = {
  status: MembershipStatus;
  /** The signed-in account, or null. */
  user: User | null;
};

/** Where the signed-in account stands in a course: enrolled, waiting for an answer, or neither.
    A teacher is a member of every course. */
export function useMembership(courseSlug: string): Membership {
  const auth = useAuthUser();
  const teacherStatus = useTeacherStatus();
  const uid = auth.status === 'signedIn' ? auth.user.uid : null;
  const [isMember, setIsMember] = useState<boolean | null>(null);
  const [hasRequested, setHasRequested] = useState<boolean | null>(null);

  useEffect(() => {
    // Without a course yet (the route is still arriving) there is nothing to subscribe to.
    if (!uid || courseSlug === '') return undefined;
    setIsMember(null);
    setHasRequested(null);
    const onError = (error: unknown) => console.error('Could not read the membership', error);
    const stopMembership = subscribeMembership(courseSlug, uid, setIsMember, onError);
    const stopRequest = subscribeOwnRequest(courseSlug, uid, setHasRequested, onError);
    return () => {
      stopMembership();
      stopRequest();
    };
  }, [courseSlug, uid]);

  if (auth.status === 'loading') return { status: 'loading', user: null };
  if (auth.status === 'signedOut') return { status: 'signedOut', user: null };
  if (teacherStatus === 'teacher') return { status: 'member', user: auth.user };
  if (courseSlug === '' || teacherStatus === 'loading' || isMember === null || hasRequested === null) {
    return { status: 'loading', user: auth.user };
  }
  if (isMember) return { status: 'member', user: auth.user };
  return { status: hasRequested ? 'requested' : 'notMember', user: auth.user };
}
