import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  DEFAULT_DURATION_MINUTES,
  DEFAULT_MAX_SCORE,
  DELIVERABLE_KINDS,
  DELIVERABLE_ROLES,
  isDeliverableRole,
  isDeliverableRunning,
  isHttpUrl,
  isSavedLate,
  lateBySeconds,
  newQuestionId,
} from '../../data/deliverable/types';
import type {
  Deliverable,
  DeliverableKind,
  DeliverableRole,
  DeliverableSettings,
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
};

type DraftValidation = { ok: true; settings: DeliverableSettings } | { ok: false; message: string };

type Screen = { kind: 'new'; role: DeliverableRole } | { kind: 'deliverable'; deliverableId: string };

function newQuestionDraft(): QuestionDraft {
  return { id: newQuestionId(), text: '', maxChars: '' };
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
          }))
        : [newQuestionDraft()],
    maxScore: String(deliverable.maxScore),
    durationMinutes: String(deliverable.durationMinutes),
    deadline: deliverable.deadlineMs === null ? '' : toDateTimeLocal(deliverable.deadlineMs),
  };
}

function isPositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0;
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
  return draft.questions.map((question) => ({
    id: question.id,
    text: question.text.trim(),
    maxChars: question.maxChars === '' ? null : Number(question.maxChars),
  }));
}

/** `forOpen` also demands what opening needs: a close in the future for a homework. */
function validateDraft(draft: Draft, forOpen: boolean, t: DeliverableTexts): DraftValidation {
  const title = draft.title.trim();
  const guideUrl = draft.guideUrl.trim();
  const maxScore = Number(draft.maxScore);
  const durationMinutes = Number(draft.durationMinutes);
  const deadlineMs = fromDateTimeLocal(draft.deadline);
  if (title === '') return { ok: false, message: t.validationTitle };
  if (!findCourse(draft.courseSlug)) return { ok: false, message: t.validationCourse };
  if (guideUrl !== '' && !isHttpUrl(guideUrl)) return { ok: false, message: t.validationGuideUrl };
  const questions = validateQuestions(draft, t);
  if (!Array.isArray(questions)) return questions;
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
  );
}

type DraftFormProps = {
  deliverable: Deliverable | null;
  /** For a deliverable not saved yet: the list its New button was pressed in. */
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
      setMessage(t.errorGeneric);
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
            onChange={(event) => setDraft({ ...draft, courseSlug: event.target.value })}
          >
            {LEARN_COURSES.map((course) => (
              <option key={course.slug} value={course.slug}>
                {course.title}
              </option>
            ))}
          </select>
        </label>
        <label className={ui.field}>
          <span className={ui.label}>{t.roleLabel}</span>
          <select
            className={s.select}
            value={draft.role}
            onChange={(event) => setDraft({ ...draft, role: isDeliverableRole(event.target.value) ? event.target.value : 'homework' })}
          >
            {DELIVERABLE_ROLES.map((option) => (
              <option key={option} value={option}>
                {roleText(option, t)}
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
          <button
            type="button"
            className={s.add}
            onClick={() => setDraft({ ...draft, questions: [...draft.questions, newQuestionDraft()] })}
          >
            + {t.addQuestion}
          </button>
        </div>
      )}

      <div className={s.numbers}>
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

type ReviewFormProps = {
  deliverable: Deliverable;
  uid: string;
  review: Review | null;
};

function ReviewForm({ deliverable, uid, review }: ReviewFormProps) {
  const t = useT(deliverableDict);
  const locale = useLocale();
  const auth = useAuthUser();
  const [score, setScore] = useState<string>(() => (review?.score === null || review === null ? '' : String(review.score)));
  const [comment, setComment] = useState<string>(() => review?.comment ?? '');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function save() {
    const scoreNumber = score.trim() === '' ? null : Number(score);
    if (scoreNumber !== null && (Number.isNaN(scoreNumber) || scoreNumber < 0 || scoreNumber > deliverable.maxScore)) {
      setMessage(t.validationScore);
      return;
    }
    setBusy(true);
    setMessage(null);
    setNotice(null);
    try {
      await saveReview(deliverable.id, uid, {
        score: scoreNumber,
        maxScore: deliverable.maxScore,
        comment: comment.trim(),
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
      className={s.form}
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
    >
      <span className={ui.eyebrow}>
        {t.reviewTitle}
        {review?.reviewedAtMs ? ` · ${t.reviewedAt} ${dateTimeYearText(review.reviewedAtMs, locale)}` : ''}
      </span>
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
          value={score}
          onChange={(event) => setScore(event.target.value)}
        />
      </label>
      <label className={ui.field}>
        <span className={ui.label}>{t.commentLabel}</span>
        <textarea className={s.textarea} value={comment} onChange={(event) => setComment(event.target.value)} />
      </label>
      {message && <p className={ui.error}>{message}</p>}
      {notice && <p className={ui.notice}>{notice}</p>}
      <div className={s.actions}>
        <button type="submit" className={s.primary} disabled={busy}>
          {busy ? t.saving : t.saveReview}
        </button>
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

      {deliverable.kind === 'text' ? (
        <div className={s.answers}>
          {deliverable.questions.map((question, index) => {
            const answer = submission.answers[question.id] ?? '';
            return (
              <div key={question.id} className={s.answerCard}>
                <span className={s.questionName}>
                  {index + 1} / {deliverable.questions.length}
                </span>
                <p className={s.questionText}>{question.text}</p>
                {answer.trim() === '' ? (
                  <span className={s.noAnswer}>{t.noAnswer}</span>
                ) : (
                  <p className={s.answerText}>{answer}</p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
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

      {deliverable.kind === 'text' && (
        <TypingSignalsView signals={submission.typing} questions={deliverable.questions} charsWritten={charsWritten} />
      )}

      <ReviewForm key={submission.uid} deliverable={deliverable} uid={submission.uid} review={review} />
    </>
  );
}

type OpenedDeliverableProps = {
  deliverable: Deliverable;
  /** The student whose submission the route asks for, or null for the table. */
  reviewUid: string | null;
  onOpenSubmission: (uid: string) => void;
  onCloseSubmission: () => void;
};

function OpenedDeliverable({ deliverable, reviewUid, onOpenSubmission, onCloseSubmission }: OpenedDeliverableProps) {
  const t = useT(deliverableDict);
  const locale = useLocale();
  const nowMs = useNowMs(STATUS_TICK_MS);
  const course = findCourse(deliverable.courseSlug);
  const running = isDeliverableRunning(deliverable, nowMs);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [submissionsLoaded, setSubmissionsLoaded] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [closeValue, setCloseValue] = useState(() => toDateTimeLocal(deliverable.closesAtMs ?? Date.now()));
  const [confirmingClose, setConfirmingClose] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const reviewedSubmission = submissions.find((submission) => submission.uid === reviewUid);
  const reviewOf = (uid: string) => reviews.find((review) => review.uid === uid);

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

  async function runClose(action: () => Promise<void>) {
    setBusy(true);
    setMessage(null);
    try {
      await action();
    } catch (error) {
      console.error('Could not change the close', error);
      setMessage(t.errorGeneric);
    } finally {
      setBusy(false);
      setConfirmingClose(false);
    }
  }

  function saveClose() {
    const closesAtMs = fromDateTimeLocal(closeValue);
    if (closesAtMs === null) {
      setMessage(t.validationDeadline);
      return;
    }
    void runClose(() => setDeliverableClose(deliverable.id, closesAtMs));
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
      {confirmingClose ? (
        <ConfirmPanel
          message={t.confirmClose}
          confirmLabel={t.confirmCloseButton}
          busy={busy}
          onConfirm={() => void runClose(() => closeDeliverableNow(deliverable.id))}
          onCancel={() => setConfirmingClose(false)}
        />
      ) : (
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
            <button type="button" className={s.secondary} onClick={() => setConfirmingClose(true)} disabled={busy}>
              {t.closeNow}
            </button>
          )}
        </div>
      )}

      <div className={s.card}>
        {submissions.length === 0 ? (
          <p className={s.empty}>{t.noSubmissions}</p>
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
                {submissions.map((submission) => {
                  const review = reviewOf(submission.uid);
                  const late = isSavedLate(submission, deliverable);
                  return (
                    <tr key={submission.uid} className={s.row} onClick={() => onOpenSubmission(submission.uid)}>
                      <td className={s.studentCell} title={submission.email}>
                        <span className={s.name}>{submission.displayName || submission.email}</span>
                        <span className={s.email}>{submission.email}</span>
                      </td>
                      <td className={s.dateCell} title={dateTimeYearText(submission.savedAtMs, locale)}>
                        <span className={s.dateLong}>{dateTimeYearText(submission.savedAtMs, locale)}</span>
                        <span className={s.dateShort}>{dayMonthText(submission.savedAtMs, locale)}</span>
                      </td>
                      <td className={late ? `${ui.num} ${s.countCell} ${s.late}` : `${ui.num} ${s.countCell}`}>
                        {late ? durationText(lateBySeconds(submission, deliverable)) : '–'}
                      </td>
                      <td className={`${ui.num} ${s.countCell}`}>
                        {review && review.score !== null ? `${review.score} / ${review.maxScore}` : '–'}
                      </td>
                      {deliverable.kind === 'text' && (
                        <td className={s.countCell}>
                          {hasSuspiciousSignals(submission.typing) ? <span className={s.flag}>{t.signalsFlag}</span> : '–'}
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
