/* Homework is counted per day with two numbers: how many questions were answered and the
   best run, the most correct answers within RUN_LENGTH in a row. The run is what makes the
   count honest: random clicking reaches the daily count, not the run.
   There are two kinds, and their answers never mix: the daily homework of a course (any of
   its questions, every day) and the specific homeworks a teacher creates (their own
   questions, days and answers per day).
   A specific homework is made of rounds, each with its own questions and its own count, and
   the run is asked of every round: one good stretch of answers passes one round, never a
   whole long homework. */

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

/** The only round of a homework saved before rounds existed has no id: the days its students
    already filled carry no round, and keep counting for it. */
export const LEGACY_ROUND_ID: string = '';

const DAY_KEY_PART_WIDTH: number = 2;
const DAY_KEY_PATTERN: RegExp = /^\d{4}-\d{2}-\d{2}$/;
const ROUND_ID_LENGTH: number = 6;

/** One round of a specific homework: counted apart from the others, with its own best run. */
export type HomeworkRound = {
  /** Opaque and never reused within its homework: the students' answers are keyed by it. */
  id: string;
  /** Questions of the practice bank ticked in the picker: the only ones the round asks. */
  questionIds: string[];
  /** Answers the round needs each day; the best run asked for is the one of every homework. */
  goal: number;
};

/** What a teacher sets for a specific homework. */
export type HomeworkSettings = {
  title: string;
  courseSlug: string;
  /** At least one, offered in this order. A day is done when every round is. */
  rounds: HomeworkRound[];
  /** Student-local days ('YYYY-MM-DD'), both included. */
  firstDay: string;
  lastDay: string;
};

export type Homework = HomeworkSettings & { id: string };

/** A round together with its homework: what the play screen is given. */
export type RoundOfHomework = { homework: Homework; round: HomeworkRound };

export type DayProgress = {
  /** Course of the daily homework; empty on the days of a specific homework. */
  courseSlug: string;
  /** Only on the days of a specific homework, which never count for the daily one. */
  homeworkId?: string;
  /** With `homeworkId`: the round the answers were given in (`HomeworkRound.id`). */
  roundId?: string;
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

export function emptyHomeworkDay(homeworkId: string, roundId: string, day: string): DayProgress {
  return { courseSlug: '', homeworkId, roundId, day, answered: 0, correct: 0, bestRun: 0 };
}

export function newRoundId(): string {
  return Array.from({ length: ROUND_ID_LENGTH }, () => Math.floor(Math.random() * 36).toString(36)).join('');
}

/** The round a play link names. A link without one is the link of the round without id, the
    way every homework was linked before rounds existed; failing that, of the first round. */
export function findRound(homework: Homework, roundId: string | undefined): HomeworkRound | undefined {
  if (!roundId) return homework.rounds.find((round) => round.id === LEGACY_ROUND_ID) ?? homework.rounds[0];
  return homework.rounds.find((round) => round.id === roundId);
}

function isGoalMet(progress: DayProgress, questionsGoal: number): boolean {
  return progress.answered >= questionsGoal && progress.bestRun >= RUN_CORRECT_GOAL;
}

/** A day of the daily homework. Takes one argument only, so it is safe as an array callback. */
export function isDayDone(progress: DayProgress): boolean {
  return isGoalMet(progress, DAILY_QUESTIONS_GOAL);
}

/** One round of a homework on one day. */
export function isRoundDone(progress: DayProgress, round: HomeworkRound): boolean {
  return isGoalMet(progress, round.goal);
}

/** One round on one day, out of a student's days of every homework. */
export function roundDay(
  homeworkDays: readonly DayProgress[],
  homework: Homework,
  round: HomeworkRound,
  day: string
): DayProgress {
  return (
    homeworkDays.find(
      (candidate) => candidate.homeworkId === homework.id && candidate.roundId === round.id && candidate.day === day
    ) ?? emptyHomeworkDay(homework.id, round.id, day)
  );
}

/** A day of a homework is done when every one of its rounds is. */
export function isHomeworkDayDone(homeworkDays: readonly DayProgress[], homework: Homework, day: string): boolean {
  return homework.rounds.every((round) => isRoundDone(roundDay(homeworkDays, homework, round, day), round));
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
