import { LEARN_COURSES } from '../../data/learn';
import type { PracticeQuestion } from '../../data/practice';
import type { QuestionProposal } from '../../data/practice/proposal';
import { practiceDict } from '../../i18n/pages/practice';
import { useLocale, useT } from '../../i18n/useT';
import ui from '../learn/ui.module.css';
import s from './QuestionList.module.css';
import {
  ALL_NAMES_VALUE,
  ALL_TOPICS_VALUE,
  NO_FILTERS,
  NO_TOPIC_VALUE,
  STATUS_FILTERS,
  filteredRows,
  hasFilters,
  namesIn,
  sortedRows,
  toListRows,
  toggledSort,
} from './questionListFilters';
import type {
  ListFilters,
  ListRow,
  ListSort,
  ListView,
  NameColumn,
  RowStatus,
  SortColumn,
  StatusFilter,
} from './questionListFilters';
import TopicOptions from './TopicOptions';

type Texts = Record<keyof typeof practiceDict.en, string>;

/** In the Id column of a proposal nobody decided yet: it gets its id when it is accepted. */
const NO_ID_MARK: string = '—';
const ASCENDING_ARROW: string = '▲';
const DESCENDING_ARROW: string = '▼';

function statusText(status: RowStatus, t: Texts): string {
  if (status === 'pending') return t.statusPending;
  return status === 'retired' ? t.statusRetired : t.statusActive;
}

function statusFilterText(statusFilter: StatusFilter, t: Texts): string {
  return statusFilter === 'all' ? t.filterAllStatuses : statusText(statusFilter, t);
}

/** An empty box is no limit; anything that is not a whole number from 0 up is read as empty. */
function answerLimitOf(value: string): number | null {
  const limit = Number(value);
  return value.trim() !== '' && Number.isInteger(limit) && limit >= 0 ? limit : null;
}

type NameFilterProps = {
  label: string;
  names: readonly string[];
  value: string;
  onChange: (name: string) => void;
};

function NameFilter({ label, names, value, onChange }: NameFilterProps) {
  const t = useT(practiceDict);
  return (
    <label className={s.filterField}>
      <span className={ui.label}>{label}</span>
      <select className={s.select} value={value} onChange={(event) => onChange(event.target.value)}>
        <option value={ALL_NAMES_VALUE}>{t.filterAllNames}</option>
        {names.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </label>
  );
}

type FilterBarProps = {
  filters: ListFilters;
  /** Every row of the list, filtered or not: the name filters offer the names present in it. */
  rows: readonly ListRow[];
  onChange: (filters: ListFilters) => void;
};

function FilterBar({ filters, rows, onChange }: FilterBarProps) {
  const t = useT(practiceDict);

  function nameFilter(column: NameColumn, label: string) {
    return (
      <NameFilter
        label={label}
        names={namesIn(rows, column)}
        value={filters[column]}
        onChange={(name) => onChange({ ...filters, [column]: name })}
      />
    );
  }

  return (
    <div className={s.filters}>
      <label className={s.filterField}>
        <span className={ui.label}>{t.colStatus}</span>
        <select
          className={s.select}
          value={filters.status}
          onChange={(event) => onChange({ ...filters, status: event.target.value as StatusFilter })}
        >
          {STATUS_FILTERS.map((statusFilter) => (
            <option key={statusFilter} value={statusFilter}>
              {statusFilterText(statusFilter, t)}
            </option>
          ))}
        </select>
      </label>
      <label className={s.filterField}>
        <span className={ui.label}>{t.colTopic}</span>
        <select
          className={s.select}
          value={filters.topic}
          onChange={(event) => onChange({ ...filters, topic: event.target.value })}
        >
          <option value={ALL_TOPICS_VALUE}>{t.filterAllTopics}</option>
          <option value={NO_TOPIC_VALUE}>{t.noTopic}</option>
          <TopicOptions courses={LEARN_COURSES} />
        </select>
      </label>
      <fieldset className={s.rangeField}>
        <legend className={ui.label}>{t.filterIncorrect}</legend>
        <input
          className={s.limit}
          type="number"
          min={0}
          placeholder={t.filterMin}
          aria-label={`${t.filterIncorrect}: ${t.filterMin}`}
          value={filters.minIncorrect ?? ''}
          onChange={(event) => onChange({ ...filters, minIncorrect: answerLimitOf(event.target.value) })}
        />
        <input
          className={s.limit}
          type="number"
          min={0}
          placeholder={t.filterMax}
          aria-label={`${t.filterIncorrect}: ${t.filterMax}`}
          value={filters.maxIncorrect ?? ''}
          onChange={(event) => onChange({ ...filters, maxIncorrect: answerLimitOf(event.target.value) })}
        />
      </fieldset>
      {nameFilter('proposedBy', t.colProposedBy)}
      {nameFilter('acceptedBy', t.colAcceptedBy)}
      {hasFilters(filters) && (
        <button type="button" className={s.clear} onClick={() => onChange(NO_FILTERS)}>
          {t.clearFilters}
        </button>
      )}
    </div>
  );
}

type SortHeaderProps = {
  column: SortColumn;
  label: string;
  sort: ListSort;
  isNumeric?: boolean;
  onSort: (column: SortColumn) => void;
};

/** A column header that sorts by its column: a click turns the order around, and the arrow says
    which way it goes. */
function SortHeader({ column, label, sort, isNumeric = false, onSort }: SortHeaderProps) {
  const direction = sort !== null && sort.column === column ? sort.direction : null;
  const ariaSort = direction === null ? 'none' : direction === 'asc' ? 'ascending' : 'descending';

  return (
    <th className={isNumeric ? ui.num : undefined} aria-sort={ariaSort}>
      <button type="button" className={s.sortButton} onClick={() => onSort(column)}>
        {label}
        {direction !== null && (
          <span className={s.sortArrow} aria-hidden="true">
            {direction === 'asc' ? ASCENDING_ARROW : DESCENDING_ARROW}
          </span>
        )}
      </button>
    </th>
  );
}

function rowClassName(row: ListRow): string {
  return row.status === 'retired' ? `${s.row} ${s.rowRetired}` : s.row;
}

type QuestionListProps = {
  /** Both banks. */
  questions: readonly PracticeQuestion[];
  /** The proposals nobody has decided yet. */
  pendingProposals: readonly QuestionProposal[];
  /** The filters and the order live in the editor, so they are still there after the form. */
  view: ListView;
  onViewChange: (view: ListView) => void;
  onOpenQuestion: (question: PracticeQuestion) => void;
  onOpenProposal: (proposal: QuestionProposal) => void;
};

/** The editor's list: the pending proposals and the questions of both banks in one table, with
    its filters, its sortable headers and how many rows the filters leave. */
export default function QuestionList({
  questions,
  pendingProposals,
  view,
  onViewChange,
  onOpenQuestion,
  onOpenProposal,
}: QuestionListProps) {
  const t = useT(practiceDict);
  const locale = useLocale();
  const rows = toListRows(questions, pendingProposals, locale);
  const shownRows = sortedRows(filteredRows(rows, view.filters), view.sort);
  const countText = t.listCount.replace('{shown}', String(shownRows.length)).replace('{total}', String(rows.length));

  function openRow(row: ListRow) {
    if (row.source.kind === 'proposal') onOpenProposal(row.source.proposal);
    else onOpenQuestion(row.source.question);
  }

  function sortBy(column: SortColumn) {
    onViewChange({ ...view, sort: toggledSort(view.sort, column) });
  }

  function sortHeader(column: SortColumn, label: string, isNumeric: boolean = false) {
    return <SortHeader column={column} label={label} sort={view.sort} isNumeric={isNumeric} onSort={sortBy} />;
  }

  if (rows.length === 0) {
    return (
      <div className={s.card}>
        <p className={s.empty}>{t.noQuestions}</p>
      </div>
    );
  }

  return (
    <div className={s.wrap}>
      <FilterBar filters={view.filters} rows={rows} onChange={(filters) => onViewChange({ ...view, filters })} />
      <span className={s.count}>{countText}</span>
      <div className={s.card}>
        {shownRows.length === 0 ? (
          <p className={s.empty}>{t.listNoMatches}</p>
        ) : (
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  {sortHeader('id', t.colId)}
                  {sortHeader('prompt', t.colQuestion)}
                  {sortHeader('topic', t.colTopic)}
                  {sortHeader('answers', t.colAnswers, true)}
                  {sortHeader('status', t.colStatus)}
                  {sortHeader('proposedBy', t.colProposedBy)}
                  {sortHeader('acceptedBy', t.colAcceptedBy)}
                </tr>
              </thead>
              <tbody>
                {shownRows.map((row) => (
                  <tr key={row.key} className={rowClassName(row)} onClick={() => openRow(row)}>
                    <td className={s.id}>{row.questionId === '' ? NO_ID_MARK : row.questionId}</td>
                    <td>{row.prompt}</td>
                    <td>{row.topicTitle}</td>
                    <td className={ui.num} title={t.answersSummary}>
                      {row.correctCount} / {row.incorrectCount}
                    </td>
                    <td className={row.status === 'pending' ? s.statusPending : undefined}>
                      {statusText(row.status, t)}
                      {row.isExamOnly && ` · ${t.examOnlyTag}`}
                    </td>
                    <td>{row.proposedBy}</td>
                    <td>{row.acceptedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
