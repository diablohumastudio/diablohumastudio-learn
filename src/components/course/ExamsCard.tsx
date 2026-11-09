import { useEffect, useState } from 'react';
import type { Deliverable } from '../../data/deliverable/types';
import type { Exam } from '../../data/exam/types';
import { courseExamsPath } from '../../data/learn';
import type { LearnCourse } from '../../data/learn';
import { learnDict } from '../../i18n/learn';
import { useT } from '../../i18n/useT';
import { subscribeStudentExams } from '../exam/exams';
import EntriesCard from './EntriesCard';
import { deliverableEntries, examEntries, openEntries } from './entries';

type ExamsCardProps = {
  course: LearnCourse;
  uid: string;
  /** The student's opened deliverables of the course, both roles; null while they load. */
  deliverables: Deliverable[] | null;
  nowMs: number;
};

/** The exams running right now, multiple option and deliverable, and the way to all of them. */
export default function ExamsCard({ course, uid, deliverables, nowMs }: ExamsCardProps) {
  const t = useT(learnDict);
  const [exams, setExams] = useState<Exam[] | null>(null);

  useEffect(
    () =>
      subscribeStudentExams(course.slug, uid, setExams, (error) => {
        console.error('Could not load the exams', error);
        setExams([]);
      }),
    [course.slug, uid]
  );

  const entries =
    exams === null || deliverables === null
      ? null
      : openEntries([...examEntries(course, exams, nowMs), ...deliverableEntries(course, deliverables, 'exam', uid, nowMs)]);

  return (
    <EntriesCard
      title={t.exams}
      summary={entries && entries.length > 0 ? t.openCount.replace('{count}', String(entries.length)) : undefined}
      sectionLabel={t.openExams}
      emptyText={t.noOpenExams}
      entries={entries}
      allHref={courseExamsPath(course)}
      allText={t.showAllExams}
    />
  );
}
