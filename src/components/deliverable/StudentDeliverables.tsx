import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { isSavedLate, lateBySeconds } from '../../data/deliverable/types';
import type { Deliverable, DeliverableRole, Review, Submission } from '../../data/deliverable/types';
import { deliverablePath, findCourse, teacherDeliverablePath, teacherSubmissionPath } from '../../data/learn';
import type { LearnCourse } from '../../data/learn';
import { deliverableDict } from '../../i18n/pages/deliverable';
import { useLocale, useT } from '../../i18n/useT';
import { dateTimeYearText, durationText } from '../exam/format';
import ui from '../learn/ui.module.css';
import s from './StudentDeliverables.module.css';
import { fetchReview, fetchSubmission, subscribeAllDeliverables, subscribeOpenedDeliverables } from './deliverables';

/** What one student did in one deliverable: nothing saved, a submission, and its review once it exists. */
type DeliverableResult = {
  submission: Submission | null;
  review: Review | null;
};

type StudentDeliverablesProps = {
  uid: string;
  role: DeliverableRole;
  /** Only this course's deliverables; every course without it (the teacher's review page). */
  course?: LearnCourse;
  /** Who is looking: the student links to the deliverable's page, the teacher to the submission. */
  viewer: 'student' | 'teacher';
};

/** The opened deliverables of one role with the student's saved state and score, one table. */
export default function StudentDeliverables({ uid, role, course, viewer }: StudentDeliverablesProps) {
  const t = useT(deliverableDict);
  const locale = useLocale();
  const [deliverables, setDeliverables] = useState<Deliverable[] | null>(null);
  const [results, setResults] = useState<Record<string, DeliverableResult> | null>(null);
  const shown = useMemo(
    () =>
      (deliverables ?? []).filter(
        (deliverable) =>
          deliverable.status === 'opened' &&
          deliverable.role === role &&
          (course === undefined || deliverable.courseSlug === course.slug)
      ),
    [deliverables, role, course]
  );

  useEffect(() => {
    const onError = (error: unknown) => console.error('Could not load the deliverables', error);
    // A student may only list the opened ones; a teacher's list includes drafts, which hold nothing.
    return viewer === 'teacher'
      ? subscribeAllDeliverables(setDeliverables, onError)
      : subscribeOpenedDeliverables(setDeliverables, onError);
  }, [viewer]);

  useEffect(() => {
    if (deliverables === null) return undefined;
    let isCurrent = true;
    Promise.all(
      shown.map((deliverable) =>
        Promise.all([
          fetchSubmission(deliverable.id, uid).catch(() => null),
          fetchReview(deliverable.id, uid).catch(() => null),
        ])
      )
    )
      .then((loaded) => {
        if (!isCurrent) return;
        const byDeliverable: Record<string, DeliverableResult> = {};
        shown.forEach((deliverable, index) => {
          byDeliverable[deliverable.id] = { submission: loaded[index][0], review: loaded[index][1] };
        });
        setResults(byDeliverable);
      })
      .catch((error) => console.error('Could not load the submissions', error));
    return () => {
      isCurrent = false;
    };
  }, [deliverables, shown, uid]);

  function titleOf(deliverable: Deliverable, result: DeliverableResult | undefined) {
    const deliverableCourse = findCourse(deliverable.courseSlug);
    if (viewer === 'student') {
      if (!deliverableCourse) return <span className={s.name}>{deliverable.title}</span>;
      return (
        <Link href={deliverablePath(deliverableCourse, deliverable.id)} className={s.link}>
          {deliverable.title}
        </Link>
      );
    }
    const href = result?.submission ? teacherSubmissionPath(deliverable.id, uid) : teacherDeliverablePath(deliverable.id);
    return (
      <Link href={href} className={s.link}>
        {deliverable.title}
      </Link>
    );
  }

  return (
    <div className={s.card}>
      {deliverables === null ? (
        <p className={s.empty}>{t.loading}</p>
      ) : shown.length === 0 ? (
        <p className={s.empty}>{t.noDeliverables}</p>
      ) : (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>{t.colTitle}</th>
                {course === undefined && <th>{t.colCourse}</th>}
                <th>{t.colClosesAt}</th>
                <th>{t.colSavedAt}</th>
                <th className={ui.num}>{t.colLate}</th>
                <th className={ui.num}>{t.colScore}</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((deliverable) => {
                const result = results?.[deliverable.id];
                const submission = result?.submission ?? null;
                const late = submission ? isSavedLate(submission, deliverable) : false;
                return (
                  <tr key={deliverable.id}>
                    <td>{titleOf(deliverable, result)}</td>
                    {course === undefined && <td>{findCourse(deliverable.courseSlug)?.title ?? deliverable.courseSlug}</td>}
                    <td>{dateTimeYearText(deliverable.closesAtMs, locale)}</td>
                    <td>{result === undefined ? '…' : submission ? dateTimeYearText(submission.savedAtMs, locale) : t.notSaved}</td>
                    <td className={late ? `${ui.num} ${s.late}` : ui.num}>
                      {late && submission ? durationText(lateBySeconds(submission, deliverable)) : '–'}
                    </td>
                    <td className={`${ui.num} ${s.score}`}>
                      {result?.review && result.review.score !== null ? `${result.review.score} / ${result.review.maxScore}` : '–'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
