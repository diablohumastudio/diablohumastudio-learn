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
import EnrolledOnly from '../course/EnrolledOnly';
import ItemList, { closeStateText } from '../course/ItemList';
import { subscribeStudentDeliverables } from '../deliverable/deliverables';
import menu from '../learn/LearnMenu.module.css';
import ui from '../learn/ui.module.css';
import { subscribeStudentExams } from './exams';

/** The opened deliverable exams of the course that are for this student, after the multiple option ones. */
function OpenedDeliverableExams({ course, uid }: { course: LearnCourse; uid: string }) {
  const t = useT(deliverableDict);
  const locale = useLocale();
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const courseDeliverables = deliverables.filter((deliverable) => deliverable.role === 'exam');
  const stateTexts = { running: t.stateRunning, finished: t.stateFinished, endsAt: t.endsAt };

  useEffect(
    () =>
      subscribeStudentDeliverables(course.slug, uid, setDeliverables, (error) =>
        // Refused until firebase/firestore.rules names the collection: then there is simply nothing to list.
        console.warn('Could not load the deliverables', error)
      ),
    [course.slug, uid]
  );

  if (courseDeliverables.length === 0) return null;
  return (
    <>
      <div className={menu.heading}>
        <span className={ui.eyebrow}>{t.examsSection}</span>
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

function OpenedExams({ course, uid }: { course: LearnCourse; uid: string }) {
  const t = useT(examDict);
  const locale = useLocale();
  const [exams, setExams] = useState<Exam[] | null>(null);
  const [failed, setFailed] = useState(false);
  const stateTexts = { running: t.stateRunning, finished: t.stateFinished, endsAt: t.endsAt };

  useEffect(
    () =>
      subscribeStudentExams(course.slug, uid, setExams, (error) => {
        console.error('Could not load the exams', error);
        setFailed(true);
      }),
    [course.slug, uid]
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

  return (
    <div className={menu.wrap}>
      <Link href={coursePath(course)} className={ui.backLink}>
        ← {course.title}
      </Link>
      <div className={menu.heading}>
        <span className={ui.eyebrow}>{course.title}</span>
        <h1 className={ui.title}>{t.examsTitle}</h1>
      </div>
      {exams.length === 0 ? (
        <p className={ui.mono}>{t.noExams}</p>
      ) : (
        <ItemList
          items={exams.map((exam) => {
            // The list only needs to tell running from finished; the exam page keeps the exact clock.
            const running = isExamRunning(exam, Date.now());
            return {
              key: exam.id,
              href: examPath(course, exam.id),
              title: exam.title,
              state: closeStateText(running, exam.closesAtMs, stateTexts, locale),
              isRunning: running,
            };
          })}
        />
      )}
      <OpenedDeliverableExams course={course} uid={uid} />
    </div>
  );
}

/** `/course/<course>/exams`: the opened exams of the course, multiple option and deliverable, for its students. */
export default function ExamList({ course }: { course: LearnCourse }) {
  return <EnrolledOnly course={course}>{(uid) => <OpenedExams course={course} uid={uid} />}</EnrolledOnly>;
}
