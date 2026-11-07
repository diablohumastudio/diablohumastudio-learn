import { useEffect, useState } from 'react';
import type { CourseMember } from '../../data/course/types';
import { subscribeMembers } from './members';

/** Teacher only: the members of a course, live; null until they arrive. */
export function useCourseMembers(courseSlug: string): CourseMember[] | null {
  const [members, setMembers] = useState<CourseMember[] | null>(null);

  useEffect(() => {
    setMembers(null);
    return subscribeMembers(courseSlug, setMembers, (error) => {
      // Refused until firebase/firestore.rules names the collection: then nobody is enrolled.
      console.warn('Could not load the members', error);
      setMembers([]);
    });
  }, [courseSlug]);

  return members;
}

export function memberUids(members: readonly CourseMember[] | null): Set<string> {
  return new Set((members ?? []).map((member) => member.uid));
}
