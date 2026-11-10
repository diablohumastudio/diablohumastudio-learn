import type { User } from 'firebase/auth';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LEARN_COURSES, TEACHER_PATH } from '../../data/learn';
import type { LearnCourse } from '../../data/learn';
import {
  DISTRACTOR_LEVELS,
  MIN_CORRECT_ANSWERS,
  MIN_INCORRECT_ANSWERS,
  authorshipOf,
  nextQuestionId,
} from '../../data/practice';
import type { DistractorLevel, PracticeAnswer, PracticeQuestion } from '../../data/practice';
import type { ImportedQuestion } from '../../data/practice/parse';
import {
  PROPOSAL_SOURCE_LOCALE,
  acceptedQuestion,
  proposalAsQuestion,
  proposerName,
} from '../../data/practice/proposal';
import type { ProposalContent, ProposalDecider, QuestionProposal } from '../../data/practice/proposal';
import { LOCALES } from '../../i18n/locales';
import { practiceDict } from '../../i18n/pages/practice';
import { useLocale, useT } from '../../i18n/useT';
import type { Dictionary } from '../../i18n/useT';
import { isFirebaseConfigured } from '../../lib/firebase';
import ImportReview from './ImportReview';
import s from './QuestionEditor.module.css';
import SignInRedirect from '../learn/SignInRedirect';
import { isPermissionDenied } from './progress';
import { acceptProposal, deciderOf, rejectProposal, usePendingProposals } from './proposals';
import QuestionList from './QuestionList';
import { INITIAL_LIST_VIEW } from './questionListFilters';
import type { ListView } from './questionListFilters';
import { parseImportList, saveQuestions, toExportJson, useExamOnlyBank, useQuestionBank } from './questions';
import TopicOptions from './TopicOptions';
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

type Validation<T> = { ok: true; value: T } | { ok: false; message: string };

/** A bank question as the form hands it over: the id is assigned, or kept, by whoever saves it. */
type QuestionContent = Omit<PracticeQuestion, 'id'>;

type DraftTexts = {
  prompt: Dictionary<string>;
  correct: PracticeAnswer[];
  incorrect: PracticeAnswer[];
  explanation: Dictionary<string>;
};

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
  return {
    ...trimmed(answer),
    ...(answer.id ? { id: answer.id } : {}),
    ...(answer.level ? { level: answer.level } : {}),
  };
}

function withLevel(answer: PracticeAnswer, value: string): PracticeAnswer {
  const unrated: PracticeAnswer = { ...answer };
  delete unrated.level;
  return value === '' ? unrated : { ...unrated, level: Number(value) as DistractorLevel };
}

/* The scale offers 1, 3 and 5; a 2 or 4 already in the bank stays selectable. */
function levelOptions(current: DistractorLevel | undefined): DistractorLevel[] {
  const options = [...DISTRACTOR_LEVELS];
  if (current !== undefined && !options.includes(current)) options.push(current);
  return options.sort((a, b) => a - b);
}

function levelText(level: DistractorLevel, t: Texts): string {
  if (level === 1) return t.level1;
  if (level === 3) return t.level3;
  if (level === 5) return t.level5;
  return String(level);
}

function isComplete(text: Dictionary<string>): boolean {
  return LOCALES.every((locale) => text[locale] !== '');
}

function isBlank(text: Dictionary<string>): boolean {
  return LOCALES.every((locale) => text[locale] === '');
}

/** The texts of a draft as they would be saved: trimmed, and without the answer rows left empty. */
function textsOfDraft(draft: Draft): DraftTexts {
  return {
    prompt: trimmed(draft.prompt),
    correct: draft.correct.map(trimmedAnswer).filter((text) => !isBlank(text)),
    incorrect: draft.incorrect.map(trimmedAnswer).filter((text) => !isBlank(text)),
    explanation: trimmed(draft.explanation),
  };
}

function hasSourceText(text: Dictionary<string>): boolean {
  return text[PROPOSAL_SOURCE_LOCALE] !== '';
}

/** A proposal asks for less than the bank: the source language only, and no levels. A teacher
    completes the rest before accepting it, under the bank's own validation. */
function validateProposalDraft(draft: Draft, t: Texts): Validation<ProposalContent> {
  const { prompt, correct, incorrect, explanation } = textsOfDraft(draft);

  if (!hasSourceText(prompt)) return { ok: false, message: t.validationProposalPrompt };
  if (![...correct, ...incorrect].every(hasSourceText)) return { ok: false, message: t.validationProposalAnswers };
  if (correct.length < MIN_CORRECT_ANSWERS) return { ok: false, message: t.validationCorrect };
  if (incorrect.length < MIN_INCORRECT_ANSWERS) return { ok: false, message: t.validationIncorrect };
  if (!isBlank(explanation) && !hasSourceText(explanation)) {
    return { ok: false, message: t.validationProposalExplanation };
  }

  return {
    ok: true,
    value: {
      ...(draft.topic ? { topic: draft.topic } : {}),
      prompt,
      correct,
      incorrect,
      ...(isBlank(explanation) ? {} : { explanation }),
    },
  };
}

function validateDraft(draft: Draft, t: Texts): Validation<QuestionContent> {
  const { prompt, correct, incorrect, explanation } = textsOfDraft(draft);

  if (!isComplete(prompt)) return { ok: false, message: t.validationPrompt };
  if (![...correct, ...incorrect].every(isComplete)) return { ok: false, message: t.validationAnswers };
  if (correct.length < MIN_CORRECT_ANSWERS) return { ok: false, message: t.validationCorrect };
  if (incorrect.length < MIN_INCORRECT_ANSWERS) return { ok: false, message: t.validationIncorrect };
  if (incorrect.some((answer) => answer.level === undefined)) return { ok: false, message: t.validationLevels };
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
  /** Wrong answers are rated against the correct one; correct answers have no level. */
  withLevels?: boolean;
  onChange: (items: PracticeAnswer[]) => void;
};

function AnswerList({ label, items, minimum, withLevels = false, onChange }: AnswerListProps) {
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
          {withLevels && (
            <select
              className={`${s.select} ${s.level}`}
              value={item.level ?? ''}
              aria-label={t.levelLabel}
              onChange={(event) => replaceAt(index, withLevel(item, event.target.value))}
            >
              <option value="">{t.levelUnset}</option>
              {levelOptions(item.level).map((level) => (
                <option key={level} value={level}>
                  {levelText(level, t)}
                </option>
              ))}
            </select>
          )}
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

/** What the form is for: it decides the validation, the fields shown and what its button does. */
export type QuestionFormMode =
  /** A teacher creating or editing a question of the bank; `bank` gives a new one its id. */
  | { kind: 'bank'; bank: readonly PracticeQuestion[]; onSaved: () => void }
  /** Editing a question of an import that is still under review: the button hands the result
      back instead of writing it to the bank. */
  | { kind: 'import'; onEdited: (value: QuestionContent) => void }
  /** A student proposing a question for a course: the relaxed validation, the topics of that
      course only, and neither slides nor the bank's own switches. */
  | { kind: 'proposal'; course: LearnCourse; onPropose: (content: ProposalContent) => Promise<void> }
  /** A teacher deciding on a student's proposal: the bank's own validation and two buttons.
      Accepting goes to the practice bank, never to the exam-only one: a student wrote it. */
  | {
      kind: 'review';
      proposerName: string;
      onAccept: (value: QuestionContent) => Promise<void>;
      onReject: (reason: string) => Promise<void>;
    };

type RejectPanelProps = {
  busy: boolean;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
};

/** Rejecting asks for a reason, which the student reads; left empty, it rejects without one. */
function RejectPanel({ busy, onConfirm, onCancel }: RejectPanelProps) {
  const t = useT(practiceDict);
  const [reason, setReason] = useState('');

  return (
    <div className={s.rejectPanel}>
      <label className={ui.field}>
        <span className={ui.label}>{t.rejectReasonLabel}</span>
        <input
          className={ui.input}
          type="text"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          // The panel sits inside the form: Enter here must not accept the proposal.
          onKeyDown={(event) => {
            if (event.key === 'Enter') event.preventDefault();
          }}
        />
      </label>
      <div className={s.actions}>
        <button type="button" className={s.secondary} onClick={onCancel} disabled={busy}>
          {t.cancelReject}
        </button>
        <button type="button" className={s.reject} onClick={() => onConfirm(reason.trim())} disabled={busy}>
          {busy ? t.saving : t.confirmRejectProposal}
        </button>
      </div>
    </div>
  );
}

type QuestionFormProps = {
  mode: QuestionFormMode;
  editing: PracticeQuestion | null;
  /** Leaves the form without saving. */
  onBack: () => void;
};

export function QuestionForm({ mode, editing, onBack }: QuestionFormProps) {
  const t = useT(practiceDict);
  const locale = useLocale();
  const [draft, setDraft] = useState<Draft>(() => (editing ? draftFromQuestion(editing) : emptyDraft()));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  // A question never changes bank: its id says which one it is in, and stats and exams point at the id.
  const [examOnly, setExamOnly] = useState(editing?.examOnly ?? false);
  const [isRejecting, setIsRejecting] = useState(false);
  const isProposal = mode.kind === 'proposal';
  const reviewMode = mode.kind === 'review' ? mode : null;
  // Exam only and Retired are decisions about a question of the bank, not about a proposal.
  const hasBankSwitches = mode.kind === 'bank' || mode.kind === 'import';
  // A proposal is not tagged with slides: the teacher tags the question when accepting it.
  const slideTopics = draft.topic && !isProposal ? [draft.topic] : [];
  const classSlides = useClassSlides(slideTopics)[draft.topic] ?? [];
  const topicCourses = mode.kind === 'proposal' ? [mode.course] : LEARN_COURSES;

  function toggleSlide(slideId: string) {
    const slides = draft.slides.includes(slideId)
      ? draft.slides.filter((candidate) => candidate !== slideId)
      : [...draft.slides, slideId];
    setDraft({ ...draft, slides });
  }

  /** Runs a write with the button busy. A refusal stays on the form as a message; when the
      write goes through, whoever opened the form closes it. */
  async function runWrite(write: () => Promise<void>, deniedMessage: string) {
    setSaving(true);
    setMessage(null);
    try {
      await write();
    } catch (error) {
      console.error('Could not save the question', error);
      setMessage(isPermissionDenied(error) ? deniedMessage : t.errorGeneric);
      setSaving(false);
    }
  }

  /* A save replaces the whole document, and the form does not show who proposed and who
     accepted the question it edits: they are carried over, or the edit would erase them. */
  function withKeptAuthorship(value: QuestionContent): QuestionContent {
    return editing ? { ...value, ...authorshipOf(editing) } : value;
  }

  function saveToBank(bank: readonly PracticeQuestion[], onSaved: () => void) {
    const validation = validateDraft(draft, t);
    if (validation.ok === false) {
      setMessage(validation.message);
      return;
    }
    const id = editing ? editing.id : nextQuestionId(bank, validation.value.topic, examOnly);
    void runWrite(async () => {
      await saveQuestions([{ id, ...withKeptAuthorship(validation.value), examOnly }]);
      onSaved();
    }, t.notAuthorized);
  }

  function applyToImport(onEdited: (value: QuestionContent) => void) {
    const validation = validateDraft(draft, t);
    if (validation.ok === false) {
      setMessage(validation.message);
      return;
    }
    onEdited(withKeptAuthorship(validation.value));
  }

  function acceptReviewed(onAccept: (value: QuestionContent) => Promise<void>) {
    const validation = validateDraft(draft, t);
    if (validation.ok === false) {
      setMessage(validation.message);
      return;
    }
    void runWrite(() => onAccept(validation.value), t.notAuthorized);
  }

  function rejectReviewed(onReject: (reason: string) => Promise<void>, reason: string) {
    void runWrite(() => onReject(reason), t.notAuthorized);
  }

  function sendProposal(onPropose: (content: ProposalContent) => Promise<void>) {
    const validation = validateProposalDraft(draft, t);
    if (validation.ok === false) {
      setMessage(validation.message);
      return;
    }
    void runWrite(() => onPropose(validation.value), t.proposalNotAllowed);
  }

  function submit() {
    // Enter in a field must not accept a proposal the teacher is about to reject.
    if (isRejecting) return;
    if (mode.kind === 'bank') saveToBank(mode.bank, mode.onSaved);
    else if (mode.kind === 'import') applyToImport(mode.onEdited);
    else if (mode.kind === 'proposal') sendProposal(mode.onPropose);
    else acceptReviewed(mode.onAccept);
  }

  function backText(): string {
    if (mode.kind === 'import') return t.backToImport;
    return mode.kind === 'proposal' ? t.backToProposals : t.backToQuestions;
  }

  function eyebrowText(): string {
    if (mode.kind === 'review') return t.proposalFrom.replace('{name}', mode.proposerName);
    if (editing && editing.id !== '') return editing.id;
    return mode.kind === 'proposal' ? mode.course.title : t.editorTitle;
  }

  function titleText(): string {
    if (mode.kind === 'review') return t.reviewProposal;
    if (mode.kind === 'proposal') return t.proposeQuestion;
    return editing ? t.editQuestion : t.newQuestion;
  }

  function hintText(): string | null {
    if (mode.kind === 'review') return t.reviewProposalHint;
    return mode.kind === 'proposal' ? t.proposalFormHint : null;
  }

  function submitText(): string {
    if (saving) return t.saving;
    if (mode.kind === 'import') return t.applyToImport;
    if (mode.kind === 'review') return t.acceptProposal;
    return mode.kind === 'proposal' ? t.sendProposal : t.save;
  }

  return (
    <div className={s.wrap}>
      <button type="button" className={s.back} onClick={onBack}>
        ← {backText()}
      </button>
      <div className={s.heading}>
        <span className={ui.eyebrow}>{eyebrowText()}</span>
        <h1 className={ui.title}>{titleText()}</h1>
        {hintText() && <p className={ui.lede}>{hintText()}</p>}
      </div>
      <form
        className={s.form}
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        {hasBankSwitches && (
          <label className={s.checkbox}>
            <input
              type="checkbox"
              checked={examOnly}
              disabled={editing !== null}
              onChange={(event) => setExamOnly(event.target.checked)}
            />
            <span>{t.examOnlyLabel}</span>
          </label>
        )}

        <label className={ui.field}>
          <span className={ui.label}>{t.topicLabel}</span>
          <select
            className={s.select}
            value={draft.topic}
            // Slide ids belong to a class: another topic starts without any.
            onChange={(event) => setDraft({ ...draft, topic: event.target.value, slides: [] })}
          >
            <option value="">{t.noTopic}</option>
            <TopicOptions courses={topicCourses} />
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
          withLevels
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

        {editing && hasBankSwitches && (
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

        {reviewMode && isRejecting ? (
          <RejectPanel
            busy={saving}
            onConfirm={(reason) => rejectReviewed(reviewMode.onReject, reason)}
            onCancel={() => setIsRejecting(false)}
          />
        ) : (
          <div className={s.actions}>
            {reviewMode && (
              <button type="button" className={s.reject} disabled={saving} onClick={() => setIsRejecting(true)}>
                {t.rejectProposal}
              </button>
            )}
            <button type="submit" className={s.save} disabled={saving}>
              {submitText()}
            </button>
          </div>
        )}
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
  | { kind: 'review'; proposal: QuestionProposal }
  | { kind: 'importReview'; batch: ImportBatch }
  | { kind: 'importEdit'; batch: ImportBatch; index: number };

/** The form edits bank questions, so an imported one borrows the shape: an empty id means "none yet". */
function importedAsQuestion(imported: ImportedQuestion, examOnly: boolean): PracticeQuestion {
  return { ...imported, id: imported.id ?? '', examOnly };
}

function withEditedQuestion(batch: ImportBatch, index: number, value: QuestionContent): ImportBatch {
  const questions = batch.questions.map((question, candidate) =>
    candidate === index ? { ...value, id: question.id } : question
  );
  return { ...batch, questions };
}

function Bank({ teacher }: { teacher: ProposalDecider }) {
  const t = useT(practiceDict);
  const bank = useQuestionBank();
  const examOnlyBank = useExamOnlyBank();
  const pendingProposals = usePendingProposals();
  const [screen, setScreen] = useState<Screen>({ kind: 'list' });
  // Kept here and not in the list, which leaves the screen while a form is open: coming back
  // from a question finds the same filters and the same order.
  const [listView, setListView] = useState<ListView>(INITIAL_LIST_VIEW);
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
  // The proposals arrive on their own: the bank is shown meanwhile, and their rows join it.
  const proposals = pendingProposals.status === 'ready' ? pendingProposals.proposals : [];

  async function acceptReviewedProposal(proposal: QuestionProposal, value: QuestionContent): Promise<void> {
    const questionId = nextQuestionId(questions, value.topic, false);
    await acceptProposal(proposal.id, acceptedQuestion(proposal, value, questionId, teacher, Date.now()), teacher);
    setNotice(t.proposalAcceptedNotice.replace('{id}', questionId));
    setScreen({ kind: 'list' });
  }

  async function rejectReviewedProposal(proposal: QuestionProposal, reason: string): Promise<void> {
    await rejectProposal(proposal.id, teacher, reason);
    setNotice(t.proposalRejectedNotice);
    setScreen({ kind: 'list' });
  }

  if (screen.kind === 'review') {
    const { proposal } = screen;
    return (
      <QuestionForm
        mode={{
          kind: 'review',
          proposerName: proposerName(proposal),
          onAccept: (value) => acceptReviewedProposal(proposal, value),
          onReject: (reason) => rejectReviewedProposal(proposal, reason),
        }}
        editing={proposalAsQuestion(proposal)}
        onBack={() => setScreen({ kind: 'list' })}
      />
    );
  }
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
        mode={{
          kind: 'import',
          onEdited: (value) => setScreen({ kind: 'importReview', batch: withEditedQuestion(batch, index, value) }),
        }}
        editing={importedAsQuestion(batch.questions[index], batch.examOnly)}
        onBack={() => setScreen({ kind: 'importReview', batch })}
      />
    );
  }
  if (screen.kind !== 'list') {
    return (
      <QuestionForm
        mode={{
          kind: 'bank',
          bank: questions,
          onSaved: () => {
            setNotice(t.savedNotice);
            setScreen({ kind: 'list' });
          },
        }}
        editing={screen.kind === 'edit' ? screen.question : null}
        onBack={() => setScreen({ kind: 'list' })}
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
      {pendingProposals.status === 'error' && <p className={ui.error}>{t.proposalsRulesMissing}</p>}
      {importing && (
        <ImportPanel onReview={(batch) => setScreen({ kind: 'importReview', batch })} />
      )}
      <QuestionList
        questions={questions}
        pendingProposals={proposals}
        view={listView}
        onViewChange={setListView}
        onOpenQuestion={(question) => setScreen({ kind: 'edit', question })}
        onOpenProposal={(proposal) => setScreen({ kind: 'review', proposal })}
      />
    </div>
  );
}

function TeacherGate({ user }: { user: User }) {
  const t = useT(practiceDict);
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    isTeacher(user.uid)
      .then(setAllowed)
      .catch((error) => {
        console.error('Could not check the teacher role', error);
        setAllowed(false);
      });
  }, [user.uid]);

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
  return <Bank teacher={deciderOf(user)} />;
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
  return <TeacherGate user={auth.user} />;
}
