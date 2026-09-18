import Link from 'next/link';
import { TEACHER_PATH } from '../../data/learn';
import { learnDict } from '../../i18n/learn';
import { useT } from '../../i18n/useT';
import { useTeacherStatus } from './useTeacherStatus';

/** Renders nothing unless the signed-in account is a teacher. Browser-only: load it with ssr off. */
export default function TeacherLink({ className }: { className?: string }) {
  const t = useT(learnDict);
  const teacherStatus = useTeacherStatus();

  if (teacherStatus !== 'teacher') return null;

  return (
    <Link href={TEACHER_PATH} className={className}>
      {t.teacherArea}
    </Link>
  );
}
