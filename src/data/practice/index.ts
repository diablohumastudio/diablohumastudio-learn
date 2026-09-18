import type { Locale } from '../../i18n/locales';
import { LEARN_COURSES } from '../learn';
import type { LearnCourse, PracticeScope } from '../learn';
import type { PracticeQuestion } from './types';

export type { PracticeQuestion, ShuffledChoice } from './types';
export {
  MIN_CORRECT_ANSWERS,
  MIN_INCORRECT_ANSWERS,
  SHOWN_INCORRECT_ANSWERS,
  drawChoices,
  shuffledCycle,
} from './types';

/* The bank itself lives in Firestore (src/components/practice/questions.ts);
   this module holds what only depends on the Learn registry. */

const NO_COURSE_ID_PREFIX: string = 'q';
const ID_NUMBER_WIDTH: number = 3;

export function courseOfTopic(topic: string | undefined): LearnCourse | undefined {
  if (!topic) return undefined;
  return LEARN_COURSES.find((course) => course.classes.some((candidate) => candidate.slug === topic));
}

export function questionsInScope(questions: readonly PracticeQuestion[], scope: PracticeScope): PracticeQuestion[] {
  if (scope.classSlug) return questions.filter((question) => question.topic === scope.classSlug);
  if (scope.courseSlug) {
    return questions.filter((question) => courseOfTopic(question.topic)?.slug === scope.courseSlug);
  }
  return [...questions];
}

/** Title of the class a question belongs to, from the Learn registry. */
export function questionTopicTitle(question: PracticeQuestion, locale: Locale): string | undefined {
  if (!question.topic) return undefined;
  const course = courseOfTopic(question.topic);
  const learnClass = course?.classes.find((candidate) => candidate.slug === question.topic);
  return learnClass ? learnClass.title[locale] : question.topic;
}

/** 'wwise-unreal' → 'wu', 'wwise-objects' → 'wo'. */
function slugInitials(slug: string): string {
  return slug
    .split('-')
    .map((part) => part[0])
    .join('');
}

/** 'wu-wo-': course and class initials, so every class numbers its own questions. */
function questionIdPrefix(topic: string | undefined): string {
  const course = courseOfTopic(topic);
  if (!course || !topic) return `${NO_COURSE_ID_PREFIX}-`;
  return `${slugInitials(course.slug)}-${slugInitials(topic)}-`;
}

/** Next free id for the class of `topic` (e.g. 'wu-wo-014'); ids are never reused. */
export function nextQuestionId(questions: readonly PracticeQuestion[], topic: string | undefined): string {
  const prefix = questionIdPrefix(topic);
  const highest = questions
    .filter((question) => question.id.startsWith(prefix))
    .map((question) => Number(question.id.slice(prefix.length)))
    .filter((number) => Number.isInteger(number))
    .reduce((max, number) => Math.max(max, number), 0);
  return `${prefix}${String(highest + 1).padStart(ID_NUMBER_WIDTH, '0')}`;
}
