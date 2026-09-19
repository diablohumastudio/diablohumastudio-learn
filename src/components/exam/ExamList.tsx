import Link from 'next/link';
import { useEffect, useState } from 'react';
import { isExamRunning } from '../../data/exam/types';
import type { Exam } from '../../data/exam/types';
import { coursePath, examPath } from '../../data/learn';
import type { LearnCourse } from '../../data/learn';
import { examDict } from '../../i18n/pages/exam';
import { useLocale, useT } from '../../i18n/useT';
import { isFirebaseConfigured } from '../../lib/firebase';
import menu from '../learn/LearnMenu.module.css';
import SignInRedirect from '../learn/SignInRedirect';
import ui from '../learn/ui.module.css';
import { useAuthUser } from '../learn/useAuthUser';
import s from './ExamList.module.css';
import { subscribeOpenedExams } from './exams';
import { dateTimeText } from './format';

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
              <Link key={exam.id} href={examPath(exam.id)} className={menu.item}>
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
