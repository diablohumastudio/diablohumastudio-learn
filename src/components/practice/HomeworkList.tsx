import Link from 'next/link';
import { useEffect, useState } from 'react';
import { isDeliverableRunning } from '../../data/deliverable/types';
import type { Deliverable } from '../../data/deliverable/types';
import { coursePath, deliverablePath, homeworkPath } from '../../data/learn';
import type { LearnCourse } from '../../data/learn';
import { dayKey, dayText, isHomeworkOpen, startedHomeworks } from '../../data/practice';
import type { Homework } from '../../data/practice';
import { learnDict } from '../../i18n/learn';
import { deliverableDict } from '../../i18n/pages/deliverable';
import { practiceDict } from '../../i18n/pages/practice';
import { useLocale, useT } from '../../i18n/useT';
import EnrolledOnly from '../course/EnrolledOnly';
import ItemList, { closeStateText } from '../course/ItemList';
import { subscribeStudentDeliverables } from '../deliverable/deliverables';
import menu from '../learn/LearnMenu.module.css';
import ui from '../learn/ui.module.css';
import { CourseProgressProvider, useCourseProgress } from './CourseProgressContext';

/** The opened deliverable homeworks of the course that are for this student, after the multiple option ones. */
function OpenedDeliverableHomeworks({ course, uid }: { course: LearnCourse; uid: string }) {
  const t = useT(deliverableDict);
  const locale = useLocale();
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const courseDeliverables = deliverables.filter((deliverable) => deliverable.role === 'homework');
  const stateTexts = { running: t.stateRunning, finished: t.stateFinished, endsAt: t.endsAt };

  useEffect(
    () =>
      subscribeStudentDeliverables(course.slug, uid, setDeliverables, (error) =>
        console.warn('Could not load the deliverables', error)
      ),
    [course.slug, uid]
  );

  if (courseDeliverables.length === 0) return null;
  return (
    <>
      <div className={menu.heading}>
        <span className={ui.eyebrow}>{t.homeworksSection}</span>
      </div>
      <ItemList
        items={courseDeliverables.map((deliverable) => {
          const running = isDeliverableRunning(deliverable, Date.now());
          return {
            key: deliverable.id,
            href: deliverablePath(course, deliverable.id),
            title: deliverable.title,
            state: closeStateText(running, deliverable.closesAtMs, stateTexts, locale),
            isRunning: running,
          };
        })}
      />
    </>
  );
}

/** The student's homeworks in the course as rows, like the exams list: the specific ones with
    their days, then the deliverable ones. A row opens the homework's own page. */
function HomeworksPage({ course, uid }: { course: LearnCourse; uid: string }) {
  const t = useT(learnDict);
  const practiceT = useT(practiceDict);
  const locale = useLocale();
  const progress = useCourseProgress();
  const today = dayKey(new Date());

  /** "Open · until Mon, Nov 10" while it runs, "Finished · Mon, Nov 10" afterwards. */
  function homeworkStateText(homework: Homework): string {
    const lastDay = dayText(homework.lastDay, locale);
    return isHomeworkOpen(homework, today)
      ? `${practiceT.homeworkOpen} · ${t.homeworkUntil} ${lastDay}`
      : `${practiceT.homeworkFinished} · ${lastDay}`;
  }

  if (progress === null) {
    return (
      <div className={ui.centered}>
        <span className={ui.mono}>{t.loading}</span>
      </div>
    );
  }
  const homeworks = startedHomeworks(progress.homeworks, today);

  return (
    <div className={menu.wrap}>
      <Link href={coursePath(course)} className={ui.backLink}>
        ← {course.title}
      </Link>
      <div className={menu.heading}>
        <span className={ui.eyebrow}>{course.title}</span>
        <h1 className={ui.title}>{t.homeworks}</h1>
      </div>
      {homeworks.length === 0 ? (
        <p className={ui.mono}>{t.noHomeworksYet}</p>
      ) : (
        <ItemList
          items={homeworks.map((homework) => ({
            key: homework.id,
            href: homeworkPath(course, homework.id),
            title: homework.title,
            state: homeworkStateText(homework),
            isRunning: isHomeworkOpen(homework, today),
          }))}
        />
      )}
      <OpenedDeliverableHomeworks course={course} uid={uid} />
    </div>
  );
}

/** `/course/<course>/homeworks`: the signed-in student's homeworks in the course; enrolled students only. */
export default function HomeworkList({ course }: { course: LearnCourse }) {
  return (
    <EnrolledOnly course={course}>
      {(uid) => (
        <CourseProgressProvider course={course}>
          <HomeworksPage course={course} uid={uid} />
        </CourseProgressProvider>
      )}
    </EnrolledOnly>
  );
}
