import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Deliverable } from '../../data/deliverable/types';
import { coursePath } from '../../data/learn';
import type { LearnCourse } from '../../data/learn';
import { dayKey } from '../../data/practice';
import { learnDict } from '../../i18n/learn';
import { useT } from '../../i18n/useT';
import { isFirebaseConfigured } from '../../lib/firebase';
import EntriesCard from '../course/EntriesCard';
import NotEnrolledNotice from '../course/NotEnrolledNotice';
import { deliverableEntries, finishedEntries, homeworkEntries, openEntries } from '../course/entries';
import { useMembership } from '../course/useMembership';
import { subscribeStudentDeliverables } from '../deliverable/deliverables';
import { useNowMs } from '../deliverable/useNowMs';
import menu from '../learn/LearnMenu.module.css';
import SignInRedirect from '../learn/SignInRedirect';
import ui from '../learn/ui.module.css';
import { useAuthUser } from '../learn/useAuthUser';
import { CourseProgressProvider, useCourseProgress } from './CourseProgressContext';

const STATE_TICK_MS: number = 1000;

/** Every homework of the student in the course, specific and deliverable: the open ones, then the finished ones. */
function HomeworksPage({ course, uid }: { course: LearnCourse; uid: string }) {
  const t = useT(learnDict);
  const nowMs = useNowMs(STATE_TICK_MS);
  const progress = useCourseProgress();
  const today = dayKey(new Date());
  const [deliverables, setDeliverables] = useState<Deliverable[] | null>(null);

  useEffect(
    () =>
      subscribeStudentDeliverables(course.slug, uid, setDeliverables, (error) => {
        console.warn('Could not load the deliverables', error);
        setDeliverables([]);
      }),
    [course.slug, uid]
  );

  const entries =
    progress === null || deliverables === null
      ? null
      : [
          ...homeworkEntries(course, progress.homeworks, progress.homeworkDays, today),
          ...deliverableEntries(course, deliverables, 'homework', uid, nowMs),
        ];

  return (
    <div className={menu.wrap}>
      <Link href={coursePath(course)} className={ui.backLink}>
        ← {course.title}
      </Link>
      <div className={menu.heading}>
        <span className={ui.eyebrow}>{course.title}</span>
        <h1 className={ui.title}>{t.homeworks}</h1>
      </div>
      <EntriesCard title={t.openHomeworks} emptyText={t.noOpenHomeworks} entries={entries && openEntries(entries)} />
      <EntriesCard title={t.finishedHomeworks} emptyText={t.noFinishedHomeworks} entries={entries && finishedEntries(entries)} />
    </div>
  );
}

/** `/course/<course>/homeworks`: the signed-in student's homeworks in the course; enrolled students only. */
export default function HomeworkList({ course }: { course: LearnCourse }) {
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
  return (
    <CourseProgressProvider course={course}>
      <HomeworksPage course={course} uid={auth.user.uid} />
    </CourseProgressProvider>
  );
}
