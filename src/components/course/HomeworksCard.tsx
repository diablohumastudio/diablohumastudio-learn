import type { Deliverable } from '../../data/deliverable/types';
import { courseHomeworksPath } from '../../data/learn';
import type { LearnCourse } from '../../data/learn';
import { dayKey } from '../../data/practice';
import { learnDict } from '../../i18n/learn';
import { useT } from '../../i18n/useT';
import { useCourseProgress } from '../practice/CourseProgressContext';
import EntriesCard from './EntriesCard';
import { deliverableEntries, homeworkEntries, openEntries } from './entries';

type HomeworksCardProps = {
  course: LearnCourse;
  uid: string;
  /** The student's opened deliverables of the course, both roles; null while they load. */
  deliverables: Deliverable[] | null;
  nowMs: number;
};

/** The homeworks open right now, specific and deliverable, and the way to all of them. */
export default function HomeworksCard({ course, uid, deliverables, nowMs }: HomeworksCardProps) {
  const t = useT(learnDict);
  const progress = useCourseProgress();
  const today = dayKey(new Date());
  const entries =
    progress === null || deliverables === null
      ? null
      : openEntries([
          ...homeworkEntries(course, progress.homeworks, progress.homeworkDays, today),
          ...deliverableEntries(course, deliverables, 'homework', uid, nowMs),
        ]);

  return (
    <EntriesCard
      title={t.homeworks}
      summary={entries && entries.length > 0 ? t.openCount.replace('{count}', String(entries.length)) : undefined}
      sectionLabel={t.openHomeworks}
      emptyText={t.noOpenHomeworks}
      entries={entries}
      allHref={courseHomeworksPath(course)}
      allText={t.showAllHomeworks}
    />
  );
}
