import Link from 'next/link';
import { useEffect, useState } from 'react';
import { isDeliverableRunning, isSavedLate, lateBySeconds } from '../../data/deliverable/types';
import type { Deliverable, Review, Submission } from '../../data/deliverable/types';
import { deliverablePath } from '../../data/learn';
import type { LearnCourse } from '../../data/learn';
import { deliverableDict } from '../../i18n/pages/deliverable';
import { useLocale, useT } from '../../i18n/useT';
import { dateTimeText, durationText } from '../exam/format';
import s from './DeliverableEntry.module.css';
import { fetchReview, fetchSubmission } from './deliverables';
import { roleText } from './format';

type DeliverableEntryProps = {
  course: LearnCourse;
  deliverable: Deliverable;
  uid: string;
  nowMs: number;
};

/** One deliverable as the student sees it: its close, whether they saved and when, their score
    once reviewed, and the way to its page. Listed on the course page and on the homeworks page
    (`EntriesCard`). */
export default function DeliverableEntry({ course, deliverable, uid, nowMs }: DeliverableEntryProps) {
  const t = useT(deliverableDict);
  const locale = useLocale();
  const running = isDeliverableRunning(deliverable, nowMs);
  const [submission, setSubmission] = useState<Submission | null | undefined>(undefined);
  const [review, setReview] = useState<Review | null>(null);

  useEffect(() => {
    let isCurrent = true;
    fetchSubmission(deliverable.id, uid)
      .then((loaded) => {
        if (isCurrent) setSubmission(loaded);
      })
      .catch(() => setSubmission(null));
    fetchReview(deliverable.id, uid)
      .then((loaded) => {
        if (isCurrent) setReview(loaded);
      })
      .catch(() => setReview(null));
    return () => {
      isCurrent = false;
    };
  }, [deliverable.id, uid]);

  const late = submission ? isSavedLate(submission, deliverable) : false;

  return (
    <div className={s.entry}>
      <div className={s.heading}>
        <span className={s.eyebrow}>
          {roleText(deliverable.role, t)} · {running ? t.closesAt : t.closedAt} {dateTimeText(deliverable.closesAtMs, locale)}
        </span>
        <span className={s.name}>{deliverable.title}</span>
      </div>
      {submission === undefined ? (
        <span className={s.state}>{t.loading}</span>
      ) : submission === null ? (
        <span className={s.state}>{t.notSaved}</span>
      ) : late ? (
        <span className={s.late}>
          {t.lateNote} {durationText(lateBySeconds(submission, deliverable))}
        </span>
      ) : (
        <span className={running ? s.running : s.state}>
          {t.savedAt.replace('{time}', dateTimeText(submission.savedAtMs, locale))}
        </span>
      )}
      {review && review.score !== null && (
        <span className={s.score}>
          {t.colScore}: {review.score} / {review.maxScore}
        </span>
      )}
      <div className={s.actions}>
        <Link href={deliverablePath(course, deliverable.id)} className={s.open}>
          {t.open}
        </Link>
        {!running && <span className={s.finished}>{t.stateFinished}</span>}
      </div>
    </div>
  );
}
