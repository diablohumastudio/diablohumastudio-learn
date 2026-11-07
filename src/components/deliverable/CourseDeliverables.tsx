import Link from 'next/link';
import { useEffect, useState } from 'react';
import { isDeliverableRunning, isDeliverableShown, isSavedLate, lateBySeconds } from '../../data/deliverable/types';
import type { Deliverable, Review, Submission } from '../../data/deliverable/types';
import { deliverablePath } from '../../data/learn';
import type { LearnCourse } from '../../data/learn';
import { deliverableDict } from '../../i18n/pages/deliverable';
import { useLocale, useT } from '../../i18n/useT';
import { isFirebaseConfigured } from '../../lib/firebase';
import { dateTimeText, durationText } from '../exam/format';
import { useAuthUser } from '../learn/useAuthUser';
import s from './CourseDeliverables.module.css';
import { fetchReview, fetchSubmission, subscribeOpenedDeliverables } from './deliverables';
import { roleText } from './format';
import { useNowMs } from './useNowMs';

const STATE_TICK_MS: number = 1000;

type DeliverableCardProps = {
  course: LearnCourse;
  deliverable: Deliverable;
  uid: string;
  nowMs: number;
};

function DeliverableCard({ course, deliverable, uid, nowMs }: DeliverableCardProps) {
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
    <section className={s.card}>
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
    </section>
  );
}

function SignedInDeliverables({ course, uid }: { course: LearnCourse; uid: string }) {
  const nowMs = useNowMs(STATE_TICK_MS);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);

  useEffect(
    () =>
      subscribeOpenedDeliverables(setDeliverables, (error) =>
        // The rules refuse `deliverables` until firebase/firestore.rules is republished: no cards, nothing else.
        console.warn('Could not load the deliverables', error)
      ),
    []
  );

  return (
    <>
      {deliverables
        .filter((deliverable) => deliverable.courseSlug === course.slug && isDeliverableShown(deliverable, nowMs))
        .map((deliverable) => (
          <DeliverableCard key={deliverable.id} course={course} deliverable={deliverable} uid={uid} nowMs={nowMs} />
        ))}
    </>
  );
}

/** One card per opened deliverable of the course, until a few days after its close; nothing for guests. */
export default function CourseDeliverables({ course }: { course: LearnCourse }) {
  const auth = useAuthUser();
  if (!isFirebaseConfigured() || auth.status !== 'signedIn') return null;
  return <SignedInDeliverables course={course} uid={auth.user.uid} />;
}
