import type { Locale } from '../../i18n/locales';
import { LEARN_COURSES, findTopic } from '../learn';
import type { LearnCourse, PracticeScope } from '../learn';
import type { PracticeQuestion } from './types';

export type { DistractorLevel, PracticeAnswer, PracticeQuestion, ShuffledChoice } from './types';
export {
  DISTRACTOR_LEVELS,
  EXAM_QUESTIONS_COLLECTION,
  QUESTIONS_COLLECTION,
  MIN_CORRECT_ANSWERS,
  MIN_INCORRECT_ANSWERS,
  SHOWN_INCORRECT_ANSWERS,
  drawChoices,
  newAnswerId,
  shuffledCycle,
} from './types';

export type {
  DayProgress,
  DayRange,
  Homework,
  HomeworkRound,
  HomeworkSettings,
  HomeworkState,
  PeriodSummary,
  ProgressScope,
  RoundOfHomework,
} from './homework';
export {
  DAILY_QUESTIONS_GOAL,
  DAY_SCORE_FULL,
  DAY_SCORE_HALF,
  DAY_SCORE_NONE,
  DEFAULT_HOMEWORK_DAILY_GOAL,
  HOMEWORKS_COLLECTION,
  LEGACY_ROUND_ID,
  MAX_GRID_DAYS,
  RECENT_DAYS_SHOWN,
  RUN_CORRECT_GOAL,
  RUN_LENGTH,
  TIMEOUT_COUNTS_AS_ANSWER,
  dailyDay,
  dailyDayScore,
  dayKey,
  dayKeyAfter,
  dayKeysBetween,
  dayText,
  emptyDay,
  emptyHomeworkDay,
  findRound,
  homeworkDayScore,
  homeworkState,
  isDayDone,
  isDayKey,
  isHomeworkDayDone,
  isHomeworkFor,
  isHomeworkOpen,
  isRoundDone,
  monthKeyOf,
  monthKeysBetween,
  monthRange,
  monthText,
  newRoundId,
  pushRunResult,
  recentDayKeys,
  roundDay,
  roundScore,
  runCorrectCount,
  scopeDayScore,
  startedHomeworks,
  summarizePeriod,
  weekDayKeys,
  weekdayInitial,
} from './homework';

export { parseQuestionIds, questionsWithIds } from './selection';

/* The bank itself lives in Firestore (src/components/practice/questions.ts);
   this module holds what only depends on the Learn registry. */

const NO_COURSE_ID_PREFIX: string = 'q';
const EXAM_ONLY_ID_PREFIX: string = 'x-';
const ID_NUMBER_WIDTH: number = 3;

/** The course whose classes or readings include `topic`: the only link between a question and a course. */
export function courseOfTopic(topic: string | undefined): LearnCourse | undefined {
  if (!topic) return undefined;
  return LEARN_COURSES.find((course) => findTopic(course, topic) !== undefined);
}

export function questionsInScope(questions: readonly PracticeQuestion[], scope: PracticeScope): PracticeQuestion[] {
  if (scope.classSlug) return questions.filter((question) => question.topic === scope.classSlug);
  if (scope.courseSlug) {
    return questions.filter((question) => courseOfTopic(question.topic)?.slug === scope.courseSlug);
  }
  return [...questions];
}

/** Title of the class or reading a question is about, from the Learn registry. */
export function questionTopicTitle(question: Pick<PracticeQuestion, 'topic'>, locale: Locale): string | undefined {
  if (!question.topic) return undefined;
  const course = courseOfTopic(question.topic);
  const learnTopic = course ? findTopic(course, question.topic) : undefined;
  return learnTopic ? learnTopic.title[locale] : question.topic;
}

/** 'wwise-unreal' → 'wu', 'wwise-objects' → 'wo'. */
function slugInitials(slug: string): string {
  return slug
    .split('-')
    .map((part) => part[0])
    .join('');
}

/** 'wu-wo-': course and topic initials, so every class and every reading numbers its own questions. */
function questionIdPrefix(topic: string | undefined): string {
  const course = courseOfTopic(topic);
  if (!course || !topic) return `${NO_COURSE_ID_PREFIX}-`;
  return `${slugInitials(course.slug)}-${slugInitials(topic)}-`;
}

/** Next free id for the class or reading of `topic` (e.g. 'wu-wo-014'); ids are never reused. */
export function nextQuestionId(
  questions: readonly PracticeQuestion[],
  topic: string | undefined,
  examOnly: boolean
): string {
  // Both banks share the exam papers and the stats keys, so their ids must never collide.
  const prefix = `${examOnly ? EXAM_ONLY_ID_PREFIX : ''}${questionIdPrefix(topic)}`;
  const highest = questions
    .filter((question) => question.id.startsWith(prefix))
    .map((question) => Number(question.id.slice(prefix.length)))
    .filter((number) => Number.isInteger(number))
    .reduce((max, number) => Math.max(max, number), 0);
  return `${prefix}${String(highest + 1).padStart(ID_NUMBER_WIDTH, '0')}`;
}
