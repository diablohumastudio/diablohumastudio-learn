import Link from 'next/link';
import type { Exam } from '../../data/exam/types';
import { examPath } from '../../data/learn';
import type { LearnCourse } from '../../data/learn';
import { learnDict } from '../../i18n/learn';
import { examDict } from '../../i18n/pages/exam';
import { useLocale, useT } from '../../i18n/useT';
import s from './ExamEntry.module.css';
import { dateTimeText } from './format';

/** A running multiple option exam on the course page: when it ends and the way into its room. */
export default function ExamEntry({ course, exam }: { course: LearnCourse; exam: Exam }) {
  const t = useT(learnDict);
  const examT = useT(examDict);
  const locale = useLocale();

  return (
    <div className={s.entry}>
      <div className={s.heading}>
        <span className={s.eyebrow}>
          {t.multipleOptionExam} · {examT.endsAt} {dateTimeText(exam.closesAtMs, locale)}
        </span>
        <span className={s.name}>{exam.title}</span>
      </div>
      <div className={s.actions}>
        <Link href={examPath(course, exam.id)} className={s.open}>
          {t.openExam}
        </Link>
      </div>
    </div>
  );
}
