/* Homework is counted per day with two numbers: how many questions were answered and the
   best run, the most correct answers within RUN_LENGTH in a row. The run is what makes the
   count honest: random clicking reaches the daily count, not the run.
   There are two kinds, and their answers never mix: the daily homework of a course (any of
   its questions, every day) and the specific homeworks a teacher creates (their own
   questions, days and answers per day). */

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

export const HOMEWORKS_COLLECTION: string = 'homeworks';
export const DEFAULT_HOMEWORK_DAILY_GOAL: number = 50;
/** A finished homework stays on the course page this long, so students see how it ended. */
export const HOMEWORK_SHOWN_AFTER_DAYS: number = 7;

const DAY_KEY_PART_WIDTH: number = 2;
const DAY_KEY_PATTERN: RegExp = /^\d{4}-\d{2}-\d{2}$/;

/** What a teacher sets for a specific homework. */
export type HomeworkSettings = {
  title: string;
  courseSlug: string;
  /** Questions of the practice bank ticked in the picker: the only ones the homework asks. */
  questionIds: string[];
  /** Student-local days ('YYYY-MM-DD'), both included. */
  firstDay: string;
  lastDay: string;
  /** Answers a day needs; the best run asked for is the one of every homework. */
  dailyGoal: number;
};

export type Homework = HomeworkSettings & { id: string };

export type DayProgress = {
  /** Course of the daily homework; empty on the days of a specific homework. */
  courseSlug: string;
  /** Only on the days of a specific homework, which never count for the daily one. */
  homeworkId?: string;
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

/** 'Thu, Oct 1': how a homework names its first and last day. */
export function dayText(day: string, locale: string): string {
  return dateOfDayKey(day).toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short' });
}

export function isDayKey(value: unknown): value is string {
  return typeof value === 'string' && DAY_KEY_PATTERN.test(value);
}

/** `day` moved forward by a number of days. */
export function dayKeyAfter(day: string, days: number): string {
  const date = dateOfDayKey(day);
  date.setDate(date.getDate() + days);
  return dayKey(date);
}

export function emptyDay(courseSlug: string, day: string): DayProgress {
  return { courseSlug, day, answered: 0, correct: 0, bestRun: 0 };
}

export function emptyHomeworkDay(homeworkId: string, day: string): DayProgress {
  return { courseSlug: '', homeworkId, day, answered: 0, correct: 0, bestRun: 0 };
}

function isGoalMet(progress: DayProgress, questionsGoal: number): boolean {
  return progress.answered >= questionsGoal && progress.bestRun >= RUN_CORRECT_GOAL;
}

/** A day of the daily homework. Takes one argument only, so it is safe as an array callback. */
export function isDayDone(progress: DayProgress): boolean {
  return isGoalMet(progress, DAILY_QUESTIONS_GOAL);
}

export function isHomeworkDayDone(progress: DayProgress, homework: Homework): boolean {
  return isGoalMet(progress, homework.dailyGoal);
}

/** Day keys compare as text: 'YYYY-MM-DD' sorts like the dates. Answers only count on these days. */
export function isHomeworkOpen(homework: Homework, today: string): boolean {
  return homework.firstDay <= today && today <= homework.lastDay;
}

/** From its first day until a few days after the last one. */
export function isHomeworkShown(homework: Homework, today: string): boolean {
  return homework.firstDay <= today && today <= dayKeyAfter(homework.lastDay, HOMEWORK_SHOWN_AFTER_DAYS);
}

/** The run keeps only the last RUN_LENGTH results, oldest first. */
export function pushRunResult(run: readonly boolean[], isCorrect: boolean): boolean[] {
  return [...run, isCorrect].slice(-RUN_LENGTH);
}

export function runCorrectCount(run: readonly boolean[]): number {
  return run.filter(Boolean).length;
}
