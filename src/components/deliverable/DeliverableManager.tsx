import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { assignedAccounts } from '../../data/course/assignment';
import { memberName } from '../../data/course/types';
import type { CourseMember } from '../../data/course/types';
import {
  DEFAULT_DURATION_MINUTES,
  DEFAULT_MAX_SCORE,
  DEFAULT_QUESTION_POINTS,
  DELIVERABLE_KINDS,
  isDeliverableRole,
  isDeliverableRunning,
  isHttpUrl,
  isSavedLate,
  lateBySeconds,
  newQuestionId,
  questionsTotal,
  scoresTotal,
} from '../../data/deliverable/types';
import type {
  Deliverable,
  DeliverableKind,
  DeliverableQuestion,
  DeliverableRole,
  DeliverableSettings,
  QuestionComments,
  QuestionScores,
  Review,
  Submission,
} from '../../data/deliverable/types';
import {
  DELIVERABLE_ROLE_PARAM,
  LEARN_COURSES,
  NEW_ITEM_SEGMENT,
  TEACHER_EXAM_PATH,
  TEACHER_HOMEWORKS_PATH,
  deliverablePath,
  findCourse,
  teacherDeliverablePath,
  teacherSubmissionPath,
} from '../../data/learn';
import { deliverableDict } from '../../i18n/pages/deliverable';
import { useLocale, useT } from '../../i18n/useT';
import { isFirebaseConfigured } from '../../lib/firebase';
import StudentPicker from '../course/StudentPicker';
import { useCourseMembers } from '../course/useCourseMembers';
import ConfirmPanel from '../exam/ConfirmPanel';
import { dateTimeText, dateTimeYearText, dayMonthText, durationText } from '../exam/format';
import SignInRedirect from '../learn/SignInRedirect';
import ui from '../learn/ui.module.css';
import { useAuthUser } from '../learn/useAuthUser';
import { useTeacherStatus } from '../learn/useTeacherStatus';
import s from './DeliverableManager.module.css';
import {
  closeDeliverableNow,
  createDeliverable,
  deleteDeliverable,
  isPermissionDenied,
  openDeliverable,
  saveReview,
  setDeliverableClose,
  subscribeAllDeliverables,
  subscribeReviews,
  subscribeSubmissions,
  updateDeliverable,
} from './deliverables';
import { fromDateTimeLocal, kindText, roleText, toDateTimeLocal } from './format';
import type { DeliverableTexts } from './format';
import TypingSignalsView, { hasSuspiciousSignals } from './TypingSignalsView';
import { useNowMs } from './useNowMs';

const MS_PER_MINUTE: number = 60_000;
const STATUS_TICK_MS: number = 1000;
const SCORE_STEP: number = 0.5;

type QuestionDraft = {
  id: string;
  text: string;
  maxChars: string;
  points: string;
};

/** The form's values: numbers stay text until they are validated. */
type Draft = {
  title: string;
  courseSlug: string;
  role: DeliverableRole;
  kind: DeliverableKind;
  guideUrl: string;
  instructions: string;
  questions: QuestionDraft[];
  maxScore: string;
  durationMinutes: string;
  /** `datetime-local` value; empty until the teacher picks one. */
  deadline: string;
  /** For everybody enrolled in the course; otherwise `assignedUids` says who. */
  everyone: boolean;
  assignedUids: string[];
};

type DraftValidation = { ok: true; settings: DeliverableSettings } | { ok: false; message: string };

type Screen = { kind: 'new'; role: DeliverableRole } | { kind: 'deliverable'; deliverableId: string };

function newQuestionDraft(): QuestionDraft {
  return { id: newQuestionId(), text: '', maxChars: '', points: String(DEFAULT_QUESTION_POINTS) };
}

function draftOf(deliverable: Deliverable | null, role: DeliverableRole): Draft {
  if (!deliverable) {
    return {
      title: '',
      courseSlug: LEARN_COURSES[0].slug,
      role,
      kind: 'text',
      guideUrl: '',
      instructions: '',
      questions: [newQuestionDraft()],
      maxScore: String(DEFAULT_MAX_SCORE),
      durationMinutes: String(DEFAULT_DURATION_MINUTES),
      deadline: '',
      everyone: true,
      assignedUids: [],
    };
  }
  return {
    title: deliverable.title,
    courseSlug: deliverable.courseSlug,
    role: deliverable.role,
    kind: deliverable.kind,
    guideUrl: deliverable.guideUrl,
    instructions: deliverable.instructions,
    questions:
      deliverable.questions.length > 0
        ? deliverable.questions.map((question) => ({
            id: question.id,
            text: question.text,
            maxChars: question.maxChars === null ? '' : String(question.maxChars),
            points: String(question.points),
          }))
        : [newQuestionDraft()],
    maxScore: String(deliverable.maxScore),
    durationMinutes: String(deliverable.durationMinutes),
    deadline: deliverable.deadlineMs === null ? '' : toDateTimeLocal(deliverable.deadlineMs),
    everyone: deliverable.assignedUids.length === 0,
    assignedUids: deliverable.assignedUids,
  };
}

function isPositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

function isPositiveNumber(value: string): boolean {
  return value.trim() !== '' && Number(value) > 0;
}

/** The points of the draft's questions, as the form shows them while they are typed. */
function draftTotal(draft: Draft): number {
  return questionsTotal(
    draft.questions.map((question) => ({ id: question.id, text: question.text, maxChars: null, points: Number(question.points) || 0 }))
  );
}

function validateQuestions(draft: Draft, t: DeliverableTexts): DraftValidation | DeliverableSettings['questions'] {
  if (draft.kind !== 'text') return [];
  if (draft.questions.length === 0) return { ok: false, message: t.validationQuestions };
  if (draft.questions.some((question) => question.text.trim() === '')) {
    return { ok: false, message: t.validationQuestionText };
  }
  if (draft.questions.some((question) => question.maxChars !== '' && !isPositiveInteger(Number(question.maxChars)))) {
    return { ok: false, message: t.validationMaxChars };
  }
  if (draft.questions.some((question) => !isPositiveNumber(question.points))) {
    return { ok: false, message: t.validationPoints };
  }
  return draft.questions.map((question) => ({
    id: question.id,
    text: question.text.trim(),
    maxChars: question.maxChars === '' ? null : Number(question.maxChars),
    points: Number(question.points),
  }));
}

/** `forOpen` also demands what opening needs: a close in the future for a homework. */
function validateDraft(draft: Draft, forOpen: boolean, t: DeliverableTexts): DraftValidation {
  const title = draft.title.trim();
  const guideUrl = draft.guideUrl.trim();
  const durationMinutes = Number(draft.durationMinutes);
  const deadlineMs = fromDateTimeLocal(draft.deadline);
  if (title === '') return { ok: false, message: t.validationTitle };
  if (!findCourse(draft.courseSlug)) return { ok: false, message: t.validationCourse };
  if (guideUrl !== '' && !isHttpUrl(guideUrl)) return { ok: false, message: t.validationGuideUrl };
  const questions = validateQuestions(draft, t);
  if (!Array.isArray(questions)) return questions;
  if (!draft.everyone && draft.assignedUids.length === 0) return { ok: false, message: t.validationStudents };
  // A text deliverable is worth what its questions add up to; a link has nothing to add.
  const maxScore = draft.kind === 'text' ? questionsTotal(questions) : Number(draft.maxScore);
  if (!(maxScore > 0)) return { ok: false, message: t.validationMaxScore };
  if (draft.role === 'exam' && !isPositiveInteger(durationMinutes)) return { ok: false, message: t.validationDuration };
  if (draft.role === 'homework' && forOpen && (deadlineMs === null || deadlineMs <= Date.now())) {
    return { ok: false, message: t.validationDeadline };
  }
  return {
    ok: true,
    settings: {
      title,
      courseSlug: draft.courseSlug,
      role: draft.role,
      kind: draft.kind,
      guideUrl,
      instructions: draft.instructions.trim(),
      questions,
      maxScore,
      durationMinutes: isPositiveInteger(durationMinutes) ? durationMinutes : DEFAULT_DURATION_MINUTES,
      deadlineMs,
      assignedUids: draft.everyone ? [] : draft.assignedUids,
    },
  };
}

/** Where Open will put the close: minutes from now for an exam, the chosen moment for a homework. */
function closesAtOf(settings: DeliverableSettings): number {
  if (settings.role === 'exam') return Date.now() + settings.durationMinutes * MS_PER_MINUTE;
  return settings.deadlineMs ?? Date.now();
}

/** The list a deliverable belongs to, by role. */
function listPathOf(role: DeliverableRole): string {
  return role === 'exam' ? TEACHER_EXAM_PATH : TEACHER_HOMEWORKS_PATH;
}

type QuestionEditorProps = {
  number: number;
  question: QuestionDraft;
  isOnlyQuestion: boolean;
  onChange: (question: QuestionDraft) => void;
  onRemove: () => void;
};

function QuestionEditor({ number, question, isOnlyQuestion, onChange, onRemove }: QuestionEditorProps) {
  const t = useT(deliverableDict);
  return (
    <div className={s.question}>
      <div className={s.questionHead}>
        <span className={s.questionName}>{t.questionNumber.replace('{number}', String(number))}</span>
        <button type="button" className={s.remove} onClick={onRemove} disabled={isOnlyQuestion} aria-label={t.removeQuestion}>
          ×
        </button>
      </div>
      <label className={ui.field}>
        <span className={ui.label}>{t.questionTextLabel}</span>
        <textarea
          className={s.textarea}
          value={question.text}
          onChange={(event) => onChange({ ...question, text: event.target.value })}
        />
      </label>
      <div className={s.numbers}>
        <label className={s.pointsField}>
          <span className={ui.label}>{t.pointsLabel}</span>
          <input
            className={ui.input}
            type="number"
            min={SCORE_STEP}
            step={SCORE_STEP}
            value={question.points}
            onChange={(event) => onChange({ ...question, points: event.target.value })}
          />
        </label>
        <label className={s.maxCharsField}>
          <span className={ui.label}>{t.maxCharsLabel}</span>
          <input
            className={ui.input}
            type="number"
            min={1}
            value={question.maxChars}
            onChange={(event) => onChange({ ...question, maxChars: event.target.value })}
          />
        </label>
      </div>
    </div>
  );
}

type DraftFormProps = {
  deliverable: Deliverable | null;
  /** The list the deliverable belongs to: the one its New button was pressed in. It is not a
      field of the form, so a homework never turns into an exam. */
  role: DeliverableRole;
  onDeleted: () => void;
  onCreated: (deliverableId: string) => void;
};

function DraftForm({ deliverable, role, onDeleted, onCreated }: DraftFormProps) {
  const t = useT(deliverableDict);
  const [draft, setDraft] = useState<Draft>(() => draftOf(deliverable, role));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<'open' | 'delete' | null>(null);

  /** `after` leaves this screen with the action's result; without it the screen stays and says saved. */
  async function run<T>(action: () => Promise<T>, after: ((result: T) => void) | null) {
    setBusy(true);
    setMessage(null);
    setNotice(null);
    try {
      const result = await action();
      if (after) after(result);
      else setNotice(t.savedNotice);
    } catch (error) {
      console.error('Deliverable action failed', error);
      setMessage(isPermissionDenied(error) ? t.permissionDenied : t.errorGeneric);
    } finally {
      setBusy(false);
      setConfirming(null);
    }
  }

  function save() {
    const validation = validateDraft(draft, false, t);
    if (validation.ok === false) {
      setMessage(validation.message);
      return;
    }
    if (deliverable) void run(() => updateDeliverable(deliverable.id, validation.settings), null);
    else void run(() => createDeliverable(validation.settings), onCreated);
  }

  /* Saves first, so the deliverable that opens is the one on screen. It stays on this screen:
     the subscription turns it into the opened view. */
  function open(draftDeliverable: Deliverable) {
    const validation = validateDraft(draft, true, t);
    if (validation.ok === false) {
      setMessage(validation.message);
      setConfirming(null);
      return;
    }
    void run(async () => {
      await updateDeliverable(draftDeliverable.id, validation.settings);
      await openDeliverable(draftDeliverable.id, closesAtOf(validation.settings));
    }, null);
  }

  function replaceQuestion(changed: QuestionDraft) {
    setDraft({ ...draft, questions: draft.questions.map((question) => (question.id === changed.id ? changed : question)) });
  }

  return (
    <form
      className={s.form}
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
    >
      <label className={ui.field}>
        <span className={ui.label}>{t.titleLabel}</span>
        <input
          className={ui.input}
          type="text"
          value={draft.title}
          onChange={(event) => setDraft({ ...draft, title: event.target.value })}
        />
      </label>

      <div className={s.numbers}>
        <label className={ui.field}>
          <span className={ui.label}>{t.courseLabel}</span>
          <select
            className={s.select}
            value={draft.courseSlug}
            onChange={(event) => setDraft({ ...draft, courseSlug: event.target.value, everyone: true, assignedUids: [] })}
          >
            {LEARN_COURSES.map((course) => (
              <option key={course.slug} value={course.slug}>
                {course.title}
              </option>
            ))}
          </select>
        </label>
        <label className={ui.field}>
          <span className={ui.label}>{t.kindLabel}</span>
          <select
            className={s.select}
            value={draft.kind}
            onChange={(event) => setDraft({ ...draft, kind: event.target.value as DeliverableKind })}
          >
            {DELIVERABLE_KINDS.map((option) => (
              <option key={option} value={option}>
                {kindText(option, t)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <StudentPicker
        // The members belong to the course: another course starts the list over.
        key={draft.courseSlug}
        courseSlug={draft.courseSlug}
        everyone={draft.everyone}
        assignedUids={draft.assignedUids}
        onChange={(everyone, assignedUids) => setDraft({ ...draft, everyone, assignedUids })}
      />

      <label className={ui.field}>
        <span className={ui.label}>{t.guideUrlLabel}</span>
        <input
          className={ui.input}
          type="url"
          placeholder="https://drive.google.com/…"
          value={draft.guideUrl}
          onChange={(event) => setDraft({ ...draft, guideUrl: event.target.value })}
        />
      </label>

      <label className={ui.field}>
        <span className={ui.label}>{t.instructionsLabel}</span>
        <textarea
          className={s.textarea}
          value={draft.instructions}
          onChange={(event) => setDraft({ ...draft, instructions: event.target.value })}
        />
      </label>

      {draft.kind === 'text' && (
        <div className={ui.field}>
          <span className={ui.label}>{t.questionsLabel}</span>
          <div className={s.questions}>
            {draft.questions.map((question, index) => (
              <QuestionEditor
                key={question.id}
                number={index + 1}
                question={question}
                isOnlyQuestion={draft.questions.length === 1}
                onChange={replaceQuestion}
                onRemove={() => setDraft({ ...draft, questions: draft.questions.filter((q) => q.id !== question.id) })}
              />
            ))}
          </div>
          <div className={s.questionsFoot}>
            <button
              type="button"
              className={s.add}
              onClick={() => setDraft({ ...draft, questions: [...draft.questions, newQuestionDraft()] })}
            >
              + {t.addQuestion}
            </button>
            <span className={s.total}>{t.totalPoints.replace('{total}', String(draftTotal(draft)))}</span>
          </div>
        </div>
      )}

      <div className={s.numbers}>
        {draft.kind !== 'text' && (
          <label className={ui.field}>
            <span className={ui.label}>{t.maxScoreLabel}</span>
            <input
              className={ui.input}
              type="number"
              min={1}
              step={SCORE_STEP}
              value={draft.maxScore}
              onChange={(event) => setDraft({ ...draft, maxScore: event.target.value })}
            />
          </label>
        )}
        {draft.role === 'exam' ? (
          <label className={ui.field}>
            <span className={ui.label}>{t.durationLabel}</span>
            <input
              className={ui.input}
              type="number"
              min={1}
              value={draft.durationMinutes}
              onChange={(event) => setDraft({ ...draft, durationMinutes: event.target.value })}
            />
          </label>
        ) : (
          <label className={ui.field}>
            <span className={ui.label}>{t.deadlineLabel}</span>
            <input
              className={s.dateInput}
              type="datetime-local"
              value={draft.deadline}
              onChange={(event) => setDraft({ ...draft, deadline: event.target.value })}
            />
          </label>
        )}
      </div>

      {message && <p className={ui.error}>{message}</p>}
      {notice && <p className={ui.notice}>{notice}</p>}

      {deliverable && confirming === 'open' && (
        <ConfirmPanel
          message={draft.role === 'exam' ? t.confirmOpenExam : t.confirmOpenHomework}
          confirmLabel={busy ? t.opening : t.confirmOpenButton}
          busy={busy}
          onConfirm={() => open(deliverable)}
          onCancel={() => setConfirming(null)}
        />
      )}
      {deliverable && confirming === 'delete' && (
        <ConfirmPanel
          message={t.confirmDelete}
          confirmLabel={t.confirmDeleteButton}
          busy={busy}
          onConfirm={() => void run(() => deleteDeliverable(deliverable.id), onDeleted)}
          onCancel={() => setConfirming(null)}
        />
      )}
      {confirming === null && (
        <div className={s.actions}>
          <button type="submit" className={deliverable ? s.secondary : s.primary} disabled={busy}>
            {busy ? t.saving : t.save}
          </button>
          {deliverable && (
            <>
              <button type="button" className={s.primary} onClick={() => setConfirming('open')} disabled={busy}>
                {t.open}
              </button>
              <button type="button" className={s.delete} onClick={() => setConfirming('delete')} disabled={busy}>
                {t.deleteDeliverable}
              </button>
            </>
          )}
        </div>
      )}
    </form>
  );
}

/** The review as typed: numbers stay text until they are validated. */
type ReviewDraft = {
  /** The one score of a link deliverable. */
  score: string;
  /** On the whole submission. */
  comment: string;
  /** Question id → score as typed, '' for none yet. */
  scores: Record<string, string>;
  comments: Record<string, string>;
};

function reviewDraftOf(deliverable: Deliverable, review: Review | null): ReviewDraft {
  const scores: Record<string, string> = {};
  const comments: Record<string, string> = {};
  for (const question of deliverable.questions) {
    const score = review?.scores[question.id];
    scores[question.id] = score === null || score === undefined ? '' : String(score);
    comments[question.id] = review?.comments[question.id] ?? '';
  }
  // A review saved before scores were per question, on a single question: its total is that score.
  const [onlyQuestion] = deliverable.questions;
  if (review !== null && review.score !== null && deliverable.questions.length === 1 && scores[onlyQuestion.id] === '') {
    scores[onlyQuestion.id] = String(review.score);
  }
  return {
    score: review === null || review.score === null ? '' : String(review.score),
    comment: review?.comment ?? '',
    scores,
    comments,
  };
}

/** Empty is "not scored"; anything else is a number, NaN included, for the range check to catch. */
function scoreOf(value: string): number | null {
  return value.trim() === '' ? null : Number(value);
}

function isScoreInRange(score: number | null, max: number): boolean {
  return score === null || (!Number.isNaN(score) && score >= 0 && score <= max);
}

type AnswerReviewProps = {
  question: DeliverableQuestion;
  number: number;
  count: number;
  answer: string;
  score: string;
  comment: string;
  onChange: (score: string, comment: string) => void;
};

/** One answer as saved, with its score out of the question's points and a remark on it. */
function AnswerReview({ question, number, count, answer, score, comment, onChange }: AnswerReviewProps) {
  const t = useT(deliverableDict);
  return (
    <div className={s.answerCard}>
      <span className={s.questionName}>
        {number} / {count} · {t.questionPoints.replace('{points}', String(question.points))}
      </span>
      <p className={s.questionText}>{question.text}</p>
      {answer.trim() === '' ? <span className={s.noAnswer}>{t.noAnswer}</span> : <p className={s.answerText}>{answer}</p>}
      <div className={s.reviewRow}>
        <label className={s.scoreField}>
          <span className={ui.label}>
            {t.scoreLabel} / {question.points}
          </span>
          <input
            className={ui.input}
            type="number"
            min={0}
            max={question.points}
            step={SCORE_STEP}
            value={score}
            onChange={(event) => onChange(event.target.value, comment)}
          />
        </label>
        <label className={s.questionCommentField}>
          <span className={ui.label}>{t.questionCommentLabel}</span>
          <input className={ui.input} type="text" value={comment} onChange={(event) => onChange(score, event.target.value)} />
        </label>
      </div>
    </div>
  );
}

type ReviewFormProps = {
  deliverable: Deliverable;
  submission: Submission;
  review: Review | null;
  /** Shown between the answers and the total: the typing signals. */
  children?: ReactNode;
};

/** The teacher's review. For text, a score and a remark under each answer and the total they add
    up to; for a link, one score. A general comment in both cases. */
function ReviewForm({ deliverable, submission, review, children }: ReviewFormProps) {
  const t = useT(deliverableDict);
  const locale = useLocale();
  const auth = useAuthUser();
  const isText = deliverable.kind === 'text';
  const [draft, setDraft] = useState<ReviewDraft>(() => reviewDraftOf(deliverable, review));
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const questionScores: QuestionScores = {};
  for (const question of deliverable.questions) questionScores[question.id] = scoreOf(draft.scores[question.id] ?? '');
  const total = isText ? scoresTotal(questionScores) : scoreOf(draft.score);
  const totalText = total === null || Number.isNaN(total) ? '–' : String(total);

  // A review that arrives after the form did fills it in, unless the teacher already typed.
  useEffect(() => {
    if (review !== null && !touched) setDraft(reviewDraftOf(deliverable, review));
  }, [deliverable, review, touched]);

  function change(changes: Partial<ReviewDraft>): void {
    setTouched(true);
    setDraft((current) => ({ ...current, ...changes }));
  }

  function changeAnswer(questionId: string, score: string, comment: string): void {
    change({ scores: { ...draft.scores, [questionId]: score }, comments: { ...draft.comments, [questionId]: comment } });
  }

  function questionComments(): QuestionComments {
    const comments: QuestionComments = {};
    for (const question of deliverable.questions) {
      const comment = (draft.comments[question.id] ?? '').trim();
      if (comment !== '') comments[question.id] = comment;
    }
    return comments;
  }

  async function save() {
    if (isText && deliverable.questions.some((question) => !isScoreInRange(questionScores[question.id], question.points))) {
      setMessage(t.validationQuestionScore);
      return;
    }
    if (!isText && !isScoreInRange(total, deliverable.maxScore)) {
      setMessage(t.validationScore);
      return;
    }
    setBusy(true);
    setMessage(null);
    setNotice(null);
    try {
      await saveReview(deliverable.id, submission.uid, {
        score: total,
        maxScore: deliverable.maxScore,
        comment: draft.comment.trim(),
        scores: isText ? questionScores : {},
        comments: isText ? questionComments() : {},
        reviewedBy: auth.status === 'signedIn' ? auth.user.uid : '',
      });
      setNotice(t.savedNotice);
    } catch (error) {
      console.error('Could not save the review', error);
      setMessage(t.errorGeneric);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      className={s.reviewStack}
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
    >
      {isText && (
        <div className={s.answers}>
          {deliverable.questions.map((question, index) => (
            <AnswerReview
              key={question.id}
              question={question}
              number={index + 1}
              count={deliverable.questions.length}
              answer={submission.answers[question.id] ?? ''}
              score={draft.scores[question.id] ?? ''}
              comment={draft.comments[question.id] ?? ''}
              onChange={(score, comment) => changeAnswer(question.id, score, comment)}
            />
          ))}
        </div>
      )}
      {children}
      <div className={s.form}>
        <span className={ui.eyebrow}>
          {t.reviewTitle}
          {review?.reviewedAtMs ? ` · ${t.reviewedAt} ${dateTimeYearText(review.reviewedAtMs, locale)}` : ''}
        </span>
        {isText ? (
          <span className={s.reviewTotal}>
            {t.totalScore}: {totalText} / {deliverable.maxScore}
          </span>
        ) : (
          <label className={s.scoreField}>
            <span className={ui.label}>
              {t.scoreLabel} / {deliverable.maxScore}
            </span>
            <input
              className={ui.input}
              type="number"
              min={0}
              max={deliverable.maxScore}
              step={SCORE_STEP}
              value={draft.score}
              onChange={(event) => change({ score: event.target.value })}
            />
          </label>
        )}
        <label className={ui.field}>
          <span className={ui.label}>{isText ? t.generalCommentLabel : t.commentLabel}</span>
          <textarea className={s.textarea} value={draft.comment} onChange={(event) => change({ comment: event.target.value })} />
        </label>
        {message && <p className={ui.error}>{message}</p>}
        {notice && <p className={ui.notice}>{notice}</p>}
        <div className={s.actions}>
          <button type="submit" className={s.primary} disabled={busy}>
            {busy ? t.saving : t.saveReview}
          </button>
        </div>
      </div>
    </form>
  );
}

type SubmissionReviewProps = {
  deliverable: Deliverable;
  submission: Submission;
  review: Review | null;
  onBack: () => void;
};

/** One student's submission as saved, its typing signals and the teacher's review. */
function SubmissionReview({ deliverable, submission, review, onBack }: SubmissionReviewProps) {
  const t = useT(deliverableDict);
  const locale = useLocale();
  const charsWritten = Object.values(submission.answers).reduce((sum, answer) => sum + answer.length, 0);

  return (
    <>
      <button type="button" className={s.back} onClick={onBack}>
        ← {t.backToSubmissions}
      </button>
      <div className={s.summary}>
        <span className={s.name}>{submission.displayName || submission.email}</span>
        <span className={ui.mono}>{submission.email}</span>
        <span className={ui.mono}>
          {t.colSavedAt}: {dateTimeText(submission.savedAtMs, locale)}
        </span>
        {isSavedLate(submission, deliverable) && (
          <span className={ui.error}>
            {t.lateNote} {durationText(lateBySeconds(submission, deliverable))}
          </span>
        )}
      </div>

      {deliverable.kind !== 'text' && (
        <div className={s.answerCard}>
          <span className={ui.eyebrow}>{kindText(deliverable.kind, t)}</span>
          {submission.url === '' ? (
            <span className={s.noAnswer}>{t.noAnswer}</span>
          ) : (
            <a href={submission.url} target="_blank" rel="noopener noreferrer" className={s.link}>
              {submission.url}
            </a>
          )}
        </div>
      )}

      <ReviewForm key={submission.uid} deliverable={deliverable} submission={submission} review={review}>
        {deliverable.kind === 'text' && (
          <TypingSignalsView signals={submission.typing} questions={deliverable.questions} charsWritten={charsWritten} />
        )}
      </ReviewForm>
    </>
  );
}

type OpenedDeliverableProps = {
  deliverable: Deliverable;
  /** The student whose submission the route asks for, or null for the table. */
  reviewUid: string | null;
  onOpenSubmission: (uid: string) => void;
  onCloseSubmission: () => void;
  /** After the deliverable is deleted: back to its list. */
  onDeleted: () => void;
};

/** One line of the submissions table: a student the deliverable is for, with their submission if any. */
type RosterRow = {
  uid: string;
  name: string;
  email: string;
  submission: Submission | null;
};

/** The students the deliverable is for (every member, or the listed ones) plus anybody else who
    saved, each with their submission or none, by name. */
function rosterOf(deliverable: Deliverable, members: readonly CourseMember[] | null, submissions: readonly Submission[]): RosterRow[] {
  const rows: Map<string, RosterRow> = new Map();
  for (const account of assignedAccounts(deliverable, members ?? [])) {
    rows.set(account.uid, { uid: account.uid, name: memberName(account), email: account.email, submission: null });
  }
  for (const submission of submissions) {
    const row = rows.get(submission.uid);
    const name = submission.displayName || submission.email || row?.name || submission.uid;
    rows.set(submission.uid, { uid: submission.uid, name, email: submission.email || row?.email || '', submission });
  }
  return Array.from(rows.values()).sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
}

function OpenedDeliverable({ deliverable, reviewUid, onOpenSubmission, onCloseSubmission, onDeleted }: OpenedDeliverableProps) {
  const t = useT(deliverableDict);
  const locale = useLocale();
  const nowMs = useNowMs(STATUS_TICK_MS);
  const course = findCourse(deliverable.courseSlug);
  const running = isDeliverableRunning(deliverable, nowMs);
  const members = useCourseMembers(deliverable.courseSlug);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [submissionsLoaded, setSubmissionsLoaded] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [closeValue, setCloseValue] = useState(() => toDateTimeLocal(deliverable.closesAtMs ?? Date.now()));
  const [confirming, setConfirming] = useState<'close' | 'delete' | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const reviewedSubmission = submissions.find((submission) => submission.uid === reviewUid);
  const reviewOf = (uid: string) => reviews.find((review) => review.uid === uid);
  const roster = useMemo(() => rosterOf(deliverable, members, submissions), [deliverable, members, submissions]);

  // Close now and a saved change move the close: the field follows it.
  useEffect(() => {
    setCloseValue(toDateTimeLocal(deliverable.closesAtMs ?? Date.now()));
  }, [deliverable.closesAtMs]);

  useEffect(() => {
    const stopSubmissions = subscribeSubmissions(
      deliverable.id,
      (loaded) => {
        setSubmissions([...loaded].sort((a, b) => (a.displayName || a.email).localeCompare(b.displayName || b.email)));
        setSubmissionsLoaded(true);
      },
      (error) => console.error('Could not load the submissions', error)
    );
    const stopReviews = subscribeReviews(deliverable.id, setReviews, (error) => console.error('Could not load the reviews', error));
    return () => {
      stopSubmissions();
      stopReviews();
    };
  }, [deliverable.id]);

  /** `after` leaves this screen once the action is done; without it the screen stays and follows the deliverable. */
  async function run(action: () => Promise<void>, after: (() => void) | null) {
    setBusy(true);
    setMessage(null);
    try {
      await action();
      if (after) after();
    } catch (error) {
      console.error('Deliverable action failed', error);
      setMessage(isPermissionDenied(error) ? t.permissionDenied : t.errorGeneric);
    } finally {
      setBusy(false);
      setConfirming(null);
    }
  }

  function saveClose() {
    const closesAtMs = fromDateTimeLocal(closeValue);
    if (closesAtMs === null) {
      setMessage(t.validationDeadline);
      return;
    }
    void run(() => setDeliverableClose(deliverable.id, closesAtMs), null);
  }

  // A uid in the route that no submission matches: the student never saved, or the id is wrong.
  if (reviewUid && submissionsLoaded && !reviewedSubmission) {
    return (
      <>
        <button type="button" className={s.back} onClick={onCloseSubmission}>
          ← {t.backToSubmissions}
        </button>
        <p className={ui.error}>{t.notSaved}</p>
      </>
    );
  }

  if (reviewedSubmission) {
    return (
      <SubmissionReview
        deliverable={deliverable}
        submission={reviewedSubmission}
        review={reviewOf(reviewedSubmission.uid) ?? null}
        onBack={onCloseSubmission}
      />
    );
  }

  return (
    <>
      <div className={s.summary}>
        <span className={running ? s.running : ui.mono}>
          {running ? `${t.stateRunning} · ${t.closesAt}` : `${t.stateFinished} · ${t.closedAt}`}{' '}
          {dateTimeText(deliverable.closesAtMs, locale)}
        </span>
        <span className={ui.mono}>
          {kindText(deliverable.kind, t)} · {t.colScore} / {deliverable.maxScore}
        </span>
        {course && (
          <span className={ui.mono}>
            {t.studentLink}:{' '}
            <Link href={deliverablePath(course, deliverable.id)} className={s.link}>
              {deliverablePath(course, deliverable.id)}
            </Link>
          </span>
        )}
        {deliverable.guideUrl !== '' && (
          <span className={ui.mono}>
            {t.guideButton}:{' '}
            <a href={deliverable.guideUrl} target="_blank" rel="noopener noreferrer" className={s.link}>
              {deliverable.guideUrl}
            </a>
          </span>
        )}
      </div>

      {message && <p className={ui.error}>{message}</p>}
      {confirming === 'close' && (
        <ConfirmPanel
          message={t.confirmClose}
          confirmLabel={t.confirmCloseButton}
          busy={busy}
          onConfirm={() => void run(() => closeDeliverableNow(deliverable.id), null)}
          onCancel={() => setConfirming(null)}
        />
      )}
      {confirming === 'delete' && (
        <ConfirmPanel
          message={t.confirmDelete}
          confirmLabel={t.confirmDeleteButton}
          busy={busy}
          onConfirm={() => void run(() => deleteDeliverable(deliverable.id), onDeleted)}
          onCancel={() => setConfirming(null)}
        />
      )}
      {confirming === null && (
        <div className={s.closeForm}>
          <label className={ui.field}>
            <span className={ui.label}>{t.changeClose}</span>
            <input
              className={s.dateInput}
              type="datetime-local"
              value={closeValue}
              onChange={(event) => setCloseValue(event.target.value)}
            />
          </label>
          <button type="button" className={s.secondary} onClick={saveClose} disabled={busy}>
            {t.saveClose}
          </button>
          {running && (
            <button type="button" className={s.secondary} onClick={() => setConfirming('close')} disabled={busy}>
              {t.closeNow}
            </button>
          )}
          <button type="button" className={s.delete} onClick={() => setConfirming('delete')} disabled={busy}>
            {t.deleteDeliverable}
          </button>
        </div>
      )}

      <div className={s.card}>
        {roster.length === 0 ? (
          <p className={s.empty}>{members === null ? t.loading : t.noSubmissions}</p>
        ) : (
          <div className={ui.tableWrap}>
            <table className={s.list}>
              <thead>
                <tr>
                  <th className={s.studentCell}>{t.colStudent}</th>
                  <th className={s.dateCell}>{t.colSavedAt}</th>
                  <th className={`${ui.num} ${s.countCell}`}>{t.colLate}</th>
                  <th className={`${ui.num} ${s.countCell}`}>{t.colScore}</th>
                  {deliverable.kind === 'text' && <th className={s.countCell}>{t.colSignals}</th>}
                </tr>
              </thead>
              <tbody>
                {roster.map((row) => {
                  const { submission } = row;
                  const review = reviewOf(row.uid);
                  const late = submission ? isSavedLate(submission, deliverable) : false;
                  return (
                    <tr
                      key={row.uid}
                      className={submission ? s.row : undefined}
                      onClick={submission ? () => onOpenSubmission(row.uid) : undefined}
                    >
                      <td className={s.studentCell} title={row.email}>
                        <span className={s.name}>{row.name}</span>
                        <span className={s.email}>{row.email}</span>
                      </td>
                      {submission ? (
                        <td className={s.dateCell} title={dateTimeYearText(submission.savedAtMs, locale)}>
                          <span className={s.dateLong}>{dateTimeYearText(submission.savedAtMs, locale)}</span>
                          <span className={s.dateShort}>{dayMonthText(submission.savedAtMs, locale)}</span>
                        </td>
                      ) : (
                        <td className={`${s.dateCell} ${ui.mono}`}>{t.notSaved}</td>
                      )}
                      <td className={late ? `${ui.num} ${s.countCell} ${s.late}` : `${ui.num} ${s.countCell}`}>
                        {late && submission ? durationText(lateBySeconds(submission, deliverable)) : '–'}
                      </td>
                      <td className={`${ui.num} ${s.countCell}`}>
                        {review && review.score !== null ? `${review.score} / ${review.maxScore}` : '–'}
                      </td>
                      {deliverable.kind === 'text' && (
                        <td className={s.countCell}>
                          {submission && hasSuspiciousSignals(submission.typing) ? (
                            <span className={s.flag}>{t.signalsFlag}</span>
                          ) : (
                            '–'
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

/** The route decides the screen: the form of a new deliverable (its role in the query), or one by id. */
function screenOf(idParam: string | string[] | undefined, roleParam: string | string[] | undefined): Screen {
  const id = typeof idParam === 'string' ? idParam : NEW_ITEM_SEGMENT;
  if (id === NEW_ITEM_SEGMENT) return { kind: 'new', role: isDeliverableRole(roleParam) ? roleParam : 'homework' };
  return { kind: 'deliverable', deliverableId: id };
}

function Deliverables() {
  const t = useT(deliverableDict);
  const locale = useLocale();
  const router = useRouter();
  const [deliverables, setDeliverables] = useState<Deliverable[] | null>(null);
  const [failed, setFailed] = useState(false);
  const screen = screenOf(router.query.deliverableId, router.query[DELIVERABLE_ROLE_PARAM]);
  const shown =
    screen.kind === 'deliverable' ? deliverables?.find((deliverable) => deliverable.id === screen.deliverableId) : undefined;
  const reviewUid = typeof router.query.uid === 'string' ? router.query.uid : null;
  const role: DeliverableRole = shown ? shown.role : screen.kind === 'new' ? screen.role : 'homework';

  useEffect(
    () =>
      subscribeAllDeliverables(setDeliverables, (error) => {
        console.error('Could not load the deliverables', error);
        setFailed(true);
      }),
    []
  );

  function goToList(): void {
    void router.push(listPathOf(role));
  }

  if (failed) {
    return (
      <div className={ui.centered}>
        <p className={ui.error}>{t.loadError}</p>
      </div>
    );
  }
  // The route's id arrives with the router; until then nothing says which screen this is.
  if (!router.isReady || !deliverables) {
    return (
      <div className={ui.centered}>
        <span className={ui.mono}>{t.loading}</span>
      </div>
    );
  }

  const backLabel = role === 'exam' ? t.backToExams : t.backToHomeworks;

  if (screen.kind === 'deliverable' && !shown) {
    return (
      <div className={s.wrap}>
        <button type="button" className={s.back} onClick={goToList}>
          ← {backLabel}
        </button>
        <p className={ui.error}>{t.notFound}</p>
      </div>
    );
  }

  return (
    <div className={s.wrap}>
      <button type="button" className={s.back} onClick={goToList}>
        ← {backLabel}
      </button>
      <div className={s.heading}>
        <span className={ui.eyebrow}>
          {shown
            ? `${roleText(shown.role, t)} · ${findCourse(shown.courseSlug)?.title ?? shown.courseSlug}`
            : roleText(role, t)}
        </span>
        <h1 className={ui.title}>{shown ? shown.title : role === 'exam' ? t.newExam : t.newHomework}</h1>
        {shown && shown.status === 'opened' && shown.openedAtMs !== null && (
          <span className={ui.mono}>{dateTimeYearText(shown.openedAtMs, locale)}</span>
        )}
      </div>
      {shown && shown.status === 'opened' ? (
        <OpenedDeliverable
          deliverable={shown}
          reviewUid={reviewUid}
          onOpenSubmission={(uid) => void router.push(teacherSubmissionPath(shown.id, uid))}
          onCloseSubmission={() => void router.push(teacherDeliverablePath(shown.id))}
          onDeleted={goToList}
        />
      ) : (
        <DraftForm
          key={shown?.id ?? NEW_ITEM_SEGMENT}
          deliverable={shown ?? null}
          role={role}
          onDeleted={goToList}
          onCreated={(deliverableId) => void router.replace(teacherDeliverablePath(deliverableId))}
        />
      )}
    </div>
  );
}

/** Teacher only: one deliverable at a time, its draft, its live view and each student's submission. */
export default function DeliverableManager() {
  const t = useT(deliverableDict);
  const teacherStatus = useTeacherStatus();

  if (!isFirebaseConfigured()) {
    return (
      <div className={ui.centered}>
        <p className={ui.error}>{t.notConfigured}</p>
      </div>
    );
  }
  if (teacherStatus === 'loading') {
    return (
      <div className={ui.centered}>
        <span className={ui.mono}>{t.loading}</span>
      </div>
    );
  }
  if (teacherStatus === 'signedOut') return <SignInRedirect />;
  if (teacherStatus === 'notTeacher') {
    return (
      <div className={ui.centered}>
        <p className={ui.error}>{t.notAuthorized}</p>
      </div>
    );
  }
  return <Deliverables />;
}
