import type { Locale } from '../../i18n/locales';
import { LEARN_COURSES } from '../learn';
import type { LearnCourse } from '../learn';
import type { QuizQuestion } from './types';

export type { QuizQuestion, ShuffledChoice } from './types';
export {
  MIN_CORRECT_ANSWERS,
  MIN_INCORRECT_ANSWERS,
  SHOWN_INCORRECT_ANSWERS,
  drawChoices,
  shuffledCycle,
} from './types';

/* The bank itself lives in Firestore (src/components/quiz/questions.ts);
   this module holds what only depends on the Learn registry. */

const NO_COURSE_ID_PREFIX: string = 'q';
const ID_NUMBER_WIDTH: number = 3;

export function courseOfTopic(topic: string | undefined): LearnCourse | undefined {
  if (!topic) return undefined;
  return LEARN_COURSES.find((course) => course.classes.some((candidate) => candidate.slug === topic));
}

/** Title of the class a question belongs to, from the Learn registry. */
export function questionTopicTitle(question: QuizQuestion, locale: Locale): string | undefined {
  if (!question.topic) return undefined;
  const course = courseOfTopic(question.topic);
  const learnClass = course?.classes.find((candidate) => candidate.slug === question.topic);
  return learnClass ? learnClass.title[locale] : question.topic;
}

/** 'wwise-unreal' → 'wu': the id prefix shared by every question of a course. */
function courseIdPrefix(course: LearnCourse | undefined): string {
  if (!course) return NO_COURSE_ID_PREFIX;
  return course.slug
    .split('-')
    .map((part) => part[0])
    .join('');
}

/** Next free id for the course of `topic` (e.g. 'wu-014'); ids are never reused. */
export function nextQuestionId(questions: readonly QuizQuestion[], topic: string | undefined): string {
  const prefix = `${courseIdPrefix(courseOfTopic(topic))}-`;
  const highest = questions
    .filter((question) => question.id.startsWith(prefix))
    .map((question) => Number(question.id.slice(prefix.length)))
    .filter((number) => Number.isInteger(number))
    .reduce((max, number) => Math.max(max, number), 0);
  return `${prefix}${String(highest + 1).padStart(ID_NUMBER_WIDTH, '0')}`;
}
