import Link from 'next/link';
import { useEffect, useState } from 'react';
import { isDeliverableRunning } from '../../data/deliverable/types';
import type { Deliverable } from '../../data/deliverable/types';
import { isExamRunning } from '../../data/exam/types';
import type { Exam } from '../../data/exam/types';
import { coursePath, deliverablePath, examPath } from '../../data/learn';
import type { LearnCourse } from '../../data/learn';
import { deliverableDict } from '../../i18n/pages/deliverable';
import { examDict } from '../../i18n/pages/exam';
import { useLocale, useT } from '../../i18n/useT';
import { isFirebaseConfigured } from '../../lib/firebase';
import { subscribeOpenedDeliverables } from '../deliverable/deliverables';
import menu from '../learn/LearnMenu.module.css';
import SignInRedirect from '../learn/SignInRedirect';
import ui from '../learn/ui.module.css';
import { useAuthUser } from '../learn/useAuthUser';
import s from './ExamList.module.css';
import { subscribeOpenedExams } from './exams';
import { dateTimeText } from './format';

/** The opened deliverable exams of the course, listed after the multiple option ones. */
function OpenedDeliverableExams({ course }: { course: LearnCourse }) {
  const t = useT(deliverableDict);
  const locale = useLocale();
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const courseDeliverables = deliverables.filter(
    (deliverable) => deliverable.courseSlug === course.slug && deliverable.role === 'exam'
  );

  useEffect(
    () =>
      subscribeOpenedDeliverables(setDeliverables, (error) =>
        // Refused until firebase/firestore.rules names the collection: then there is simply nothing to list.
        console.warn('Could not load the deliverables', error)
      ),
    []
  );

  if (courseDeliverables.length === 0) return null;
  return (
    <>
      <div className={menu.heading}>
        <span className={ui.eyebrow}>{t.examsSection}</span>
      </div>
      <nav className={menu.list}>
        {courseDeliverables.map((deliverable) => {
          const running = isDeliverableRunning(deliverable, Date.now());
          return (
            <Link key={deliverable.id} href={deliverablePath(course, deliverable.id)} className={menu.item}>
              {deliverable.title}
              <span className={running ? s.running : s.finished}>
                {running ? `${t.stateRunning} · ${t.endsAt} ` : `${t.stateFinished} · `}
                {dateTimeText(deliverable.closesAtMs, locale)}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

function OpenedExams({ course }: { course: LearnCourse }) {
  const t = useT(examDict);
  const locale = useLocale();
  const [exams, setExams] = useState<Exam[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(
    () =>
      subscribeOpenedExams(setExams, (error) => {
        console.error('Could not load the exams', error);
        setFailed(true);
      }),
    []
  );

  if (failed) {
    return (
      <div className={ui.centered}>
        <p className={ui.error}>{t.errorGeneric}</p>
      </div>
    );
  }
  if (!exams) {
    return (
      <div className={ui.centered}>
        <span className={ui.mono}>{t.loading}</span>
      </div>
    );
  }
  const courseExams = exams.filter((exam) => exam.courseSlug === course.slug);

  return (
    <div className={menu.wrap}>
      <Link href={coursePath(course)} className={ui.backLink}>
        ← {course.title}
      </Link>
      <div className={menu.heading}>
        <span className={ui.eyebrow}>{course.title}</span>
        <h1 className={ui.title}>{t.examsTitle}</h1>
      </div>
      {courseExams.length === 0 ? (
        <p className={ui.mono}>{t.noExams}</p>
      ) : (
        <nav className={menu.list}>
          {courseExams.map((exam) => {
            // The list only needs to tell running from finished; the exam page keeps the exact clock.
            const running = isExamRunning(exam, Date.now());
            return (
              <Link key={exam.id} href={examPath(course, exam.id)} className={menu.item}>
                {exam.title}
                <span className={running ? s.running : s.finished}>
                  {running ? `${t.stateRunning} · ${t.endsAt} ` : `${t.stateFinished} · `}
                  {dateTimeText(exam.closesAtMs, locale)}
                </span>
              </Link>
            );
          })}
        </nav>
      )}
      <OpenedDeliverableExams course={course} />
    </div>
  );
}

export default function ExamList({ course }: { course: LearnCourse }) {
  const t = useT(examDict);
  const auth = useAuthUser();

  if (!isFirebaseConfigured()) {
    return (
      <div className={ui.centered}>
        <p className={ui.error}>{t.notConfigured}</p>
      </div>
    );
  }
  if (auth.status === 'loading') {
    return (
      <div className={ui.centered}>
        <span className={ui.mono}>{t.loading}</span>
      </div>
    );
  }
  if (auth.status === 'signedOut') return <SignInRedirect />;
  return <OpenedExams course={course} />;
}
