import type { Locale } from '../../i18n/locales';
import { LEARN_COURSES } from '../learn';
import type { QuizQuestion } from './types';
import { WWISE_UNREAL_QUESTIONS } from './wwise-unreal';

export type { QuizQuestion, ShuffledChoice } from './types';
export { shuffleChoices, shuffledCycle } from './types';

/** Every course's questions; new course files are concatenated here. */
export const QUIZ_QUESTIONS: QuizQuestion[] = [...WWISE_UNREAL_QUESTIONS];

export function findQuestion(id: string): QuizQuestion | undefined {
  return QUIZ_QUESTIONS.find((question) => question.id === id);
}

/** Title of the class a question belongs to, from the Learn registry. */
export function questionTopicTitle(question: QuizQuestion, locale: Locale): string | undefined {
  if (!question.topic) return undefined;
  for (const course of LEARN_COURSES) {
    const learnClass = course.classes.find((candidate) => candidate.slug === question.topic);
    if (learnClass) return learnClass.title[locale];
  }
  return question.topic;
}
