import { useEffect, useState } from 'react';
import { LEARN_COURSES } from '../../data/learn';
import {
  DAILY_QUESTIONS_GOAL,
  RECENT_DAYS_SHOWN,
  RUN_CORRECT_GOAL,
  RUN_LENGTH,
  dayKey,
  dayKeysBetween,
  isDayDone,
  isRoundDone,
  recentDayKeys,
  weekdayInitial,
} from '../../data/practice';
import type { DayProgress, Homework } from '../../data/practice';
import { practiceDict } from '../../i18n/pages/practice';
import { useLocale, useT } from '../../i18n/useT';
import ui from '../learn/ui.module.css';
import s from './HomeworkGrid.module.css';
import { fetchStudentDays } from './progress';
import type { StudentStats } from './progress';

const DAY_OF_MONTH_START: number = 8;

type DaysByStudent = Record<string, DayProgress[]>;

/** What one student did on one day: in the daily homework, or in one round of a specific one. */
type GridCell = {
  key: string;
  /** Missing when the student answered nothing there. */
  progress: DayProgress | undefined;
  isDone: boolean;
};

type HomeworkGridProps = {
  students: StudentStats[];
  /** A specific homework: the grid then shows its days, a column per round, its answers and
      its goals, with no controls. Without it, the daily homework of a course in a date range. */
  homework?: Homework;
};

function cellClassName(cell: GridCell): string {
  if (!cell.progress) return s.cellEmpty;
  return cell.isDone ? s.cellDone : s.cellStarted;
}

/** Homework of every student: a column per day (and round), a cell with answered · best run. */
export default function HomeworkGrid({ students, homework }: HomeworkGridProps) {
  const t = useT(practiceDict);
  const locale = useLocale();
  const [courseSlug, setCourseSlug] = useState(LEARN_COURSES[0].slug);
  const [firstDay, setFirstDay] = useState(() => recentDayKeys(RECENT_DAYS_SHOWN, new Date())[0]);
  const [lastDay, setLastDay] = useState(() => dayKey(new Date()));
  const [daysByStudent, setDaysByStudent] = useState<DaysByStudent | null>(null);
  const days = homework ? dayKeysBetween(homework.firstDay, homework.lastDay) : dayKeysBetween(firstDay, lastDay);
  const rounds = homework ? homework.rounds : [];
  // A homework with a single round reads as it did before rounds existed: one column per day.
  const hasRounds = rounds.length > 1;

  useEffect(() => {
    let isCurrent = true;
    Promise.all(students.map((student) => fetchStudentDays(student.uid)))
      .then((loaded) => {
        if (!isCurrent) return;
        const byStudent: DaysByStudent = {};
        students.forEach((student, index) => {
          byStudent[student.uid] = loaded[index];
        });
        setDaysByStudent(byStudent);
      })
      .catch((error) => console.error('Could not load the homework', error));
    return () => {
      isCurrent = false;
    };
  }, [students]);

  /** The cells of one day: one per round of the homework, or the one of the daily homework. */
  function cellsOf(student: StudentStats, day: string): GridCell[] {
    const studentDays = daysByStudent?.[student.uid] ?? [];
    if (!homework) {
      const progress = studentDays.find((candidate) => candidate.day === day && candidate.courseSlug === courseSlug);
      return [{ key: day, progress, isDone: progress !== undefined && isDayDone(progress) }];
    }
    return homework.rounds.map((round) => {
      const progress = studentDays.find(
        (candidate) => candidate.day === day && candidate.homeworkId === homework.id && candidate.roundId === round.id
      );
      return { key: `${day}_${round.id}`, progress, isDone: progress !== undefined && isRoundDone(progress, round) };
    });
  }

  /** A day of a specific homework is done when every round is. */
  function daysDone(student: StudentStats): number {
    return days.filter((day) => cellsOf(student, day).every((cell) => cell.isDone)).length;
  }

  return (
    <section className={s.wrap}>
      <div className={s.controls}>
        <span className={ui.eyebrow}>{homework ? t.specificHomework : t.homeworkTitle}</span>
        {!homework && (
          <>
            <label className={s.control}>
              <span className={ui.label}>{t.colCourse}</span>
              <select className={s.input} value={courseSlug} onChange={(event) => setCourseSlug(event.target.value)}>
                {LEARN_COURSES.map((course) => (
                  <option key={course.slug} value={course.slug}>
                    {course.title}
                  </option>
                ))}
              </select>
            </label>
            <label className={s.control}>
              <span className={ui.label}>{t.rangeFrom}</span>
              <input
                className={s.input}
                type="date"
                value={firstDay}
                max={lastDay}
                onChange={(event) => event.target.value && setFirstDay(event.target.value)}
              />
            </label>
            <label className={s.control}>
              <span className={ui.label}>{t.rangeTo}</span>
              <input
                className={s.input}
                type="date"
                value={lastDay}
                min={firstDay}
                onChange={(event) => event.target.value && setLastDay(event.target.value)}
              />
            </label>
          </>
        )}
      </div>

      <div className={s.card}>
        {daysByStudent === null ? (
          <p className={s.empty}>{t.loading}</p>
        ) : (
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th rowSpan={hasRounds ? 2 : undefined}>{t.colStudent}</th>
                  <th rowSpan={hasRounds ? 2 : undefined} className={ui.num}>
                    {t.colDaysDone}
                  </th>
                  {days.map((day) => (
                    <th key={day} colSpan={hasRounds ? rounds.length : undefined} className={s.dayHead} title={day}>
                      {weekdayInitial(day, locale)}
                      <span className={s.dayNumber}>{day.slice(DAY_OF_MONTH_START)}</span>
                    </th>
                  ))}
                </tr>
                {hasRounds && (
                  <tr>
                    {days.map((day) =>
                      rounds.map((round, index) => (
                        <th
                          key={`${day}_${round.id}`}
                          className={s.dayHead}
                          title={`${t.roundLabel} ${index + 1} · ${round.goal}`}
                        >
                          {index + 1}
                        </th>
                      ))
                    )}
                  </tr>
                )}
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.uid}>
                    <td>{student.displayName || student.email}</td>
                    <td className={ui.num}>
                      {daysDone(student)} / {days.length}
                    </td>
                    {days.map((day) =>
                      cellsOf(student, day).map((cell) => (
                        <td key={cell.key} className={cellClassName(cell)}>
                          {cell.progress ? `${cell.progress.answered} · ${cell.progress.bestRun}` : '–'}
                        </td>
                      ))
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className={ui.mono}>
        {(hasRounds ? t.homeworkRoundsGridHint : t.homeworkGridHint)
          .replace('{count}', String(homework ? rounds[0].goal : DAILY_QUESTIONS_GOAL))
          .replace('{goal}', String(RUN_CORRECT_GOAL))
          .replace('{length}', String(RUN_LENGTH))}
      </p>
    </section>
  );
}
