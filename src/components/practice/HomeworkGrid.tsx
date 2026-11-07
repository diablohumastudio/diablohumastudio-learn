import { useState } from 'react';
import {
  DAILY_QUESTIONS_GOAL,
  DAY_SCORE_FULL,
  DAY_SCORE_NONE,
  RUN_CORRECT_GOAL,
  RUN_LENGTH,
  dailyDay,
  dailyDayScore,
  dayText,
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
/** Days shown at once; 0 stands for the whole period. */
const WINDOW_SIZES: readonly number[] = [7, 14, 31];
const WHOLE_PERIOD: number = 0;
const DEFAULT_WINDOW_SIZE: number = WHOLE_PERIOD;
const WINDOW_SIZE_STORAGE_KEY: string = 'learn.practice.gridDays';
const PREVIOUS: number = 1;
const NEXT: number = -1;

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
};

function cellClassName(cell: GridCell): string {
  if (!cell.progress) return s.cellEmpty;
  if (cell.score >= DAY_SCORE_FULL) return s.cellFull;
  return cell.score > DAY_SCORE_NONE ? s.cellHalf : s.cellZero;
}

function readWindowSize(): number {
  try {
    const stored = Number(window.localStorage.getItem(WINDOW_SIZE_STORAGE_KEY));
    return stored === WHOLE_PERIOD || WINDOW_SIZES.includes(stored) ? stored : DEFAULT_WINDOW_SIZE;
  } catch {
    return DEFAULT_WINDOW_SIZE;
  }
}

function saveWindowSize(size: number): void {
  try {
    window.localStorage.setItem(WINDOW_SIZE_STORAGE_KEY, String(size));
  } catch {
    // Nothing to do: the choice just will not survive a reload.
  }
}

/** The days on screen: the last `size` of the period, moved back `pagesBack` windows. Counted
    from the end so that a new period opens on its latest days. */
function visibleDays(days: readonly string[], size: number, pagesBack: number): string[] {
  if (size === WHOLE_PERIOD) return [...days];
  const end = days.length - size * pagesBack;
  return days.slice(Math.max(0, end - size), Math.max(0, end));
}

function lastPageBack(dayCount: number, size: number): number {
  return size === WHOLE_PERIOD ? 0 : Math.max(0, Math.ceil(dayCount / size) - 1);
}

/** Homework of every student: a column per day (and round), a cell with answered · best run. */
export default function HomeworkGrid({ students, daysByStudent, days, scope }: HomeworkGridProps) {
  const t = useT(practiceDict);
  const locale = useLocale();
  const [windowSize, setWindowSize] = useState<number>(readWindowSize);
  const [pagesBack, setPagesBack] = useState(0);
  const rounds = scope.kind === 'homework' ? scope.homework.rounds : [];
  // A homework with a single round reads as it did before rounds existed: one column per day.
  const hasRounds = rounds.length > 1;
  // A shorter period than the one the pages were counted on: stay within it.
  const shownPagesBack = Math.min(pagesBack, lastPageBack(days.length, windowSize));
  const shownDays = visibleDays(days, windowSize, shownPagesBack);
  const canGoPrevious = shownPagesBack < lastPageBack(days.length, windowSize);
  const canGoNext = shownPagesBack > 0;

  function selectWindowSize(size: number): void {
    setWindowSize(size);
    setPagesBack(0);
    saveWindowSize(size);
  }

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

  /** Over the whole period, whatever days are on screen. */
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
        <label className={s.windowControl}>
          <span className={ui.label}>{t.daysShown}</span>
          <select
            className={s.windowSelect}
            value={windowSize}
            onChange={(event) => selectWindowSize(Number(event.target.value))}
          >
            {WINDOW_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
            <option value={WHOLE_PERIOD}>{t.allDays}</option>
          </select>
        </label>
        {windowSize !== WHOLE_PERIOD && shownDays.length > 0 && (
          <span className={s.pager}>
            <button
              type="button"
              className={s.pageButton}
              title={t.previousDays}
              disabled={!canGoPrevious}
              onClick={() => setPagesBack(shownPagesBack + PREVIOUS)}
            >
              ◀
            </button>
            <span className={ui.mono}>
              {dayText(shownDays[0], locale)} – {dayText(shownDays[shownDays.length - 1], locale)}
            </span>
            <button
              type="button"
              className={s.pageButton}
              title={t.nextDays}
              disabled={!canGoNext}
              onClick={() => setPagesBack(shownPagesBack + NEXT)}
            >
              ▶
            </button>
          </span>
        )}
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
                  {shownDays.map((day) => (
                    <th key={day} colSpan={hasRounds ? rounds.length : undefined} className={s.dayHead} title={day}>
                      {weekdayInitial(day, locale)}
                      <span className={s.dayNumber}>{day.slice(DAY_OF_MONTH_START)}</span>
                    </th>
                  ))}
                </tr>
                {hasRounds && (
                  <tr>
                    {shownDays.map((day) =>
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
                    {shownDays.map((day) =>
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
