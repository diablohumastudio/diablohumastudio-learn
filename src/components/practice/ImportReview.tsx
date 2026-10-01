import { useState } from 'react';
import { questionTopicTitle } from '../../data/practice';
import type { PracticeQuestion } from '../../data/practice';
import { countByStatus, questionsToWrite, reviewImport } from '../../data/practice/importReview';
import type { ImportEntry, ImportStatus, QuestionField } from '../../data/practice/importReview';
import type { ImportedQuestion } from '../../data/practice/parse';
import { practiceDict } from '../../i18n/pages/practice';
import { useLocale, useT } from '../../i18n/useT';
import ConfirmPanel from '../exam/ConfirmPanel';
import ui from '../learn/ui.module.css';
import s from './ImportReview.module.css';
import { isPermissionDenied } from './progress';
import { saveQuestions } from './questions';

const WARNING_SIGN: string = '⚠';

type PracticeTexts = Record<keyof typeof practiceDict.en, string>;

type ImportReviewProps = {
  imported: ImportedQuestion[];
  /** Both banks: what the import is compared with. */
  bank: PracticeQuestion[];
  examOnly: boolean;
  onEdit: (index: number) => void;
  onCancel: () => void;
  onDone: (writtenCount: number) => void;
};

const STATUS_CLASS_NAMES: Record<ImportStatus, string> = {
  new: s.entryNew,
  changed: s.entryChanged,
  noId: s.entryNoId,
  identical: s.entryIdentical,
};

function fieldText(field: QuestionField, t: PracticeTexts): string {
  const texts: Record<QuestionField, string> = {
    topic: t.importFieldTopic,
    slides: t.importFieldSlides,
    prompt: t.importFieldPrompt,
    correct: t.importFieldCorrect,
    incorrect: t.importFieldIncorrect,
    explanation: t.importFieldExplanation,
    retired: t.importFieldRetired,
  };
  return texts[field];
}

/** Only a new question goes without the warning sign. */
function statusText(entry: ImportEntry, t: PracticeTexts): string {
  if (entry.status === 'new') return t.importStatusNew;
  if (entry.status === 'identical') return `${WARNING_SIGN} ${t.importStatusIdentical}`;
  if (entry.status === 'noId') return `${WARNING_SIGN} ${t.importStatusNoId.replace('{id}', entry.id)}`;
  const fields = entry.changedFields.map((field) => fieldText(field, t)).join(', ');
  return `${WARNING_SIGN} ${t.importStatusChanged.replace('{fields}', fields)}`;
}

function withCounts(text: string, counts: Record<ImportStatus, number>): string {
  return text
    .replace('{new}', String(counts.new))
    .replace('{changed}', String(counts.changed))
    .replace('{noId}', String(counts.noId))
    .replace('{identical}', String(counts.identical));
}

/** Every question of an import with what it would do to the bank; nothing is written until confirmed. */
export default function ImportReview({ imported, bank, examOnly, onEdit, onCancel, onDone }: ImportReviewProps) {
  const t = useT(practiceDict);
  const locale = useLocale();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const entries = reviewImport(imported, bank, examOnly);
  const counts = countByStatus(entries);
  const questions = questionsToWrite(entries, examOnly);
  const hasWarnings = counts.changed + counts.noId + counts.identical > 0;

  async function write() {
    setBusy(true);
    setMessage(null);
    try {
      await saveQuestions(questions);
      onDone(questions.length);
    } catch (error) {
      console.error('Could not import the questions', error);
      setMessage(isPermissionDenied(error) ? t.notAuthorized : t.errorGeneric);
      setBusy(false);
      setConfirming(false);
    }
  }

  return (
    <div className={s.wrap}>
      <button type="button" className={s.back} onClick={onCancel} disabled={busy}>
        ← {t.importCancel}
      </button>
      <div className={s.heading}>
        <span className={ui.eyebrow}>
          {t.editorTitle}
          {examOnly && ` · ${t.examOnlyTag}`}
        </span>
        <h1 className={ui.title}>{t.importReviewTitle}</h1>
        <span className={ui.mono}>{withCounts(t.importSummary, counts)}</span>
      </div>

      <ol className={s.entries}>
        {entries.map((entry, index) => (
          <li key={index} className={STATUS_CLASS_NAMES[entry.status]}>
            <span className={s.status}>{statusText(entry, t)}</span>
            <div className={s.question}>
              <span className={s.id}>{entry.id}</span>
              <span className={s.prompt}>
                {entry.question.prompt[locale]}
                <span className={ui.mono}>
                  {' '}
                  · {questionTopicTitle({ ...entry.question, id: entry.id }, locale) ?? t.noClass} ·{' '}
                  {entry.question.correct.length} / {entry.question.incorrect.length}
                </span>
              </span>
              <button type="button" className={s.edit} onClick={() => onEdit(index)} disabled={busy}>
                {t.importEdit}
              </button>
            </div>
          </li>
        ))}
      </ol>

      {message && <p className={ui.error}>{message}</p>}
      {questions.length === 0 && <p className={ui.notice}>{t.importNothingToWrite}</p>}

      {confirming ? (
        <ConfirmPanel
          message={t.importConfirmWarning}
          detail={withCounts(t.importConfirmDetail, counts)}
          confirmLabel={busy ? t.saving : `${t.importButton} (${questions.length})`}
          busy={busy}
          onConfirm={() => void write()}
          onCancel={() => setConfirming(false)}
        />
      ) : (
        <div className={s.actions}>
          <button
            type="button"
            className={s.primary}
            disabled={busy || questions.length === 0}
            // Only an import of nothing but new questions goes through without the warning.
            onClick={() => (hasWarnings ? setConfirming(true) : void write())}
          >
            {busy ? t.saving : `${t.importButton} (${questions.length})`}
          </button>
        </div>
      )}
    </div>
  );
}
