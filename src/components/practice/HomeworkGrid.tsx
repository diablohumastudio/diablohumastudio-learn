import type { ReactNode } from 'react';
import {
  DAILY_QUESTIONS_GOAL,
  DAY_SCORE_FULL,
  DAY_SCORE_NONE,
  RUN_CORRECT_GOAL,
  RUN_LENGTH,
  dailyDay,
  dailyDayScore,
  roundScore,
  scopeDayScore,
  weekdayInitial,
} from '../../data/practice';
import type { DayProgress, ProgressScope } from '../../data/practice';
import { practiceDict } from '../../i18n/pages/practice';
import { useLocale, useT } from '../../i18n/useT';
import ui from '../learn/ui.module.css';
import { scoreText, shortName } from './format';
import s from './HomeworkGrid.module.css';
import type { StudentStats } from './progress';
import type { DaysByStudent } from './useStudentDays';

const DAY_OF_MONTH_START: number = 8;

/** What one student did on one day: in the daily homework, or in one round of a specific one. */
type GridCell = {
  key: string;
  /** Missing when the student answered nothing there. */
  progress: DayProgress | undefined;
  /** 1, ½ or 0: both goals met, one, none. */
  score: number;
};

type HomeworkGridProps = {
  students: StudentStats[];
  daysByStudent: DaysByStudent | null;
  days: string[];
  /** The daily homework of a course, or a specific homework with a column per round. */
  scope: ProgressScope;
  /** Shown in the heading row, after the eyebrow: the period selector of this section. */
  controls?: ReactNode;
};

function cellClassName(cell: GridCell): string {
  if (!cell.progress) return s.cellEmpty;
  if (cell.score >= DAY_SCORE_FULL) return s.cellFull;
  return cell.score > DAY_SCORE_NONE ? s.cellHalf : s.cellZero;
}

/** Homework of every student: a column per day (and round), a cell with answered · best run. */
export default function HomeworkGrid({ students, daysByStudent, days, scope, controls }: HomeworkGridProps) {
  const t = useT(practiceDict);
  const locale = useLocale();
  const rounds = scope.kind === 'homework' ? scope.homework.rounds : [];
  // A homework with a single round reads as it did before rounds existed: one column per day.
  const hasRounds = rounds.length > 1;

  /** The cells of one day: one per round of the homework, or the one of the daily homework. */
  function cellsOf(student: StudentStats, day: string): GridCell[] {
    const studentDays = daysByStudent?.[student.uid] ?? [];
    if (scope.kind === 'daily') {
      const progress = dailyDay(studentDays, scope.courseSlug, day);
      return [{ key: day, progress, score: progress ? dailyDayScore(progress) : DAY_SCORE_NONE }];
    }
    const { homework } = scope;
    return homework.rounds.map((round) => {
      const progress = studentDays.find(
        (candidate) => candidate.day === day && candidate.homeworkId === homework.id && candidate.roundId === round.id
      );
      return { key: `${day}_${round.id}`, progress, score: progress ? roundScore(progress, round) : DAY_SCORE_NONE };
    });
  }

  function periodScore(student: StudentStats): number {
    const studentDays = daysByStudent?.[student.uid] ?? [];
    return days.reduce((sum, day) => sum + scopeDayScore(studentDays, scope, day), 0);
  }

  const hint = (hasRounds ? t.homeworkRoundsGridHint : t.homeworkGridHint)
    .replace('{count}', String(scope.kind === 'homework' ? rounds[0].goal : DAILY_QUESTIONS_GOAL))
    .replace('{goal}', String(RUN_CORRECT_GOAL))
    .replace('{length}', String(RUN_LENGTH));

  return (
    <section className={s.wrap}>
      <div className={s.header}>
        <span className={ui.eyebrow}>{t.dayByDay}</span>
        {controls}
      </div>
      <div className={s.card}>
        {daysByStudent === null ? (
          <p className={s.empty}>{t.loading}</p>
        ) : days.length === 0 ? (
          <p className={s.empty}>{t.noDaysInRange}</p>
        ) : (
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th rowSpan={hasRounds ? 2 : undefined} className={s.nameHead}>
                    {t.colStudent}
                  </th>
                  <th rowSpan={hasRounds ? 2 : undefined} className={`${ui.num} ${s.totalHead}`}>
                    {scope.kind === 'daily' ? t.colDaysDone : t.colPoints}
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
                    <td className={s.nameCell} title={student.displayName || student.email}>
                      {shortName(student.displayName) || student.email}
                    </td>
                    <td className={`${ui.num} ${s.total}`}>
                      {scoreText(periodScore(student), locale)} / {days.length}
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
      <p className={ui.mono}>{hint}</p>
    </section>
  );
}
