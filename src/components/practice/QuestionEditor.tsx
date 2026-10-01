import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LEARN_COURSES, TEACHER_PATH } from '../../data/learn';
import { MIN_CORRECT_ANSWERS, MIN_INCORRECT_ANSWERS, nextQuestionId, questionTopicTitle } from '../../data/practice';
import type { PracticeAnswer, PracticeQuestion } from '../../data/practice';
import type { ImportedQuestion } from '../../data/practice/parse';
import { LOCALES } from '../../i18n/locales';
import { practiceDict } from '../../i18n/pages/practice';
import { useLocale, useT } from '../../i18n/useT';
import type { Dictionary } from '../../i18n/useT';
import { isFirebaseConfigured } from '../../lib/firebase';
import ImportReview from './ImportReview';
import s from './QuestionEditor.module.css';
import SignInRedirect from '../learn/SignInRedirect';
import { isPermissionDenied } from './progress';
import { parseImportList, saveQuestions, toExportJson, useExamOnlyBank, useQuestionBank } from './questions';
import ui from '../learn/ui.module.css';
import { useAuthUser } from '../learn/useAuthUser';
import { useClassSlides } from '../learn/useClassSlides';
import { isTeacher } from '../learn/useTeacherStatus';

type Texts = Record<keyof typeof practiceDict.en, string>;

type Draft = {
  topic: string;
  slides: string[];
  prompt: Dictionary<string>;
  correct: PracticeAnswer[];
  incorrect: PracticeAnswer[];
  explanation: Dictionary<string>;
  retired: boolean;
};

type Validation = { ok: true; value: Omit<PracticeQuestion, 'id'> } | { ok: false; message: string };

function emptyText(): Dictionary<string> {
  return { en: '', es: '' };
}

function emptyDraft(): Draft {
  return {
    topic: '',
    slides: [],
    prompt: emptyText(),
    correct: Array.from({ length: MIN_CORRECT_ANSWERS }, emptyText),
    incorrect: Array.from({ length: MIN_INCORRECT_ANSWERS }, emptyText),
    explanation: emptyText(),
    retired: false,
  };
}

function draftFromQuestion(question: PracticeQuestion): Draft {
  return {
    topic: question.topic ?? '',
    slides: [...(question.slides ?? [])],
    prompt: { ...question.prompt },
    correct: question.correct.map((text) => ({ ...text })),
    incorrect: question.incorrect.map((text) => ({ ...text })),
    explanation: question.explanation ? { ...question.explanation } : emptyText(),
    retired: question.retired,
  };
}

function trimmed(text: Dictionary<string>): Dictionary<string> {
  return { en: text.en.trim(), es: text.es.trim() };
}

/* The id survives an edit of the text: exam attempts already saved point at it. */
function trimmedAnswer(answer: PracticeAnswer): PracticeAnswer {
  return answer.id ? { ...trimmed(answer), id: answer.id } : trimmed(answer);
}

function isComplete(text: Dictionary<string>): boolean {
  return LOCALES.every((locale) => text[locale] !== '');
}

function isBlank(text: Dictionary<string>): boolean {
  return LOCALES.every((locale) => text[locale] === '');
}

function validateDraft(draft: Draft, t: Texts): Validation {
  const prompt = trimmed(draft.prompt);
  const correct = draft.correct.map(trimmedAnswer).filter((text) => !isBlank(text));
  const incorrect = draft.incorrect.map(trimmedAnswer).filter((text) => !isBlank(text));
  const explanation = trimmed(draft.explanation);

  if (!isComplete(prompt)) return { ok: false, message: t.validationPrompt };
  if (![...correct, ...incorrect].every(isComplete)) return { ok: false, message: t.validationAnswers };
  if (correct.length < MIN_CORRECT_ANSWERS) return { ok: false, message: t.validationCorrect };
  if (incorrect.length < MIN_INCORRECT_ANSWERS) return { ok: false, message: t.validationIncorrect };
  if (!isBlank(explanation) && !isComplete(explanation)) return { ok: false, message: t.validationExplanation };

  return {
    ok: true,
    value: {
      ...(draft.topic ? { topic: draft.topic } : {}),
      ...(draft.topic && draft.slides.length > 0 ? { slides: draft.slides } : {}),
      prompt,
      correct,
      incorrect,
      ...(isBlank(explanation) ? {} : { explanation }),
      retired: draft.retired,
    },
  };
}

type TextPairProps<T extends Dictionary<string>> = {
  value: T;
  onChange: (value: T) => void;
  multiline?: boolean;
};

function TextPair<T extends Dictionary<string>>({ value, onChange, multiline = false }: TextPairProps<T>) {
  return (
    <div className={s.pair}>
      {LOCALES.map((locale) => (
        <label key={locale} className={s.langField}>
          <span className={s.langTag}>{locale}</span>
          {multiline ? (
            <textarea
              className={s.textarea}
              value={value[locale]}
              rows={2}
              onChange={(event) => onChange({ ...value, [locale]: event.target.value })}
            />
          ) : (
            <input
              className={ui.input}
              type="text"
              value={value[locale]}
              onChange={(event) => onChange({ ...value, [locale]: event.target.value })}
            />
          )}
        </label>
      ))}
    </div>
  );
}

type AnswerListProps = {
  label: string;
  items: PracticeAnswer[];
  minimum: number;
  onChange: (items: PracticeAnswer[]) => void;
};

function AnswerList({ label, items, minimum, onChange }: AnswerListProps) {
  const t = useT(practiceDict);

  function replaceAt(index: number, value: PracticeAnswer) {
    onChange(items.map((item, candidate) => (candidate === index ? value : item)));
  }

  function removeAt(index: number) {
    onChange(items.filter((_, candidate) => candidate !== index));
  }

  return (
    <fieldset className={s.group}>
      <legend className={ui.label}>{label}</legend>
      {items.map((item, index) => (
        <div key={index} className={s.answerRow}>
          <TextPair value={item} onChange={(value) => replaceAt(index, value)} />
          <button
            type="button"
            className={s.remove}
            onClick={() => removeAt(index)}
            disabled={items.length <= minimum}
            aria-label={t.removeAnswer}
          >
            ×
          </button>
        </div>
      ))}
      <button type="button" className={s.add} onClick={() => onChange([...items, emptyText()])}>
        + {t.addAnswer}
      </button>
    </fieldset>
  );
}

type QuestionFormProps = {
  bank: PracticeQuestion[];
  editing: PracticeQuestion | null;
  onDone: () => void;
  /** Editing a question of an import that is still under review: saving hands the result back
      instead of writing it to the bank. */
  onEditedImport?: (value: Omit<PracticeQuestion, 'id'>) => void;
};

function QuestionForm({ bank, editing, onDone, onEditedImport }: QuestionFormProps) {
  const t = useT(practiceDict);
  const locale = useLocale();
  const [draft, setDraft] = useState<Draft>(() => (editing ? draftFromQuestion(editing) : emptyDraft()));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  // A question never changes bank: its id says which one it is in, and stats and exams point at the id.
  const [examOnly, setExamOnly] = useState(editing?.examOnly ?? false);
  const classSlides = useClassSlides(draft.topic ? [draft.topic] : [])[draft.topic] ?? [];

  function toggleSlide(slideId: string) {
    const slides = draft.slides.includes(slideId)
      ? draft.slides.filter((candidate) => candidate !== slideId)
      : [...draft.slides, slideId];
    setDraft({ ...draft, slides });
  }

  async function save() {
    const validation = validateDraft(draft, t);
    if (validation.ok === false) {
      setMessage(validation.message);
      return;
    }
    if (onEditedImport) {
      onEditedImport(validation.value);
      return;
    }
    const id = editing ? editing.id : nextQuestionId(bank, validation.value.topic, examOnly);
    setSaving(true);
    setMessage(null);
    try {
      await saveQuestions([{ id, ...validation.value, examOnly }]);
      onDone();
    } catch (error) {
      console.error('Could not save the question', error);
      setMessage(isPermissionDenied(error) ? t.notAuthorized : t.errorGeneric);
      setSaving(false);
    }
  }

  return (
    <div className={s.wrap}>
      <button type="button" className={s.back} onClick={onDone}>
        ← {onEditedImport ? t.backToImport : t.backToQuestions}
      </button>
      <div className={s.heading}>
        <span className={ui.eyebrow}>{editing && editing.id !== '' ? editing.id : t.editorTitle}</span>
        <h1 className={ui.title}>{editing ? t.editQuestion : t.newQuestion}</h1>
      </div>
      <form
        className={s.form}
        onSubmit={(event) => {
          event.preventDefault();
          void save();
        }}
      >
        <label className={s.checkbox}>
          <input
            type="checkbox"
            checked={examOnly}
            disabled={editing !== null}
            onChange={(event) => setExamOnly(event.target.checked)}
          />
          <span>{t.examOnlyLabel}</span>
        </label>

        <label className={ui.field}>
          <span className={ui.label}>{t.classLabel}</span>
          <select
            className={s.select}
            value={draft.topic}
            // Slide ids belong to a class: another class starts without any.
            onChange={(event) => setDraft({ ...draft, topic: event.target.value, slides: [] })}
          >
            <option value="">{t.noClass}</option>
            {LEARN_COURSES.map((course) =>
              course.classes.map((learnClass) => (
                <option key={learnClass.slug} value={learnClass.slug}>
                  {course.title} · {learnClass.title[locale]}
                </option>
              ))
            )}
          </select>
        </label>

        {classSlides.length > 0 && (
          <fieldset className={s.slides}>
            <legend className={ui.label}>{t.slidesLabel}</legend>
            {classSlides.map((slide) => (
              <label key={slide.id} className={s.checkbox}>
                <input
                  type="checkbox"
                  checked={draft.slides.includes(slide.id)}
                  onChange={() => toggleSlide(slide.id)}
                />
                <span>{slide.title[locale]}</span>
              </label>
            ))}
          </fieldset>
        )}

        <div className={ui.field}>
          <span className={ui.label}>{t.promptLabel}</span>
          <TextPair value={draft.prompt} onChange={(prompt) => setDraft({ ...draft, prompt })} multiline />
        </div>

        <AnswerList
          label={t.correctLabel}
          items={draft.correct}
          minimum={MIN_CORRECT_ANSWERS}
          onChange={(correct) => setDraft({ ...draft, correct })}
        />
        <AnswerList
          label={t.incorrectLabel}
          items={draft.incorrect}
          minimum={MIN_INCORRECT_ANSWERS}
          onChange={(incorrect) => setDraft({ ...draft, incorrect })}
        />

        <div className={ui.field}>
          <span className={ui.label}>{t.explanationLabel}</span>
          <TextPair
            value={draft.explanation}
            onChange={(explanation) => setDraft({ ...draft, explanation })}
            multiline
          />
        </div>

        {editing && (
          <label className={s.checkbox}>
            <input
              type="checkbox"
              checked={draft.retired}
              onChange={(event) => setDraft({ ...draft, retired: event.target.checked })}
            />
            <span>{t.retiredLabel}</span>
          </label>
        )}

        {message && <p className={ui.error}>{message}</p>}

        <div className={s.actions}>
          <button type="submit" className={s.save} disabled={saving}>
            {saving ? t.saving : onEditedImport ? t.applyToImport : t.save}
          </button>
        </div>
      </form>
    </div>
  );
}

/** An import the teacher is still reviewing: nothing of it is in the bank yet. */
type ImportBatch = {
  questions: ImportedQuestion[];
  examOnly: boolean;
};

const JSON_FILE_TYPES: string = '.json,application/json';

function ImportPanel({ onReview }: { onReview: (batch: ImportBatch) => void }) {
  const t = useT(practiceDict);
  const [json, setJson] = useState('');
  const [examOnly, setExamOnly] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function review() {
    try {
      onReview({ questions: parseImportList(json), examOnly });
    } catch (error) {
      setMessage(`${t.invalidJson} ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // The browser reads the file by itself: it lands in the text box, where it can still be edited.
  async function loadFile(file: File | undefined) {
    if (!file) return;
    setMessage(null);
    setJson(await file.text());
  }

  return (
    <div className={s.importPanel}>
      <p className={ui.lede}>{t.importHint}</p>
      <label className={ui.field}>
        <span className={ui.label}>{t.importFile}</span>
        <input
          className={s.file}
          type="file"
          accept={JSON_FILE_TYPES}
          onChange={(event) => void loadFile(event.target.files?.[0])}
        />
      </label>
      <textarea
        className={s.textarea}
        rows={8}
        value={json}
        onChange={(event) => setJson(event.target.value)}
        spellCheck={false}
      />
      <label className={s.checkbox}>
        <input type="checkbox" checked={examOnly} onChange={(event) => setExamOnly(event.target.checked)} />
        <span>{t.examOnlyLabel}</span>
      </label>
      {message && <p className={ui.error}>{message}</p>}
      <div className={s.actions}>
        <button type="button" className={s.save} onClick={review} disabled={!json.trim()}>
          {t.importReviewButton}
        </button>
      </div>
    </div>
  );
}

const PRACTICE_EXPORT_FILE: string = 'practice-questions.json';
const EXAM_ONLY_EXPORT_FILE: string = 'exam-only-questions.json';
const JSON_MIME_TYPE: string = 'application/json';

/** The two banks are exported apart because Import JSON sends a whole file to one of them. */
function downloadQuestions(questions: readonly PracticeQuestion[], fileName: string) {
  const url = URL.createObjectURL(new Blob([toExportJson(questions)], { type: JSON_MIME_TYPE }));
  const download = document.createElement('a');
  download.href = url;
  download.download = fileName;
  download.click();
  URL.revokeObjectURL(url);
}

type Screen =
  | { kind: 'list' }
  | { kind: 'new' }
  | { kind: 'edit'; question: PracticeQuestion }
  | { kind: 'importReview'; batch: ImportBatch }
  | { kind: 'importEdit'; batch: ImportBatch; index: number };

/** The form edits bank questions, so an imported one borrows the shape: an empty id means "none yet". */
function importedAsQuestion(imported: ImportedQuestion, examOnly: boolean): PracticeQuestion {
  return { ...imported, id: imported.id ?? '', examOnly };
}

function withEditedQuestion(batch: ImportBatch, index: number, value: Omit<PracticeQuestion, 'id'>): ImportBatch {
  const questions = batch.questions.map((question, candidate) =>
    candidate === index ? { ...value, id: question.id } : question
  );
  return { ...batch, questions };
}

function Bank() {
  const t = useT(practiceDict);
  const locale = useLocale();
  const bank = useQuestionBank();
  const examOnlyBank = useExamOnlyBank();
  const [screen, setScreen] = useState<Screen>({ kind: 'list' });
  const [importing, setImporting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  if (bank.status === 'loading' || examOnlyBank.status === 'loading') {
    return (
      <div className={ui.centered}>
        <span className={ui.mono}>{t.loading}</span>
      </div>
    );
  }
  if (bank.status === 'error') {
    console.error('Could not load the questions', bank.error);
    return (
      <div className={ui.centered}>
        <p className={ui.error}>{t.bankLoadError}</p>
      </div>
    );
  }
  // The exam-only bank is refused until the rules that name it are published (docs/practice.md):
  // the practice bank must stay editable meanwhile.
  const isExamOnlyBankMissing = examOnlyBank.status === 'error';
  const questions = [...bank.questions, ...(examOnlyBank.status === 'ready' ? examOnlyBank.questions : [])];
  if (screen.kind === 'importReview') {
    const { batch } = screen;
    return (
      <ImportReview
        imported={batch.questions}
        bank={questions}
        examOnly={batch.examOnly}
        onEdit={(index) => setScreen({ kind: 'importEdit', batch, index })}
        onCancel={() => setScreen({ kind: 'list' })}
        onDone={(count) => {
          setNotice(`${count} ${t.importDone}`);
          setImporting(false);
          setScreen({ kind: 'list' });
        }}
      />
    );
  }
  if (screen.kind === 'importEdit') {
    const { batch, index } = screen;
    return (
      <QuestionForm
        bank={questions}
        editing={importedAsQuestion(batch.questions[index], batch.examOnly)}
        onDone={() => setScreen({ kind: 'importReview', batch })}
        onEditedImport={(value) =>
          setScreen({ kind: 'importReview', batch: withEditedQuestion(batch, index, value) })
        }
      />
    );
  }
  if (screen.kind !== 'list') {
    return (
      <QuestionForm
        bank={questions}
        editing={screen.kind === 'edit' ? screen.question : null}
        onDone={() => {
          setNotice(t.savedNotice);
          setScreen({ kind: 'list' });
        }}
      />
    );
  }

  return (
    <div className={s.wrap}>
      <Link href={TEACHER_PATH} className={ui.backLink}>
        ← {t.backToTeacher}
      </Link>
      <div className={s.heading}>
        <span className={ui.eyebrow}>{t.brand}</span>
        <h1 className={ui.title}>{t.editorTitle}</h1>
      </div>
      <div className={s.toolbar}>
        <button type="button" className={s.primary} onClick={() => setScreen({ kind: 'new' })}>
          + {t.newQuestion}
        </button>
        <button type="button" className={s.secondary} onClick={() => setImporting(!importing)}>
          {t.importJson}
        </button>
        <button
          type="button"
          className={s.secondary}
          disabled={bank.questions.length === 0}
          onClick={() => downloadQuestions(bank.questions, PRACTICE_EXPORT_FILE)}
        >
          {t.exportJson}
        </button>
        {examOnlyBank.status === 'ready' && examOnlyBank.questions.length > 0 && (
          <button
            type="button"
            className={s.secondary}
            onClick={() => downloadQuestions(examOnlyBank.questions, EXAM_ONLY_EXPORT_FILE)}
          >
            {t.exportExamOnlyJson}
          </button>
        )}
        {notice && <span className={ui.notice}>{notice}</span>}
      </div>
      {isExamOnlyBankMissing && <p className={ui.error}>{t.examOnlyBankMissing}</p>}
      {importing && (
        <ImportPanel onReview={(batch) => setScreen({ kind: 'importReview', batch })} />
      )}
      <div className={s.card}>
        {questions.length === 0 ? (
          <p className={s.empty}>{t.noQuestions}</p>
        ) : (
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>{t.colId}</th>
                  <th>{t.colQuestion}</th>
                  <th>{t.colTopic}</th>
                  <th className={ui.num}>{t.colAnswers}</th>
                  <th>{t.colStatus}</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((question) => (
                  <tr
                    key={question.id}
                    className={question.retired ? `${s.row} ${s.rowRetired}` : s.row}
                    onClick={() => setScreen({ kind: 'edit', question })}
                  >
                    <td className={s.id}>{question.id}</td>
                    <td>{question.prompt[locale]}</td>
                    <td>{questionTopicTitle(question, locale) ?? ''}</td>
                    <td className={ui.num} title={t.answersSummary}>
                      {question.correct.length} / {question.incorrect.length}
                    </td>
                    <td>
                      {question.retired ? t.statusRetired : t.statusActive}
                      {question.examOnly && ` · ${t.examOnlyTag}`}
                    </td>
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

function TeacherGate({ uid }: { uid: string }) {
  const t = useT(practiceDict);
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    isTeacher(uid)
      .then(setAllowed)
      .catch((error) => {
        console.error('Could not check the teacher role', error);
        setAllowed(false);
      });
  }, [uid]);

  if (allowed === null) {
    return (
      <div className={ui.centered}>
        <span className={ui.mono}>{t.loading}</span>
      </div>
    );
  }
  if (!allowed) {
    return (
      <div className={ui.centered}>
        <p className={ui.error}>{t.notAuthorized}</p>
      </div>
    );
  }
  return <Bank />;
}

export default function QuestionEditor() {
  const t = useT(practiceDict);
  const auth = useAuthUser();

  if (!isFirebaseConfigured()) {
    return (
      <div className={ui.centered}>
        <p className={ui.error}>{t.notConfigured}</p>
      </div>
    );
  }
  if (auth.status === 'loading') {
    return (
      <div className={ui.centered}>
        <span className={ui.mono}>{t.loading}</span>
      </div>
    );
  }
  if (auth.status === 'signedOut') {
    return <SignInRedirect />;
  }
  return <TeacherGate uid={auth.user.uid} />;
}
