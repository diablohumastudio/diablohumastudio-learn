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
  recentDayKeys,
  weekdayInitial,
} from '../../data/practice';
import type { DayProgress } from '../../data/practice';
import { practiceDict } from '../../i18n/pages/practice';
import { useLocale, useT } from '../../i18n/useT';
import ui from '../learn/ui.module.css';
import s from './HomeworkGrid.module.css';
import { fetchStudentDays } from './progress';
import type { StudentStats } from './progress';

const DAY_OF_MONTH_START: number = 8;

type DaysByStudent = Record<string, DayProgress[]>;

function dayCellClassName(progress: DayProgress | undefined): string {
  if (!progress) return s.cellEmpty;
  return isDayDone(progress) ? s.cellDone : s.cellStarted;
}

/** Homework of every student in one course: a column per day, a cell with answered · best run. */
export default function HomeworkGrid({ students }: { students: StudentStats[] }) {
  const t = useT(practiceDict);
  const locale = useLocale();
  const [courseSlug, setCourseSlug] = useState(LEARN_COURSES[0].slug);
  const [firstDay, setFirstDay] = useState(() => recentDayKeys(RECENT_DAYS_SHOWN, new Date())[0]);
  const [lastDay, setLastDay] = useState(() => dayKey(new Date()));
  const [daysByStudent, setDaysByStudent] = useState<DaysByStudent | null>(null);
  const days = dayKeysBetween(firstDay, lastDay);

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

  function progressOf(student: StudentStats, day: string): DayProgress | undefined {
    return daysByStudent?.[student.uid]?.find(
      (candidate) => candidate.courseSlug === courseSlug && candidate.day === day
    );
  }

  function daysDone(student: StudentStats): number {
    return days.filter((day) => {
      const progress = progressOf(student, day);
      return progress !== undefined && isDayDone(progress);
    }).length;
  }

  return (
    <section className={s.wrap}>
      <div className={s.controls}>
        <span className={ui.eyebrow}>{t.homeworkTitle}</span>
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
      </div>

      <div className={s.card}>
        {daysByStudent === null ? (
          <p className={s.empty}>{t.loading}</p>
        ) : (
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>{t.colStudent}</th>
                  <th className={ui.num}>{t.colDaysDone}</th>
                  {days.map((day) => (
                    <th key={day} className={s.dayHead} title={day}>
                      {weekdayInitial(day, locale)}
                      <span className={s.dayNumber}>{day.slice(DAY_OF_MONTH_START)}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.uid}>
                    <td>{student.displayName || student.email}</td>
                    <td className={ui.num}>
                      {daysDone(student)} / {days.length}
                    </td>
                    {days.map((day) => {
                      const progress = progressOf(student, day);
                      return (
                        <td key={day} className={dayCellClassName(progress)}>
                          {progress ? `${progress.answered} · ${progress.bestRun}` : '–'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className={ui.mono}>
        {t.homeworkGridHint
          .replace('{count}', String(DAILY_QUESTIONS_GOAL))
          .replace('{goal}', String(RUN_CORRECT_GOAL))
          .replace('{length}', String(RUN_LENGTH))}
      </p>
    </section>
  );
}
