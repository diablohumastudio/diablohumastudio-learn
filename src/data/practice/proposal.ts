import { LOCALES } from '../../i18n/locales';
import type { Locale } from '../../i18n/locales';
import type { Dictionary } from '../../i18n/useT';
import { MAX_DISTRACTOR_LEVEL, MIN_CORRECT_ANSWERS, MIN_DISTRACTOR_LEVEL, MIN_INCORRECT_ANSWERS } from './types';
import type { DistractorLevel, PracticeAnswer } from './types';

/* A question proposed by a student for a course's bank (docs/practice.md). Proposals live apart
   from `questions`: every student downloads that collection whole on each session and none may
   write it, and a question only gets its permanent id when a teacher accepts it. */

export const QUESTION_PROPOSALS_COLLECTION: string = 'questionProposals';

/** `pending`: nobody decided yet. `accepted`: it entered the bank as `questionId`. `rejected`:
    it did not, for the optional `reason`. */
export type ProposalStatus = 'pending' | 'accepted' | 'rejected';

export const PROPOSAL_STATUSES: readonly ProposalStatus[] = ['pending', 'accepted', 'rejected'];

/** The language a proposal must be written in; the other one is optional until a teacher reviews it. */
export const PROPOSAL_SOURCE_LOCALE: Locale = 'es';

/** Sorts a proposal just sent, whose server date is still on its way, as the newest. */
const NOT_STAMPED_YET_MS: number = Number.MAX_SAFE_INTEGER;

/** What the student writes: a question as the bank holds it, except that only the source
    language is required (the other text may be empty) and the wrong answers may have no level. */
export type ProposalContent = {
  /** Slug of a class or a reading of the proposal's course. */
  topic?: string;
  prompt: Dictionary<string>;
  correct: PracticeAnswer[];
  incorrect: PracticeAnswer[];
  explanation?: Dictionary<string>;
};

export type QuestionProposal = ProposalContent & {
  id: string;
  courseSlug: string;
  status: ProposalStatus;
  proposedByUid: string;
  /** Name and email are copied from the account when the proposal is sent. */
  proposedByName: string;
  proposedByEmail: string;
  createdAtMs: number | null;
  /** Only once accepted: the id the question got in the bank. */
  questionId?: string;
  /** Only once decided: the teacher who accepted or rejected it, and when. */
  decidedByUid?: string;
  decidedByName?: string;
  decidedAtMs?: number | null;
  /** Only when rejected, and optional even then. */
  reason?: string;
};

export function isProposalStatus(value: unknown): value is ProposalStatus {
  return PROPOSAL_STATUSES.some((status) => status === value);
}

/** A proposal's text in the reader's language, or in the source language when that one is empty. */
export function proposalText(text: Dictionary<string>, locale: Locale): string {
  return text[locale] !== '' ? text[locale] : text[PROPOSAL_SOURCE_LOCALE];
}

/** Newest first; a proposal whose date has not arrived from the server yet is the newest. */
export function byNewestProposal(a: QuestionProposal, b: QuestionProposal): number {
  return (b.createdAtMs ?? NOT_STAMPED_YET_MS) - (a.createdAtMs ?? NOT_STAMPED_YET_MS);
}

type AnswerKind = 'correct' | 'incorrect';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isDistractorLevel(value: unknown): value is DistractorLevel {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= MIN_DISTRACTOR_LEVEL &&
    value <= MAX_DISTRACTOR_LEVEL
  );
}

/* Unlike a bank text, only the source language must be there: the other one is read as empty. */
function parseProposalText(value: unknown, field: string): Dictionary<string> {
  if (!isRecord(value)) throw new Error(`${field}: expected an object with one text per language`);
  const text = {} as Dictionary<string>;
  for (const locale of LOCALES) {
    const localized = value[locale];
    text[locale] = typeof localized === 'string' ? localized : '';
  }
  if (text[PROPOSAL_SOURCE_LOCALE].trim() === '') throw new Error(`${field}.${PROPOSAL_SOURCE_LOCALE}: missing text`);
  return text;
}

function parseProposalAnswer(value: unknown, field: string, kind: AnswerKind): PracticeAnswer {
  const answer: PracticeAnswer = parseProposalText(value, field);
  if (kind === 'incorrect' && isRecord(value) && isDistractorLevel(value.level)) answer.level = value.level;
  return answer;
}

function parseProposalAnswers(value: unknown, field: string, minimum: number, kind: AnswerKind): PracticeAnswer[] {
  if (!Array.isArray(value) || value.length < minimum) throw new Error(`${field}: needs at least ${minimum}`);
  return value.map((item, index) => parseProposalAnswer(item, `${field}[${index}]`, kind));
}

/** Validates the content of a proposal document, or throws. A student's browser wrote it, so
    nothing in it is taken for granted; kept free of Firebase, like the bank's parser. */
export function parseProposalContent(id: string, data: unknown): ProposalContent {
  if (!isRecord(data)) throw new Error(`${id}: expected an object`);
  const content: ProposalContent = {
    prompt: parseProposalText(data.prompt, `${id}.prompt`),
    correct: parseProposalAnswers(data.correct, `${id}.correct`, MIN_CORRECT_ANSWERS, 'correct'),
    incorrect: parseProposalAnswers(data.incorrect, `${id}.incorrect`, MIN_INCORRECT_ANSWERS, 'incorrect'),
  };
  if (typeof data.topic === 'string' && data.topic !== '') content.topic = data.topic;
  if (data.explanation !== undefined) content.explanation = parseProposalText(data.explanation, `${id}.explanation`);
  return content;
}
