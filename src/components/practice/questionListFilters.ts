import { questionTopicTitle } from '../../data/practice';
import type { PracticeQuestion } from '../../data/practice';
import { proposalText, proposerName } from '../../data/practice/proposal';
import type { QuestionProposal } from '../../data/practice/proposal';
import type { Locale } from '../../i18n/locales';

/* The pure half of the editor's list (QuestionList.tsx): what a row shows, which rows the
   filters keep and in what order they go. No React and no Firebase. */

/** `pending` is a proposal nobody has decided yet; the other two are questions of a bank. */
export type RowStatus = 'pending' | 'active' | 'retired';

export type ListRowSource =
  | { kind: 'question'; question: PracticeQuestion }
  | { kind: 'proposal'; proposal: QuestionProposal };

/** One row of the list, whichever its source: everything the columns show, filter and sort by. */
export type ListRow = {
  /** Unique in the list: a question's id, or a proposal's id behind a prefix no question id has. */
  key: string;
  status: RowStatus;
  /** Empty for a proposal: it gets its id when it is accepted. */
  questionId: string;
  prompt: string;
  /** The slug of its class or reading; undefined without a topic. */
  topic: string | undefined;
  topicTitle: string;
  correctCount: number;
  incorrectCount: number;
  proposedBy: string;
  acceptedBy: string;
  isExamOnly: boolean;
  source: ListRowSource;
};

export type StatusFilter = 'all' | RowStatus;

export const STATUS_FILTERS: readonly StatusFilter[] = ['all', 'pending', 'active', 'retired'];
/** Values of the topic filter that are not a slug: slugs are kebab-case letters and digits. */
export const ALL_TOPICS_VALUE: string = '*';
export const NO_TOPIC_VALUE: string = '?';
export const ALL_NAMES_VALUE: string = '';

export type ListFilters = {
  status: StatusFilter;
  /** `ALL_TOPICS_VALUE`, `NO_TOPIC_VALUE` or the slug of a class or a reading. */
  topic: string;
  /** Fewest and most wrong answers a row may have; null is no limit. */
  minIncorrect: number | null;
  maxIncorrect: number | null;
  /** A name as the column shows it, or `ALL_NAMES_VALUE`. */
  proposedBy: string;
  acceptedBy: string;
};

export type NameColumn = 'proposedBy' | 'acceptedBy';
export type SortColumn = 'id' | 'prompt' | 'topic' | 'answers' | 'status' | NameColumn;
export type SortDirection = 'asc' | 'desc';

/** Null is the initial order: the pending proposals first, then the questions by id. */
export type ListSort = { column: SortColumn; direction: SortDirection } | null;

export type ListView = {
  filters: ListFilters;
  sort: ListSort;
};

export const NO_FILTERS: ListFilters = {
  status: 'all',
  topic: ALL_TOPICS_VALUE,
  minIncorrect: null,
  maxIncorrect: null,
  proposedBy: ALL_NAMES_VALUE,
  acceptedBy: ALL_NAMES_VALUE,
};

export const INITIAL_LIST_VIEW: ListView = { filters: NO_FILTERS, sort: null };

const PROPOSAL_KEY_PREFIX: string = 'proposal:';
const STATUS_ORDER: Record<RowStatus, number> = { pending: 0, active: 1, retired: 2 };

function questionRow(question: PracticeQuestion, locale: Locale): ListRow {
  return {
    key: question.id,
    status: question.retired ? 'retired' : 'active',
    questionId: question.id,
    prompt: question.prompt[locale],
    topic: question.topic,
    topicTitle: questionTopicTitle(question, locale) ?? '',
    correctCount: question.correct.length,
    incorrectCount: question.incorrect.length,
    proposedBy: question.proposedByName ?? '',
    acceptedBy: question.acceptedByName ?? '',
    isExamOnly: Boolean(question.examOnly),
    source: { kind: 'question', question },
  };
}

function proposalRow(proposal: QuestionProposal, locale: Locale): ListRow {
  return {
    key: `${PROPOSAL_KEY_PREFIX}${proposal.id}`,
    status: 'pending',
    questionId: '',
    prompt: proposalText(proposal.prompt, locale),
    topic: proposal.topic,
    topicTitle: questionTopicTitle(proposal, locale) ?? '',
    correctCount: proposal.correct.length,
    incorrectCount: proposal.incorrect.length,
    proposedBy: proposerName(proposal),
    acceptedBy: '',
    isExamOnly: false,
    source: { kind: 'proposal', proposal },
  };
}

function byQuestionId(a: PracticeQuestion, b: PracticeQuestion): number {
  return a.id.localeCompare(b.id);
}

/** The rows in the initial order: the pending proposals as they come, newest first, then the
    questions of both banks by id. */
export function toListRows(
  questions: readonly PracticeQuestion[],
  pendingProposals: readonly QuestionProposal[],
  locale: Locale
): ListRow[] {
  return [
    ...pendingProposals.map((proposal) => proposalRow(proposal, locale)),
    ...[...questions].sort(byQuestionId).map((question) => questionRow(question, locale)),
  ];
}

export function hasFilters(filters: ListFilters): boolean {
  return (
    filters.status !== NO_FILTERS.status ||
    filters.topic !== NO_FILTERS.topic ||
    filters.minIncorrect !== null ||
    filters.maxIncorrect !== null ||
    filters.proposedBy !== ALL_NAMES_VALUE ||
    filters.acceptedBy !== ALL_NAMES_VALUE
  );
}

function matchesTopic(row: ListRow, topicFilter: string): boolean {
  if (topicFilter === ALL_TOPICS_VALUE) return true;
  if (topicFilter === NO_TOPIC_VALUE) return row.topic === undefined;
  return row.topic === topicFilter;
}

function matchesFilters(row: ListRow, filters: ListFilters): boolean {
  if (filters.status !== 'all' && row.status !== filters.status) return false;
  if (!matchesTopic(row, filters.topic)) return false;
  if (filters.minIncorrect !== null && row.incorrectCount < filters.minIncorrect) return false;
  if (filters.maxIncorrect !== null && row.incorrectCount > filters.maxIncorrect) return false;
  if (filters.proposedBy !== ALL_NAMES_VALUE && row.proposedBy !== filters.proposedBy) return false;
  return filters.acceptedBy === ALL_NAMES_VALUE || row.acceptedBy === filters.acceptedBy;
}

export function filteredRows(rows: readonly ListRow[], filters: ListFilters): ListRow[] {
  return rows.filter((row) => matchesFilters(row, filters));
}

/* A row without the value (a proposal has no id, most questions have no proposer) goes last in
   both directions: turning the order around should not bury the rows that have something. */
function compareTexts(a: string, b: string, direction: SortDirection): number {
  if (a === '' || b === '') return a === b ? 0 : a === '' ? 1 : -1;
  const order = a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true });
  return direction === 'asc' ? order : -order;
}

function compareNumbers(a: number, b: number, direction: SortDirection): number {
  return direction === 'asc' ? a - b : b - a;
}

/* The Answers column reads "right / wrong": it sorts by the wrong ones, which are what makes a
   question look different each time, and then by the right ones. */
function compareAnswers(a: ListRow, b: ListRow, direction: SortDirection): number {
  const byIncorrect = compareNumbers(a.incorrectCount, b.incorrectCount, direction);
  return byIncorrect !== 0 ? byIncorrect : compareNumbers(a.correctCount, b.correctCount, direction);
}

function compareRows(a: ListRow, b: ListRow, column: SortColumn, direction: SortDirection): number {
  if (column === 'id') return compareTexts(a.questionId, b.questionId, direction);
  if (column === 'prompt') return compareTexts(a.prompt, b.prompt, direction);
  if (column === 'topic') return compareTexts(a.topicTitle, b.topicTitle, direction);
  if (column === 'answers') return compareAnswers(a, b, direction);
  if (column === 'status') return compareNumbers(STATUS_ORDER[a.status], STATUS_ORDER[b.status], direction);
  return compareTexts(a[column], b[column], direction);
}

/** The rows in the order of `sort`; rows that tie keep the order they came in, the initial one. */
export function sortedRows(rows: readonly ListRow[], sort: ListSort): ListRow[] {
  if (sort === null) return [...rows];
  return [...rows].sort((a, b) => compareRows(a, b, sort.column, sort.direction));
}

/** What a click on a header does: ascending the first time, then the other direction each time. */
export function toggledSort(sort: ListSort, column: SortColumn): ListSort {
  if (sort === null || sort.column !== column) return { column, direction: 'asc' };
  return { column, direction: sort.direction === 'asc' ? 'desc' : 'asc' };
}

/** The names a column holds, each once, alphabetical: the choices of its filter. */
export function namesIn(rows: readonly ListRow[], column: NameColumn): string[] {
  const names = new Set(rows.map((row) => row[column]).filter((name) => name !== ''));
  return Array.from(names).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
}
