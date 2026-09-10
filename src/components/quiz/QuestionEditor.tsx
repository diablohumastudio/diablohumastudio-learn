import { useEffect, useState } from 'react';
import { LEARN_COURSES } from '../../data/learn';
import { MIN_CORRECT_ANSWERS, MIN_INCORRECT_ANSWERS, nextQuestionId, questionTopicTitle } from '../../data/quiz';
import type { QuizQuestion } from '../../data/quiz';
import { LOCALES } from '../../i18n/locales';
import { quizDict } from '../../i18n/pages/quiz';
import { useLocale, useT } from '../../i18n/useT';
import type { Dictionary } from '../../i18n/useT';
import { isFirebaseConfigured } from '../../lib/firebase';
import s from './QuestionEditor.module.css';
import SignIn from './SignIn';
import { isPermissionDenied } from './progress';
import { isTeacher, parseQuestionList, saveQuestions, useQuestionBank } from './questions';
import ui from './ui.module.css';
import { useAuthUser } from './useAuthUser';

type Texts = Record<keyof typeof quizDict.en, string>;

type Draft = {
  topic: string;
  prompt: Dictionary<string>;
  correct: Dictionary<string>[];
  incorrect: Dictionary<string>[];
  explanation: Dictionary<string>;
  retired: boolean;
};

type Validation = { ok: true; value: Omit<QuizQuestion, 'id'> } | { ok: false; message: string };

function emptyText(): Dictionary<string> {
  return { en: '', es: '' };
}

function emptyDraft(): Draft {
  return {
    topic: '',
    prompt: emptyText(),
    correct: Array.from({ length: MIN_CORRECT_ANSWERS }, emptyText),
    incorrect: Array.from({ length: MIN_INCORRECT_ANSWERS }, emptyText),
    explanation: emptyText(),
    retired: false,
  };
}

function draftFromQuestion(question: QuizQuestion): Draft {
  return {
    topic: question.topic ?? '',
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

function isComplete(text: Dictionary<string>): boolean {
  return LOCALES.every((locale) => text[locale] !== '');
}

function isBlank(text: Dictionary<string>): boolean {
  return LOCALES.every((locale) => text[locale] === '');
}

function validateDraft(draft: Draft, t: Texts): Validation {
  const prompt = trimmed(draft.prompt);
  const correct = draft.correct.map(trimmed).filter((text) => !isBlank(text));
  const incorrect = draft.incorrect.map(trimmed).filter((text) => !isBlank(text));
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
      prompt,
      correct,
      incorrect,
      ...(isBlank(explanation) ? {} : { explanation }),
      retired: draft.retired,
    },
  };
}

type TextPairProps = {
  value: Dictionary<string>;
  onChange: (value: Dictionary<string>) => void;
  multiline?: boolean;
};

function TextPair({ value, onChange, multiline = false }: TextPairProps) {
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
  items: Dictionary<string>[];
  minimum: number;
  onChange: (items: Dictionary<string>[]) => void;
};

function AnswerList({ label, items, minimum, onChange }: AnswerListProps) {
  const t = useT(quizDict);

  function replaceAt(index: number, value: Dictionary<string>) {
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
  bank: QuizQuestion[];
  editing: QuizQuestion | null;
  onDone: () => void;
};

function QuestionForm({ bank, editing, onDone }: QuestionFormProps) {
  const t = useT(quizDict);
  const locale = useLocale();
  const [draft, setDraft] = useState<Draft>(() => (editing ? draftFromQuestion(editing) : emptyDraft()));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function save() {
    const validation = validateDraft(draft, t);
    if (validation.ok === false) {
      setMessage(validation.message);
      return;
    }
    const id = editing ? editing.id : nextQuestionId(bank, validation.value.topic);
    setSaving(true);
    setMessage(null);
    try {
      await saveQuestions([{ id, ...validation.value }]);
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
        ← {t.backToQuestions}
      </button>
      <div className={s.heading}>
        <span className={ui.eyebrow}>{editing ? editing.id : t.editorTitle}</span>
        <h1 className={ui.title}>{editing ? t.editQuestion : t.newQuestion}</h1>
      </div>
      <form
        className={s.form}
        onSubmit={(event) => {
          event.preventDefault();
          void save();
        }}
      >
        <label className={ui.field}>
          <span className={ui.label}>{t.classLabel}</span>
          <select
            className={s.select}
            value={draft.topic}
            onChange={(event) => setDraft({ ...draft, topic: event.target.value })}
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
            {saving ? t.saving : t.save}
          </button>
        </div>
      </form>
    </div>
  );
}

function ImportPanel({ onDone }: { onDone: (count: number) => void }) {
  const t = useT(quizDict);
  const [json, setJson] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function importQuestions() {
    let questions: QuizQuestion[];
    try {
      questions = parseQuestionList(json);
    } catch (error) {
      setMessage(`${t.invalidJson} ${error instanceof Error ? error.message : String(error)}`);
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      await saveQuestions(questions);
      setJson('');
      onDone(questions.length);
    } catch (error) {
      console.error('Could not import the questions', error);
      setMessage(isPermissionDenied(error) ? t.notAuthorized : t.errorGeneric);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={s.importPanel}>
      <p className={ui.lede}>{t.importHint}</p>
      <textarea
        className={s.textarea}
        rows={8}
        value={json}
        onChange={(event) => setJson(event.target.value)}
        spellCheck={false}
      />
      {message && <p className={ui.error}>{message}</p>}
      <div className={s.actions}>
        <button type="button" className={s.save} onClick={() => void importQuestions()} disabled={busy || !json.trim()}>
          {busy ? t.saving : t.importButton}
        </button>
      </div>
    </div>
  );
}

type Screen = { kind: 'list' } | { kind: 'new' } | { kind: 'edit'; question: QuizQuestion };

function Bank() {
  const t = useT(quizDict);
  const locale = useLocale();
  const bank = useQuestionBank();
  const [screen, setScreen] = useState<Screen>({ kind: 'list' });
  const [importing, setImporting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  if (bank.status === 'loading') {
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
  if (screen.kind !== 'list') {
    return (
      <QuestionForm
        bank={bank.questions}
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
        {notice && <span className={ui.notice}>{notice}</span>}
      </div>
      {importing && (
        <ImportPanel
          onDone={(count) => {
            setNotice(`${count} ${t.importDone}`);
            setImporting(false);
          }}
        />
      )}
      <div className={s.card}>
        {bank.questions.length === 0 ? (
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
                {bank.questions.map((question) => (
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
                    <td>{question.retired ? t.statusRetired : t.statusActive}</td>
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
  const t = useT(quizDict);
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
  const t = useT(quizDict);
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
    return <SignIn />;
  }
  return <TeacherGate uid={auth.user.uid} />;
}
