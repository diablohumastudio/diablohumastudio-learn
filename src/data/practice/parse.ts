import { LOCALES } from '../../i18n/locales';
import type { Dictionary } from '../../i18n/useT';
import { MIN_CORRECT_ANSWERS, MIN_INCORRECT_ANSWERS } from './types';
import type { PracticeAnswer, PracticeQuestion } from './types';

/* Kept free of Firebase and of the Learn registry: the exam API routes parse the bank
   on the server with the same code the browser uses. */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseText(value: unknown, field: string): Dictionary<string> {
  if (!isRecord(value)) throw new Error(`${field}: expected an object with one text per language`);
  const text = {} as Dictionary<string>;
  for (const locale of LOCALES) {
    const localized = value[locale];
    if (typeof localized !== 'string' || localized.trim() === '') {
      throw new Error(`${field}.${locale}: missing text`);
    }
    text[locale] = localized;
  }
  return text;
}

function parseAnswer(value: unknown, field: string): PracticeAnswer {
  const answer: PracticeAnswer = parseText(value, field);
  if (isRecord(value) && typeof value.id === 'string' && value.id !== '') answer.id = value.id;
  return answer;
}

function parseAnswerList(value: unknown, field: string, minimum: number): PracticeAnswer[] {
  if (!Array.isArray(value) || value.length < minimum) throw new Error(`${field}: needs at least ${minimum}`);
  return value.map((item, index) => parseAnswer(item, `${field}[${index}]`));
}

/** Validates any raw shape (a Firestore doc or pasted JSON) into a question, or throws. */
export function parseQuestion(id: string, data: unknown): PracticeQuestion {
  if (!isRecord(data)) throw new Error(`${id}: expected an object`);
  const topic = typeof data.topic === 'string' ? data.topic : undefined;
  if (data.topic !== undefined && topic === undefined) throw new Error(`${id}: topic must be text`);
  const question: PracticeQuestion = {
    id,
    prompt: parseText(data.prompt, `${id}.prompt`),
    correct: parseAnswerList(data.correct, `${id}.correct`, MIN_CORRECT_ANSWERS),
    incorrect: parseAnswerList(data.incorrect, `${id}.incorrect`, MIN_INCORRECT_ANSWERS),
    retired: Boolean(data.retired),
  };
  if (topic) question.topic = topic;
  if (data.explanation !== undefined) question.explanation = parseText(data.explanation, `${id}.explanation`);
  return question;
}

/** Pasted JSON: an array of questions, each carrying its own `id`. */
export function parseQuestionList(json: string): PracticeQuestion[] {
  const parsed: unknown = JSON.parse(json);
  if (!Array.isArray(parsed)) throw new Error('expected an array of questions');
  return parsed.map((item, index) => {
    const id = isRecord(item) && typeof item.id === 'string' ? item.id.trim() : '';
    if (id === '') throw new Error(`question ${index + 1}: missing id`);
    return parseQuestion(id, item);
  });
}
