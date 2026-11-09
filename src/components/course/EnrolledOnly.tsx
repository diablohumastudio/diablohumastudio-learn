import type { ReactNode } from 'react';
import type { LearnCourse } from '../../data/learn';
import { learnDict } from '../../i18n/learn';
import { useT } from '../../i18n/useT';
import { isFirebaseConfigured } from '../../lib/firebase';
import SignInRedirect from '../learn/SignInRedirect';
import ui from '../learn/ui.module.css';
import { useAuthUser } from '../learn/useAuthUser';
import NotEnrolledNotice from './NotEnrolledNotice';
import { useMembership } from './useMembership';

type EnrolledOnlyProps = {
  course: LearnCourse;
  /** Rendered for a signed-in member of the course, with their uid. */
  children: (uid: string) => ReactNode;
};

/** The gate of a course page that only its students may see: a guest is sent to sign in, an
    account that is not enrolled gets the notice with the way back to the course. */
export default function EnrolledOnly({ course, children }: EnrolledOnlyProps) {
  const t = useT(learnDict);
  const auth = useAuthUser();
  const membership = useMembership(course.slug);

  if (!isFirebaseConfigured()) {
    return (
      <div className={ui.centered}>
        <p className={ui.error}>{t.notConfigured}</p>
      </div>
    );
  }
  if (auth.status === 'loading' || membership.status === 'loading') {
    return (
      <div className={ui.centered}>
        <span className={ui.mono}>{t.loading}</span>
      </div>
    );
  }
  if (auth.status === 'signedOut') return <SignInRedirect />;
  if (membership.status !== 'member') return <NotEnrolledNotice course={course} />;
  return <>{children(auth.user.uid)}</>;
}
