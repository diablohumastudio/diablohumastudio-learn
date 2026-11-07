import { useState } from 'react';
import type { ReactNode } from 'react';
import { DAILY_QUESTIONS_GOAL, RUN_CORRECT_GOAL, RUN_LENGTH, summarizePeriod } from '../../data/practice';
import type { PeriodSummary as PeriodNumbers, ProgressScope } from '../../data/practice';
import { practiceDict } from '../../i18n/pages/practice';
import { useLocale, useT } from '../../i18n/useT';
import ui from '../learn/ui.module.css';
import { dateText, percentText, scoreText } from './format';
import s from './PeriodSummary.module.css';
import type { StudentStats } from './progress';
import { movedOrder, orderedBy, readSummarySelection, saveSummarySelection } from './summarySelection';
import type { SummarySelection } from './summarySelection';
import { copyTable, downloadTable, fileSlug } from './tableExport';
import type { ExportFormat } from './tableExport';
import type { DaysByStudent } from './useStudentDays';

const STATUS_SHOWN_MS: number = 2500;
const UP: number = -1;
const DOWN: number = 1;
const PERIOD_COLUMNS: number = 6;
const LIFETIME_COLUMNS: number = 5;

type CopyStatus = 'idle' | 'copied' | 'failed';

type SummaryRow = {
  student: StudentStats;
  numbers: PeriodNumbers;
  isChecked: boolean;
};

type PeriodSummaryProps = {
  /** Alphabetical: the order the teacher has not changed by hand. */
  students: StudentStats[];
  daysByStudent: DaysByStudent | null;
  days: string[];
  scope: ProgressScope;
  /** Names the stored ticks and order; mount the summary with it as `key` so a change reloads them. */
  selectionKey: string;
  /** The exported file, without extension. */
  fileName: string;
  /** Makes each name a button that opens the student's detail. */
  onSelectStudent?: (student: StudentStats) => void;
  /** Shown in the heading row, after the eyebrow: the period selector of this section. */
  controls?: ReactNode;
};

function studentName(student: StudentStats): string {
  return student.displayName || student.email;
}

/** The hover text of a student cell: what the cell may have cut short. */
function studentTitle(student: StudentStats): string {
  return student.displayName ? `${student.displayName} · ${student.email}` : student.email;
}

/** One row per student: what the period adds up to and whether it is exported. */
export default function PeriodSummary({
  students,
  daysByStudent,
  days,
  scope,
  selectionKey,
  fileName,
  onSelectStudent,
  controls,
}: PeriodSummaryProps) {
  const t = useT(practiceDict);
  const locale = useLocale();
  const [selection, setSelection] = useState<SummarySelection>(() => readSummarySelection(selectionKey));
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');
  const rows: SummaryRow[] = orderedBy(students, selection.order).map((student) => {
    const numbers = summarizePeriod(daysByStudent?.[student.uid] ?? [], scope, days);
    return { student, numbers, isChecked: selection.checked[student.uid] ?? numbers.answered > 0 };
  });
  const checkedRows = rows.filter((row) => row.isChecked);
  const scoreHeader = scope.kind === 'daily' ? t.colDaysDone : t.colPoints;
  const rounds = scope.kind === 'homework' ? scope.homework.rounds : [];
  const hasRounds = rounds.length > 1;
  const canExport = daysByStudent !== null && days.length > 0 && checkedRows.length > 0;

  function update(next: SummarySelection): void {
    setSelection(next);
    saveSummarySelection(selectionKey, next);
  }

  function setChecked(uid: string, isChecked: boolean): void {
    update({ ...selection, checked: { ...selection.checked, [uid]: isChecked } });
  }

  function setAllChecked(isChecked: boolean): void {
    const checked = { ...selection.checked };
    rows.forEach((row) => {
      checked[row.student.uid] = isChecked;
    });
    update({ ...selection, checked });
  }

  function move(index: number, delta: number): void {
    update({ ...selection, order: movedOrder(rows.map((row) => row.student.uid), index, delta) });
  }

  /** Name and score of the ticked students, in the order shown. */
  function exportRows(): string[][] {
    return [
      [t.colStudent, scoreHeader],
      ...checkedRows.map((row) => [studentName(row.student), scoreText(row.numbers.score, locale)]),
    ];
  }

  function showCopyStatus(status: CopyStatus): void {
    setCopyStatus(status);
    window.setTimeout(() => setCopyStatus('idle'), STATUS_SHOWN_MS);
  }

  function copy(): void {
    copyTable(exportRows(), locale)
      .then(() => showCopyStatus('copied'))
      .catch(() => showCopyStatus('failed'));
  }

  function download(format: ExportFormat): void {
    downloadTable(fileSlug(fileName), exportRows(), format, locale);
  }

  const hint = (hasRounds ? t.summaryRoundsHint : t.summaryHint)
    .replace('{count}', String(scope.kind === 'homework' ? rounds[0].goal : DAILY_QUESTIONS_GOAL))
    .replace('{goal}', String(RUN_CORRECT_GOAL))
    .replace('{length}', String(RUN_LENGTH));

  return (
    <section className={s.wrap}>
      <hr className={s.divider} />
      <div className={s.header}>
        <span className={ui.eyebrow}>{t.periodSummary}</span>
        {controls}
      </div>
      <div className={s.actions}>
        <button type="button" className={s.button} disabled={!canExport} onClick={copy}>
          {t.copyTable}
        </button>
        <button type="button" className={s.button} disabled={!canExport} onClick={() => download('csv')}>
          {t.downloadCsv}
        </button>
        <button type="button" className={s.button} disabled={!canExport} onClick={() => download('tsv')}>
          {t.downloadTsv}
        </button>
        {copyStatus === 'copied' && <span className={s.status}>{t.copied}</span>}
        {copyStatus === 'failed' && <span className={s.statusFailed}>{t.copyFailed}</span>}
        <span className={s.selection}>
          <span className={ui.mono}>{t.exportSelection}:</span>
          <button type="button" className={s.linkButton} onClick={() => setAllChecked(true)}>
            {t.selectAllStudents}
          </button>
          <span className={ui.mono}>·</span>
          <button type="button" className={s.linkButton} onClick={() => setAllChecked(false)}>
            {t.selectNoStudents}
          </button>
        </span>
      </div>

      <div className={s.card}>
        {daysByStudent === null ? (
          <p className={s.empty}>{t.loading}</p>
        ) : days.length === 0 ? (
          <p className={s.empty}>{t.noDaysInRange}</p>
        ) : (
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th rowSpan={2} className={s.check} />
                  <th rowSpan={2} className={s.move} />
                  <th rowSpan={2} className={s.studentCell}>
                    {t.colStudent}
                  </th>
                  <th colSpan={PERIOD_COLUMNS} className={s.group}>
                    {t.groupPeriod}
                  </th>
                  <th colSpan={LIFETIME_COLUMNS} className={s.group}>
                    {t.groupLifetime}
                  </th>
                </tr>
                <tr>
                  <th className={ui.num}>{scoreHeader}</th>
                  <th className={ui.num}>{t.colFullDays}</th>
                  <th className={ui.num}>{t.colPartialDays}</th>
                  <th className={ui.num}>{t.colAnswered}</th>
                  <th className={ui.num}>{t.colCorrect}</th>
                  <th className={ui.num}>{t.colAccuracy}</th>
                  <th className={ui.num}>{t.colSessions}</th>
                  <th className={ui.num}>{t.colAnswered}</th>
                  <th className={ui.num}>{t.colCorrect}</th>
                  <th className={ui.num}>{t.colAccuracy}</th>
                  <th>{t.colLastPlayed}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.student.uid} className={row.isChecked ? undefined : s.rowUnchecked}>
                    <td className={s.check}>
                      <input
                        type="checkbox"
                        className={s.checkbox}
                        checked={row.isChecked}
                        onChange={(event) => setChecked(row.student.uid, event.target.checked)}
                      />
                    </td>
                    <td className={s.move}>
                      <button
                        type="button"
                        className={s.moveButton}
                        title={t.moveUp}
                        disabled={index === 0}
                        onClick={() => move(index, UP)}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className={s.moveButton}
                        title={t.moveDown}
                        disabled={index === rows.length - 1}
                        onClick={() => move(index, DOWN)}
                      >
                        ↓
                      </button>
                    </td>
                    <td className={s.studentCell} title={studentTitle(row.student)}>
                      <span className={s.student}>
                        {onSelectStudent ? (
                          <button type="button" className={s.nameButton} onClick={() => onSelectStudent(row.student)}>
                            {studentName(row.student)}
                          </button>
                        ) : (
                          <span className={s.name}>{studentName(row.student)}</span>
                        )}
                        {row.student.displayName && <span className={s.email}>{row.student.email}</span>}
                      </span>
                    </td>
                    <td className={`${ui.num} ${s.score}`}>
                      {scoreText(row.numbers.score, locale)} / {days.length}
                    </td>
                    <td className={ui.num}>{row.numbers.fullDays}</td>
                    <td className={ui.num}>{row.numbers.partialDays}</td>
                    <td className={ui.num}>{row.numbers.answered}</td>
                    <td className={ui.num}>{row.numbers.correct}</td>
                    <td className={ui.num}>{percentText(row.numbers.correct, row.numbers.answered)}</td>
                    <td className={ui.num}>{row.student.sessionsPlayed}</td>
                    <td className={ui.num}>{row.student.totalAnswered}</td>
                    <td className={ui.num}>{row.student.totalCorrect}</td>
                    <td className={ui.num}>{percentText(row.student.totalCorrect, row.student.totalAnswered)}</td>
                    <td className={s.date}>{dateText(row.student.lastPlayedAt, locale, t.never)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className={ui.mono}>{hint}</p>
    </section>
  );
}
