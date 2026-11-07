import Link from 'next/link';
import { coursePath } from '../../data/learn';
import type { LearnCourse } from '../../data/learn';
import { courseDict } from '../../i18n/pages/course';
import { useT } from '../../i18n/useT';
import ui from '../learn/ui.module.css';

/** What a signed-in account that is not enrolled sees in place of a course's practice, exams,
    deliverables or history, with the way to the course page, where access is asked for. */
export default function NotEnrolledNotice({ course }: { course: LearnCourse }) {
  const t = useT(courseDict);
  return (
    <div className={ui.centered}>
      <p className={ui.error}>{t.notEnrolled}</p>
      <Link href={coursePath(course)} className={ui.btn}>
        ← {t.backToCourse}
      </Link>
    </div>
  );
}
