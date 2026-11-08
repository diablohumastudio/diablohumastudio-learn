import { isDeliverableRunning } from '../../data/deliverable/types';
import type { Deliverable, DeliverableRole } from '../../data/deliverable/types';
import { isExamRunning } from '../../data/exam/types';
import type { Exam } from '../../data/exam/types';
import type { LearnCourse } from '../../data/learn';
import { isHomeworkOpen } from '../../data/practice';
import type { DayProgress, Homework } from '../../data/practice';
import DeliverableEntry from '../deliverable/DeliverableEntry';
import ExamEntry from '../exam/ExamEntry';
import HomeworkEntry from '../practice/HomeworkEntry';
import type { CardEntry } from './EntriesCard';

/** A homework or an exam as the course page and the homeworks page list them (`EntriesCard`). */
export type TimedEntry = CardEntry & {
  /** When it closes or closed: the open ones are listed by it ascending, the finished ones descending. */
  endsAtMs: number;
  isOpen: boolean;
};

const DAY_END_TIME: string = 'T23:59:59';

/** The last moment of a day key, in the device's zone, like `dayKey` reads the day. */
function dayEndMs(day: string): number {
  return new Date(`${day}${DAY_END_TIME}`).getTime();
}

/** The specific homeworks already started, open or finished; an upcoming one stays unseen until its first day. */
export function homeworkEntries(
  course: LearnCourse,
  homeworks: readonly Homework[],
  homeworkDays: readonly DayProgress[],
  today: string
): TimedEntry[] {
  return homeworks
    .filter((homework) => homework.firstDay <= today)
    .map((homework) => ({
      key: `homework-${homework.id}`,
      endsAtMs: dayEndMs(homework.lastDay),
      isOpen: isHomeworkOpen(homework, today),
      content: <HomeworkEntry course={course} homework={homework} homeworkDays={homeworkDays} today={today} />,
    }));
}

/** The student's opened deliverables of one role. */
export function deliverableEntries(
  course: LearnCourse,
  deliverables: readonly Deliverable[],
  role: DeliverableRole,
  uid: string,
  nowMs: number
): TimedEntry[] {
  return deliverables
    .filter((deliverable) => deliverable.role === role)
    .map((deliverable) => ({
      key: `deliverable-${deliverable.id}`,
      endsAtMs: deliverable.closesAtMs ?? 0,
      isOpen: isDeliverableRunning(deliverable, nowMs),
      content: <DeliverableEntry course={course} deliverable={deliverable} uid={uid} nowMs={nowMs} />,
    }));
}

/** The student's opened multiple option exams. */
export function examEntries(course: LearnCourse, exams: readonly Exam[], nowMs: number): TimedEntry[] {
  return exams.map((exam) => ({
    key: `exam-${exam.id}`,
    endsAtMs: exam.closesAtMs ?? 0,
    isOpen: isExamRunning(exam, nowMs),
    content: <ExamEntry course={course} exam={exam} />,
  }));
}

/** What is open, the closest to its end first. */
export function openEntries(entries: readonly TimedEntry[]): TimedEntry[] {
  return entries.filter((entry) => entry.isOpen).sort((a, b) => a.endsAtMs - b.endsAtMs);
}

/** What is over, the most recent first. */
export function finishedEntries(entries: readonly TimedEntry[]): TimedEntry[] {
  return entries.filter((entry) => !entry.isOpen).sort((a, b) => b.endsAtMs - a.endsAtMs);
}
