import { LOCALES } from '../../i18n/locales';
import type { Dictionary } from '../../i18n/useT';
import { MAX_DISTRACTOR_LEVEL, MIN_CORRECT_ANSWERS, MIN_DISTRACTOR_LEVEL, MIN_INCORRECT_ANSWERS } from './types';
import type { DistractorLevel, PracticeAnswer, PracticeQuestion } from './types';

/* Kept free of Firebase and of the Learn registry: the exam API routes parse the bank
   on the server with the same code the browser uses. */

export type ParseOptions = {
  /** Import files must rate every wrong answer; the bank is read as it is, so questions saved
      before levels existed keep working until they are rated. */
  requireLevels?: boolean;
};

type AnswerKind = 'correct' | 'incorrect';

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

function parseSlides(value: unknown, field: string): string[] {
  if (!Array.isArray(value) || !value.every((slide) => typeof slide === 'string' && slide !== '')) {
    throw new Error(`${field}: expected a list of slide ids`);
  }
  const slides = value as string[];
  return slides.filter((slide, index) => slides.indexOf(slide) === index);
}

function parseLevel(value: unknown, field: string, required: boolean): DistractorLevel | undefined {
  if (value === undefined) {
    if (required) throw new Error(`${field}.level: missing (${MIN_DISTRACTOR_LEVEL} to ${MAX_DISTRACTOR_LEVEL})`);
    return undefined;
  }
  const isWhole = typeof value === 'number' && Number.isInteger(value);
  if (!isWhole || value < MIN_DISTRACTOR_LEVEL || value > MAX_DISTRACTOR_LEVEL) {
    throw new Error(`${field}.level: expected a whole number from ${MIN_DISTRACTOR_LEVEL} to ${MAX_DISTRACTOR_LEVEL}`);
  }
  return value as DistractorLevel;
}

/* Only wrong answers carry a level: one written on a correct answer is dropped. */
function parseAnswer(value: unknown, field: string, kind: AnswerKind, requireLevels: boolean): PracticeAnswer {
  const answer: PracticeAnswer = parseText(value, field);
  if (!isRecord(value)) return answer;
  if (typeof value.id === 'string' && value.id !== '') answer.id = value.id;
  if (kind === 'incorrect') {
    const level = parseLevel(value.level, field, requireLevels);
    if (level !== undefined) answer.level = level;
  }
  return answer;
}

function parseAnswerList(
  value: unknown,
  field: string,
  minimum: number,
  kind: AnswerKind,
  requireLevels: boolean
): PracticeAnswer[] {
  if (!Array.isArray(value) || value.length < minimum) throw new Error(`${field}: needs at least ${minimum}`);
  return value.map((item, index) => parseAnswer(item, `${field}[${index}]`, kind, requireLevels));
}

/** Validates any raw shape (a Firestore doc or pasted JSON) into a question, or throws. */
export function parseQuestion(id: string, data: unknown, options: ParseOptions = {}): PracticeQuestion {
  if (!isRecord(data)) throw new Error(`${id}: expected an object`);
  const requireLevels = options.requireLevels === true;
  const topic = typeof data.topic === 'string' ? data.topic : undefined;
  if (data.topic !== undefined && topic === undefined) throw new Error(`${id}: topic must be text`);
  const question: PracticeQuestion = {
    id,
    prompt: parseText(data.prompt, `${id}.prompt`),
    correct: parseAnswerList(data.correct, `${id}.correct`, MIN_CORRECT_ANSWERS, 'correct', requireLevels),
    incorrect: parseAnswerList(data.incorrect, `${id}.incorrect`, MIN_INCORRECT_ANSWERS, 'incorrect', requireLevels),
    retired: Boolean(data.retired),
  };
  if (topic) question.topic = topic;
  if (data.slides !== undefined) {
    const slides = parseSlides(data.slides, `${id}.slides`);
    if (slides.length > 0) question.slides = slides;
  }
  if (data.explanation !== undefined) question.explanation = parseText(data.explanation, `${id}.explanation`);
  return question;
}

/** A question read from an import file. Without an id, the import review gives it one. */
export type ImportedQuestion = Omit<PracticeQuestion, 'id'> & { id: string | null };

/** Pasted or uploaded JSON: an array of questions, every wrong answer rated. Nothing is written
    from here: the import review shows what each one would do before the teacher confirms. */
export function parseImportList(json: string): ImportedQuestion[] {
  const parsed: unknown = JSON.parse(json);
  if (!Array.isArray(parsed)) throw new Error('expected an array of questions');
  return parsed.map((item, index) => {
    const id = isRecord(item) && typeof item.id === 'string' ? item.id.trim() : '';
    const question = parseQuestion(id === '' ? `question ${index + 1}` : id, item, { requireLevels: true });
    return { ...question, id: id === '' ? null : id };
  });
}
