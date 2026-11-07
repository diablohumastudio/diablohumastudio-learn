import type { LearnCourse } from '../../data/learn';
import { isFirebaseConfigured } from '../../lib/firebase';
import CourseDeliverables from '../deliverable/CourseDeliverables';
import CourseAccessCard from './CourseAccessCard';
import { useMembership } from './useMembership';

/* Loaded by the course page with `ssr: false`, like the progress loader: it is the part of the
   page that needs Firebase, so guests never download it with the menu. */

/** The access card for an account that is not enrolled, or the deliverable cards for one that is. */
export default function CourseAccess({ course }: { course: LearnCourse }) {
  const membership = useMembership(course.slug);
  if (!isFirebaseConfigured()) return null;
  if (membership.status === 'member') return <CourseDeliverables course={course} />;
  return <CourseAccessCard course={course} membership={membership} />;
}
