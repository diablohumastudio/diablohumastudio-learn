/* Homework is counted per course and per day with two numbers: how many questions were
   answered and the best run, the most correct answers within RUN_LENGTH in a row. The run
   is what makes the count honest: random clicking reaches the daily count, not the run. */

export const DAILY_QUESTIONS_GOAL: number = 30;
export const RUN_LENGTH: number = 10;
export const RUN_CORRECT_GOAL: number = 7;
/** Running out of time is saved as a wrong answer, so it counts for the day and the run.
    Ignoring it would let a student skip every question they do not know. */
export const TIMEOUT_COUNTS_AS_ANSWER: boolean = true;
export const RECENT_DAYS_SHOWN: number = 7;
export const DAYS_PER_WEEK: number = 7;

/** Widest range the teacher's grid draws: one column per day. */
export const MAX_GRID_DAYS: number = 92;

const DAY_KEY_PART_WIDTH: number = 2;

export type DayProgress = {
  courseSlug: string;
  /** Local date of the student, 'YYYY-MM-DD'. */
  day: string;
  answered: number;
  correct: number;
  bestRun: number;
};

/** The student's local date: a day of homework ends at their midnight, not at UTC's. */
export function dayKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(DAY_KEY_PART_WIDTH, '0');
  const dayOfMonth = String(date.getDate()).padStart(DAY_KEY_PART_WIDTH, '0');
  return `${date.getFullYear()}-${month}-${dayOfMonth}`;
}

/** Oldest first, ending today. */
export function recentDayKeys(count: number, today: Date): string[] {
  const keys: string[] = [];
  for (let daysAgo = count - 1; daysAgo >= 0; daysAgo -= 1) {
    keys.push(dayKey(new Date(today.getFullYear(), today.getMonth(), today.getDate() - daysAgo)));
  }
  return keys;
}

/** The calendar week of `today`, Monday to Sunday: what a student reads as "this week". */
export function weekDayKeys(today: Date): string[] {
  const daysSinceMonday = (today.getDay() + DAYS_PER_WEEK - 1) % DAYS_PER_WEEK;
  const keys: string[] = [];
  for (let offset = 0; offset < DAYS_PER_WEEK; offset += 1) {
    keys.push(dayKey(new Date(today.getFullYear(), today.getMonth(), today.getDate() - daysSinceMonday + offset)));
  }
  return keys;
}

function dateOfDayKey(day: string): Date {
  const [year, month, dayOfMonth] = day.split('-').map(Number);
  return new Date(year, month - 1, dayOfMonth);
}

/** Every day from `firstDay` to `lastDay`, both included; empty when the range is backwards. */
export function dayKeysBetween(firstDay: string, lastDay: string): string[] {
  const keys: string[] = [];
  const cursor = dateOfDayKey(firstDay);
  const end = dateOfDayKey(lastDay);
  while (cursor <= end && keys.length < MAX_GRID_DAYS) {
    keys.push(dayKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return keys;
}

export function weekdayInitial(day: string, locale: string): string {
  return dateOfDayKey(day).toLocaleDateString(locale, { weekday: 'narrow' });
}

export function emptyDay(courseSlug: string, day: string): DayProgress {
  return { courseSlug, day, answered: 0, correct: 0, bestRun: 0 };
}

export function isDayDone(progress: DayProgress): boolean {
  return progress.answered >= DAILY_QUESTIONS_GOAL && progress.bestRun >= RUN_CORRECT_GOAL;
}

/** The run keeps only the last RUN_LENGTH results, oldest first. */
export function pushRunResult(run: readonly boolean[], isCorrect: boolean): boolean[] {
  return [...run, isCorrect].slice(-RUN_LENGTH);
}

export function runCorrectCount(run: readonly boolean[]): number {
  return run.filter(Boolean).length;
}
