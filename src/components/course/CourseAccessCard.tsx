import { useState } from 'react';
import type { LearnCourse } from '../../data/learn';
import { courseDict } from '../../i18n/pages/course';
import { useT } from '../../i18n/useT';
import ui from '../learn/ui.module.css';
import s from './CourseAccessCard.module.css';
import { requestAccess } from './members';
import type { Membership } from './useMembership';

type CourseAccessCardProps = {
  course: LearnCourse;
  membership: Membership;
};

/** In place of the homework cards for a signed-in account that is not enrolled: ask for access,
    or wait for the teacher's answer. Nothing for guests, members and while loading. */
export default function CourseAccessCard({ course, membership }: CourseAccessCardProps) {
  const t = useT(courseDict);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  if (membership.status !== 'notMember' && membership.status !== 'requested') return null;
  const user = membership.user;

  async function request(): Promise<void> {
    if (!user) return;
    setBusy(true);
    setFailed(false);
    try {
      await requestAccess(course.slug, user);
    } catch (error) {
      console.error('Could not request access', error);
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className={s.card}>
      <span className={s.title}>{t.accessTitle}</span>
      <p className={s.lede}>{membership.status === 'requested' ? t.requestedNotice : t.accessLede}</p>
      {failed && <p className={ui.error}>{t.errorGeneric}</p>}
      {membership.status === 'notMember' && (
        <button type="button" className={s.button} onClick={() => void request()} disabled={busy}>
          {busy ? t.requesting : t.requestAccess}
        </button>
      )}
    </section>
  );
}
