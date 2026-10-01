import { LOCALES } from '../../i18n/locales';
import type { Dictionary } from '../../i18n/useT';
import { nextQuestionId } from './index';
import type { ImportedQuestion } from './parse';
import type { PracticeAnswer, PracticeQuestion } from './types';

/* What an import would do to the bank, question by question, before anything is written.
   Kept free of Firebase: it only compares the file with the bank the editor already holds. */

/** `new`: the id is free. `changed`: the id exists and the content differs. `identical`: the id
    exists with the same content. `noId`: the file gave no id, so one is assigned. */
export type ImportStatus = 'new' | 'changed' | 'identical' | 'noId';

export type QuestionField = 'topic' | 'slides' | 'prompt' | 'correct' | 'incorrect' | 'explanation' | 'retired';

export type ImportEntry = {
  status: ImportStatus;
  /** The id the question is saved with: the file's, or the next free one of its class. */
  id: string;
  question: ImportedQuestion;
  /** Only for `changed`: what differs from the question in the bank. */
  changedFields: QuestionField[];
};

export type ImportCounts = Record<ImportStatus, number>;

function isSameText(a: Dictionary<string> | undefined, b: Dictionary<string> | undefined): boolean {
  if (!a || !b) return a === b;
  return LOCALES.every((locale) => a[locale] === b[locale]);
}

/* Answer ids are left out on purpose: a file written by hand has none, and the texts are what
   the students see. */
function areSameAnswers(a: readonly PracticeAnswer[], b: readonly PracticeAnswer[]): boolean {
  return a.length === b.length && a.every((answer, index) => isSameText(answer, b[index]));
}

function areSameSlides(a: readonly string[] | undefined, b: readonly string[] | undefined): boolean {
  const first = a ?? [];
  const second = b ?? [];
  return first.length === second.length && first.every((slide, index) => slide === second[index]);
}

export function changedFieldsOf(imported: ImportedQuestion, existing: PracticeQuestion): QuestionField[] {
  const fields: QuestionField[] = [];
  if ((imported.topic ?? '') !== (existing.topic ?? '')) fields.push('topic');
  if (!areSameSlides(imported.slides, existing.slides)) fields.push('slides');
  if (!isSameText(imported.prompt, existing.prompt)) fields.push('prompt');
  if (!areSameAnswers(imported.correct, existing.correct)) fields.push('correct');
  if (!areSameAnswers(imported.incorrect, existing.incorrect)) fields.push('incorrect');
  if (!isSameText(imported.explanation, existing.explanation)) fields.push('explanation');
  if (imported.retired !== existing.retired) fields.push('retired');
  return fields;
}

/** One entry per question of the file, in the file's order. `bank` holds both banks, so an id is
    never given twice; `examOnly` says which bank the import goes to. */
export function reviewImport(
  imported: readonly ImportedQuestion[],
  bank: readonly PracticeQuestion[],
  examOnly: boolean
): ImportEntry[] {
  const bankById = new Map(bank.map((question) => [question.id, question]));
  // Ids already taken: the bank's, the file's own, and the ones assigned while walking the file.
  const takenIds: PracticeQuestion[] = [
    ...bank,
    ...imported.filter((question) => question.id !== null).map((question) => ({ ...question, id: question.id ?? '' })),
  ];

  return imported.map((question) => {
    if (question.id === null) {
      const id = nextQuestionId(takenIds, question.topic, examOnly);
      takenIds.push({ ...question, id });
      return { status: 'noId', id, question, changedFields: [] };
    }
    const existing = bankById.get(question.id);
    if (!existing) return { status: 'new', id: question.id, question, changedFields: [] };
    const changedFields = changedFieldsOf(question, existing);
    return { status: changedFields.length > 0 ? 'changed' : 'identical', id: question.id, question, changedFields };
  });
}

export function countByStatus(entries: readonly ImportEntry[]): ImportCounts {
  const counts: ImportCounts = { new: 0, changed: 0, identical: 0, noId: 0 };
  for (const entry of entries) counts[entry.status] += 1;
  return counts;
}

/** Identical questions are left alone: writing them would only give their answers new ids. */
export function questionsToWrite(entries: readonly ImportEntry[], examOnly: boolean): PracticeQuestion[] {
  return entries
    .filter((entry) => entry.status !== 'identical')
    .map((entry) => ({ ...entry.question, id: entry.id, examOnly }));
}
