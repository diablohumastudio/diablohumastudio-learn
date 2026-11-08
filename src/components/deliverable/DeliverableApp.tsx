import type { User } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ClipboardEvent, DragEvent } from 'react';
import {
  AUTOSAVE_MS,
  SAVE_GRACE_MS,
  SAVE_RETRY_MS,
  hasReviewContent,
  isDeliverableOver,
  isValidSubmissionUrl,
} from '../../data/deliverable/types';
import type { Deliverable, Review, Submission, SubmissionAnswers } from '../../data/deliverable/types';
import { coursePath, findCourse, querySlug } from '../../data/learn';
import type { LearnCourse } from '../../data/learn';
import { deliverableDict } from '../../i18n/pages/deliverable';
import { useLocale, useT } from '../../i18n/useT';
import { isFirebaseConfigured } from '../../lib/firebase';
import NotEnrolledNotice from '../course/NotEnrolledNotice';
import { useMembership } from '../course/useMembership';
import { countdownText, dateTimeText, durationText } from '../exam/format';
import SignInRedirect from '../learn/SignInRedirect';
import ui from '../learn/ui.module.css';
import { useAuthUser } from '../learn/useAuthUser';
import s from './DeliverableApp.module.css';
import { clearStoredDraft, readStoredDraft, writeStoredDraft } from './deliverableStorage';
import { fetchSubmission, saveSubmission, subscribeDeliverable, subscribeReview } from './deliverables';
import { roleText, timeText } from './format';
import { useTypingRecorder } from './typingSignals';
import { useNowMs } from './useNowMs';

const CLOCK_TICK_MS: number = 500;
const LAST_MINUTE_MS: number = 60_000;
const MS_PER_SECOND: number = 1000;

type SubmissionEditorProps = {
  deliverable: Deliverable;
  user: User;
  course: LearnCourse;
  /** What the server had when the page opened; null when the student never saved. */
  remote: Submission | null;
  review: Review | null;
  nowMs: number;
};

/* The student's text lives in this browser until the server confirms it has it, and is saved by
   itself every minute while it changes. What counts is the last version saved before the close:
   the rules stamp every save with the server's clock and refuse any other stamp. */
function SubmissionEditor({ deliverable, user, course, remote, review, nowMs }: SubmissionEditorProps) {
  const t = useT(deliverableDict);
  const locale = useLocale();
  const uid = user.uid;
  const isText = deliverable.kind === 'text';
  const over = isDeliverableOver(deliverable, nowMs);
  const closesAtMs = deliverable.closesAtMs ?? nowMs;
  const [stored] = useState(() => readStoredDraft(deliverable.id, uid));
  const [answers, setAnswers] = useState<SubmissionAnswers>(() => stored?.answers ?? remote?.answers ?? {});
  const [url, setUrl] = useState<string>(() => stored?.url ?? remote?.url ?? '');
  // A draft kept in this browser is, by definition, not confirmed saved.
  const [dirty, setDirty] = useState<boolean>(stored !== null);
  const [saving, setSaving] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [savedAtMs, setSavedAtMs] = useState<number | null>(remote?.savedAtMs ?? null);
  const [pasteNotice, setPasteNotice] = useState(false);
  const hasRemoteRef = useRef(remote !== null);
  /** Counts every change: a save confirms only the version it sent. */
  const versionRef = useRef(0);
  const sendingRef = useRef(false);
  const stateRef = useRef({ answers, url, dirty });
  stateRef.current = { answers, url, dirty };
  const recorder = useTypingRecorder(
    stored?.typing ?? remote?.typing ?? null,
    () => Object.values(stateRef.current.answers).reduce((sum, answer) => sum + answer.length, 0),
    isText && !over
  );
  const urlValid = isText || isValidSubmissionUrl(deliverable.kind, url);
  const late = savedAtMs !== null && savedAtMs > closesAtMs + SAVE_GRACE_MS;

  const save = useCallback(async () => {
    const current = stateRef.current;
    if (!current.dirty || sendingRef.current) return;
    // A link that is not one is never saved; the page says why instead.
    if (!isText && !isValidSubmissionUrl(deliverable.kind, current.url)) return;
    const version = versionRef.current;
    sendingRef.current = true;
    setSaving(true);
    try {
      await saveSubmission(
        deliverable.id,
        uid,
        {
          displayName: user.displayName ?? '',
          email: user.email ?? '',
          answers: isText ? current.answers : {},
          url: isText ? '' : current.url.trim(),
          typing: isText ? recorder.read() : null,
        },
        !hasRemoteRef.current
      );
      hasRemoteRef.current = true;
      setSavedAtMs(Date.now());
      setSaveFailed(false);
      // Typing during the save keeps the page dirty: only an unchanged draft is confirmed.
      if (versionRef.current === version) {
        setDirty(false);
        clearStoredDraft(deliverable.id, uid);
      }
    } catch (error) {
      console.error('Could not save the submission', error);
      setSaveFailed(true);
    } finally {
      sendingRef.current = false;
      setSaving(false);
    }
  }, [deliverable.id, deliverable.kind, isText, recorder, uid, user.displayName, user.email]);

  useEffect(() => {
    if (over) return undefined;
    const interval = window.setInterval(() => void save(), AUTOSAVE_MS);
    return () => window.clearInterval(interval);
  }, [over, save]);

  // A failed save is tried again while the page stays open.
  useEffect(() => {
    if (!saveFailed) return undefined;
    const timer = window.setTimeout(() => {
      setRetryCount((count) => count + 1);
      void save();
    }, SAVE_RETRY_MS);
    return () => window.clearTimeout(timer);
  }, [saveFailed, retryCount, save]);

  // The close arrived with changes still here: they go now, and the server's stamp says they came late.
  useEffect(() => {
    if (over) void save();
  }, [over, save]);

  useEffect(() => {
    function onVisibilityChange(): void {
      if (document.visibilityState === 'hidden') void save();
    }
    function onBeforeUnload(event: BeforeUnloadEvent): void {
      if (!stateRef.current.dirty) return;
      event.preventDefault();
      event.returnValue = '';
    }
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [save]);

  function keepDraft(nextAnswers: SubmissionAnswers, nextUrl: string): void {
    versionRef.current += 1;
    setDirty(true);
    writeStoredDraft(deliverable.id, uid, { answers: nextAnswers, url: nextUrl, typing: recorder.read() });
  }

  function changeAnswer(questionId: string, value: string): void {
    const previous = answers[questionId] ?? '';
    recorder.recordInput(questionId, previous.length, value.length);
    const nextAnswers = { ...answers, [questionId]: value };
    setAnswers(nextAnswers);
    keepDraft(nextAnswers, url);
  }

  function changeUrl(value: string): void {
    setUrl(value);
    keepDraft(answers, value);
  }

  function refusePaste(event: ClipboardEvent<HTMLTextAreaElement>): void {
    event.preventDefault();
    recorder.recordPasteAttempt();
    setPasteNotice(true);
  }

  function refuseDrop(event: DragEvent<HTMLTextAreaElement>): void {
    event.preventDefault();
    recorder.recordDropAttempt();
    setPasteNotice(true);
  }

  function statusLine(): { text: string; className: string } {
    if (saving) return { text: t.savingSubmission, className: s.status };
    if (saveFailed) return { text: t.saveFailed, className: s.statusError };
    if (dirty) return { text: t.unsavedChanges, className: s.statusWarn };
    if (savedAtMs !== null) return { text: t.savedAt.replace('{time}', timeText(savedAtMs, locale)), className: s.statusOk };
    return { text: t.notSaved, className: s.status };
  }

  const status = statusLine();
  const remainingMs = closesAtMs - nowMs;
  const hasReview = hasReviewContent(review);

  return (
    <div className={s.wrap}>
      <Link href={coursePath(course)} className={ui.backLink}>
        ← {t.backToCourse}
      </Link>

      <div className={s.bar}>
        <span className={s.barTitle}>{roleText(deliverable.role, t)}</span>
        <div className={s.barItem}>
          <span className={s.barLabel}>{t.colSavedAt}</span>
          <span className={status.className}>{status.text}</span>
        </div>
        <div className={s.barItem}>
          <span className={s.barLabel}>{over ? t.closedAt : t.timeLeft}</span>
          <span className={!over && remainingMs <= LAST_MINUTE_MS ? s.barValueUrgent : s.barValue} role="timer">
            {over ? dateTimeText(closesAtMs, locale) : countdownText(remainingMs)}
          </span>
        </div>
      </div>

      <div className={s.card}>
        <h1 className={ui.title}>{deliverable.title}</h1>
        {deliverable.instructions !== '' && <p className={s.instructions}>{deliverable.instructions}</p>}
        {deliverable.guideUrl !== '' && (
          <a href={deliverable.guideUrl} target="_blank" rel="noopener noreferrer" className={s.guide}>
            {t.guideButton} ↗
          </a>
        )}
        {over && <p className={ui.notice}>{hasRemoteRef.current || dirty ? t.closedNotice : t.nothingSavedNotice}</p>}
        {late && savedAtMs !== null && (
          <p className={ui.error}>
            {t.lateNote} {durationText(Math.round((savedAtMs - closesAtMs) / MS_PER_SECOND))}
          </p>
        )}
      </div>

      {isText ? (
        <>
          {!over && <p className={s.warning}>{t.telemetryWarning}</p>}
          {pasteNotice && <p className={ui.error}>{t.pasteBlocked}</p>}
          <ol className={s.list}>
            {deliverable.questions.map((question, index) => {
              const answer = answers[question.id] ?? '';
              const questionScore = review?.scores[question.id] ?? null;
              const questionComment = review?.comments[question.id] ?? '';
              return (
                <li key={question.id} className={s.questionCard}>
                  <span className={s.number}>
                    {index + 1} / {deliverable.questions.length} · {t.questionPoints.replace('{points}', String(question.points))}
                  </span>
                  <p className={s.prompt}>{question.text}</p>
                  <textarea
                    className={s.answer}
                    value={answer}
                    disabled={over}
                    maxLength={question.maxChars ?? undefined}
                    autoComplete="off"
                    aria-label={question.text}
                    onChange={(event) => changeAnswer(question.id, event.target.value)}
                    onPaste={refusePaste}
                    onDrop={refuseDrop}
                  />
                  {question.maxChars !== null && (
                    <span className={s.counter}>
                      {t.charCount.replace('{count}', String(answer.length)).replace('{max}', String(question.maxChars))}
                    </span>
                  )}
                  {(questionScore !== null || questionComment !== '') && (
                    <div className={s.questionReview}>
                      {questionScore !== null && (
                        <span className={s.questionScore}>
                          {t.scoreLabel}: {questionScore} / {question.points}
                        </span>
                      )}
                      {questionComment !== '' && <p className={s.questionComment}>{questionComment}</p>}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </>
      ) : (
        <div className={s.questionCard}>
          <label className={ui.field}>
            <span className={ui.label}>{deliverable.kind === 'repo' ? t.urlLabelRepo : t.urlLabelDoc}</span>
            <input
              className={ui.input}
              type="url"
              value={url}
              disabled={over}
              placeholder={deliverable.kind === 'repo' ? 'https://gitlab.com/…' : 'https://drive.google.com/…'}
              onChange={(event) => changeUrl(event.target.value)}
            />
          </label>
          {url.trim() !== '' && !urlValid && (
            <p className={ui.error}>{deliverable.kind === 'repo' ? t.urlInvalidRepo : t.urlInvalidDoc}</p>
          )}
          {url.trim() !== '' && urlValid && (
            <a href={url.trim()} target="_blank" rel="noopener noreferrer" className={s.link}>
              {t.openLink} ↗
            </a>
          )}
        </div>
      )}

      {!over && (
        <div className={s.actions}>
          <button type="button" className={s.save} onClick={() => void save()} disabled={!dirty || saving || !urlValid}>
            {saving ? t.savingSubmission : t.saveSubmission}
          </button>
          <span className={ui.mono}>{t.autosaveHint}</span>
        </div>
      )}

      {hasReview && (
        <div className={s.card}>
          <span className={ui.eyebrow}>{t.reviewTitle}</span>
          {review.score !== null && (
            <span className={s.score}>
              {review.score} / {review.maxScore}
            </span>
          )}
          {review.comment !== '' && <p className={s.comment}>{review.comment}</p>}
        </div>
      )}
    </div>
  );
}

type DeliverableRoomProps = {
  user: User;
  course: LearnCourse;
  deliverableId: string;
};

function DeliverableRoom({ user, course, deliverableId }: DeliverableRoomProps) {
  const t = useT(deliverableDict);
  const nowMs = useNowMs(CLOCK_TICK_MS);
  const [deliverable, setDeliverable] = useState<Deliverable | null | undefined>(undefined);
  const [submission, setSubmission] = useState<Submission | null | undefined>(undefined);
  const [review, setReview] = useState<Review | null>(null);

  // A draft is refused by the rules, which reads here as "not opened".
  useEffect(() => subscribeDeliverable(deliverableId, setDeliverable, () => setDeliverable(null)), [deliverableId]);

  useEffect(() => {
    fetchSubmission(deliverableId, user.uid)
      .then(setSubmission)
      .catch((error) => {
        console.error('Could not load the submission', error);
        setSubmission(null);
      });
  }, [deliverableId, user.uid]);

  useEffect(
    () => subscribeReview(deliverableId, user.uid, setReview, (error) => console.error('Could not load the review', error)),
    [deliverableId, user.uid]
  );

  if (deliverable === undefined || submission === undefined) {
    return (
      <div className={ui.centered}>
        <span className={ui.mono}>{t.loading}</span>
      </div>
    );
  }
  // The URL names the course, so a deliverable reached under another course's path is not shown.
  const isMisplaced = deliverable !== null && deliverable.courseSlug !== course.slug;
  if (deliverable === null || isMisplaced || deliverable.status !== 'opened' || deliverable.closesAtMs === null) {
    return (
      <div className={ui.centered}>
        <p className={ui.error}>{t.notOpened}</p>
        <Link href={coursePath(course)} className={ui.btn}>
          ← {t.backToCourse}
        </Link>
      </div>
    );
  }
  return (
    <SubmissionEditor
      key={deliverable.id}
      deliverable={deliverable}
      user={user}
      course={course}
      remote={submission}
      review={review}
      nowMs={nowMs}
    />
  );
}

export default function DeliverableApp() {
  const t = useT(deliverableDict);
  const router = useRouter();
  const auth = useAuthUser();
  const course = findCourse(querySlug(router.query.curso));
  const deliverableId = querySlug(router.query.deliverableId);
  const membership = useMembership(course?.slug ?? '');

  if (!isFirebaseConfigured()) {
    return (
      <div className={ui.centered}>
        <p className={ui.error}>{t.notConfigured}</p>
      </div>
    );
  }
  if (auth.status === 'loading' || !router.isReady) {
    return (
      <div className={ui.centered}>
        <span className={ui.mono}>{t.loading}</span>
      </div>
    );
  }
  if (auth.status === 'signedOut') return <SignInRedirect />;
  if (!course || !deliverableId) {
    return (
      <div className={ui.centered}>
        <p className={ui.error}>{t.notOpened}</p>
      </div>
    );
  }
  if (membership.status === 'loading') {
    return (
      <div className={ui.centered}>
        <span className={ui.mono}>{t.loading}</span>
      </div>
    );
  }
  if (membership.status !== 'member') return <NotEnrolledNotice course={course} />;
  return (
    <DeliverableRoom key={`${deliverableId}:${auth.user.uid}`} user={auth.user} course={course} deliverableId={deliverableId} />
  );
}
