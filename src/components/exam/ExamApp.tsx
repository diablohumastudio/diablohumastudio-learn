import type { User } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { isExamOver, isExamRunning, questionsPerStudent } from '../../data/exam/types';
import type { Exam, ExamAnswers, ExamAttempt, ExamGrade, ExamQuestion } from '../../data/exam/types';
import { LEARN_BASE_PATH, courseExamsPath, findCourse, querySlug } from '../../data/learn';
import { examDict } from '../../i18n/pages/exam';
import { useT } from '../../i18n/useT';
import { isFirebaseConfigured } from '../../lib/firebase';
import SignInRedirect from '../learn/SignInRedirect';
import ui from '../learn/ui.module.css';
import { useAuthUser } from '../learn/useAuthUser';
import AttemptReplay from './AttemptReplay';
import s from './ExamApp.module.css';
import ExamTaker from './ExamTaker';
import { fetchOwnAttempt, fetchOwnGrade, startExam, submitExam, subscribeExam } from './exams';
import { clearStoredExam, readStoredExam, writeStoredExam } from './examStorage';
import { durationText, examErrorText } from './format';

const CLOCK_TICK_MS: number = 500;
const SUBMIT_RETRY_MS: number = 5000;
const GRADE_RETRY_MS: number = 3000;
const MS_PER_MINUTE: number = 60_000;

type ExamSession = {
  questions: ExamQuestion[];
  /** Server clock minus device clock, so a wrong or changed device clock does not move the end. */
  clockOffsetMs: number;
};

function useServerNowMs(clockOffsetMs: number): number {
  const [nowMs, setNowMs] = useState(() => Date.now() + clockOffsetMs);
  useEffect(() => {
    setNowMs(Date.now() + clockOffsetMs);
    const interval = window.setInterval(() => setNowMs(Date.now() + clockOffsetMs), CLOCK_TICK_MS);
    return () => window.clearInterval(interval);
  }, [clockOffsetMs]);
  return nowMs;
}

function ExamRoom({ user, examId }: { user: User; examId: string }) {
  const t = useT(examDict);
  const uid = user.uid;
  const [exam, setExam] = useState<Exam | null | undefined>(undefined);
  const [attempt, setAttempt] = useState<ExamAttempt | null | undefined>(undefined);
  const [session, setSession] = useState<ExamSession | null>(null);
  const [grade, setGrade] = useState<ExamGrade | null>(null);
  const [answers, setAnswers] = useState<ExamAnswers>(() => readStoredExam(examId, uid)?.answers ?? {});
  const [submitPending, setSubmitPending] = useState<boolean>(() => readStoredExam(examId, uid)?.submitPending ?? false);
  const [submitFailed, setSubmitFailed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);
  const resumeTried = useRef(false);
  const sending = useRef(false);
  const nowMs = useServerNowMs(session?.clockOffsetMs ?? 0);

  const running = exam ? isExamRunning(exam, nowMs) : false;
  const over = exam ? isExamOver(exam, nowMs) : false;
  const attemptStatus = attempt?.status;
  // An exam still loading, or one left without a course, has no list to go back to.
  const examCourse = findCourse(exam?.courseSlug ?? undefined);
  const examsHref = examCourse ? courseExamsPath(examCourse) : LEARN_BASE_PATH;

  const refreshAttempt = useCallback(async () => {
    try {
      setAttempt(await fetchOwnAttempt(examId, uid));
    } catch (error) {
      console.error('Could not load the attempt', error);
      setAttempt(null);
    }
  }, [examId, uid]);

  const begin = useCallback(async () => {
    setStarting(true);
    setStartError(null);
    try {
      const sentAtMs = Date.now();
      const started = await startExam(examId);
      // The server's "now" belongs to the middle of the round trip.
      const clockOffsetMs = started.serverNowMs - (sentAtMs + Date.now()) / 2;
      if (!readStoredExam(examId, uid)) writeStoredExam(examId, uid, { answers: {}, submitPending: false });
      setSession({ questions: started.questions, clockOffsetMs });
      await refreshAttempt();
    } catch (error) {
      console.error('Could not start the exam', error);
      setStartError(examErrorText(error, t));
    } finally {
      setStarting(false);
    }
  }, [examId, uid, refreshAttempt, t]);

  useEffect(() => subscribeExam(examId, setExam, () => setExam(null)), [examId]);

  useEffect(() => {
    void refreshAttempt();
  }, [refreshAttempt]);

  // A reload in the middle of the exam: the same frozen draw comes back, with fresh server times.
  useEffect(() => {
    if (!running || attemptStatus !== 'started' || session || resumeTried.current) return;
    resumeTried.current = true;
    void begin();
  }, [running, attemptStatus, session, begin]);

  // The clock ended (or the teacher closed early) with answers still in this browser.
  useEffect(() => {
    if (over && attemptStatus === 'started' && readStoredExam(examId, uid)) setSubmitPending(true);
  }, [over, attemptStatus, examId, uid]);

  useEffect(() => {
    if (!submitPending || attemptStatus !== 'started' || sending.current) return;
    let retryTimer: number | undefined;
    sending.current = true;
    writeStoredExam(examId, uid, { answers, submitPending: true });
    submitExam(examId, answers)
      .then(async () => {
        clearStoredExam(examId, uid);
        setSubmitPending(false);
        setSubmitFailed(false);
        await refreshAttempt();
      })
      .catch((error) => {
        console.error('Could not send the answers', error);
        setSubmitFailed(true);
        retryTimer = window.setTimeout(() => setRetryCount((count) => count + 1), SUBMIT_RETRY_MS);
      })
      .finally(() => {
        sending.current = false;
      });
    return () => window.clearTimeout(retryTimer);
    // `answers` cannot change while a submit is pending: the taker is no longer on screen.
  }, [submitPending, attemptStatus, retryCount, examId, uid, refreshAttempt]);

  // The rules release the grade when the exam clock ends; a device clock that runs ahead asks too early.
  useEffect(() => {
    if (!over || attemptStatus !== 'submitted' || grade) return;
    let retryTimer: number | undefined;
    let cancelled = false;
    function load() {
      fetchOwnGrade(examId, uid)
        .then((loaded) => {
          if (cancelled) return;
          if (loaded) setGrade(loaded);
          else retryTimer = window.setTimeout(load, GRADE_RETRY_MS);
        })
        .catch(() => {
          if (!cancelled) retryTimer = window.setTimeout(load, GRADE_RETRY_MS);
        });
    }
    load();
    return () => {
      cancelled = true;
      window.clearTimeout(retryTimer);
    };
  }, [over, attemptStatus, grade, examId, uid]);

  function select(questionId: string, optionId: string) {
    const nextAnswers = { ...answers, [questionId]: optionId };
    setAnswers(nextAnswers);
    writeStoredExam(examId, uid, { answers: nextAnswers, submitPending: false });
  }

  function message(text: string, isError: boolean) {
    return (
      <div className={ui.centered}>
        <p className={isError ? ui.error : ui.mono}>{text}</p>
        <Link href={examsHref} className={ui.btn}>
          ← {t.backToExams}
        </Link>
      </div>
    );
  }

  if (exam === undefined || attempt === undefined) return message(t.loading, false);
  if (exam === null || exam.status !== 'opened' || exam.closesAtMs === null) return message(t.examNotFound, true);

  if (submitPending && attempt?.status === 'started') {
    return (
      <div className={ui.centered}>
        <p className={submitFailed ? ui.error : ui.mono}>{submitFailed ? t.retrying : t.sending}</p>
      </div>
    );
  }

  if (attempt?.status === 'submitted') {
    if (!over) {
      return (
        <div className={s.wrap}>
          <div className={s.card}>
            <span className={ui.eyebrow}>{exam.title}</span>
            <h1 className={ui.title}>{t.submittedTitle}</h1>
            <p className={ui.lede}>{t.submittedLede}</p>
          </div>
        </div>
      );
    }
    if (!grade) return message(t.resultLoading, false);
    return (
      <div className={s.wrap}>
        <Link href={examsHref} className={ui.backLink}>
          ← {t.backToExams}
        </Link>
        <div className={s.card}>
          <span className={ui.eyebrow}>{exam.title}</span>
          <h1 className={ui.title}>{t.resultTitle}</h1>
          <span className={s.score}>
            {grade.score} / {grade.total}
          </span>
          {attempt.late && (
            <p className={ui.error}>
              {t.lateNote} {durationText(attempt.lateBySeconds)}
            </p>
          )}
        </div>
        <AttemptReplay questions={attempt.questions} answers={attempt.answers} correctOptionIds={grade.correctOptionIds} />
      </div>
    );
  }

  if (over) return message(attempt ? t.answersNotReceived : t.examClosed, true);

  if (session && attempt) {
    return (
      <ExamTaker
        title={exam.title}
        questions={session.questions}
        answers={answers}
        remainingMs={exam.closesAtMs - nowMs}
        onSelect={select}
        onSubmit={() => setSubmitPending(true)}
      />
    );
  }

  return (
    <div className={s.wrap}>
      <Link href={examsHref} className={ui.backLink}>
        ← {t.backToExams}
      </Link>
      <div className={s.card}>
        <span className={ui.eyebrow}>{t.brand}</span>
        <h1 className={ui.title}>{exam.title}</h1>
        <p className={ui.lede}>{t.startLede}</p>
        <div className={ui.stats}>
          <div className={ui.stat}>
            <span className={ui.statValue}>{questionsPerStudent(exam)}</span>
            <span className={ui.statLabel}>{t.questionsCount}</span>
          </div>
          <div className={ui.stat}>
            <span className={ui.statValue}>{Math.ceil((exam.closesAtMs - nowMs) / MS_PER_MINUTE)}</span>
            <span className={ui.statLabel}>{t.minutesLeft}</span>
          </div>
        </div>
        {startError && <p className={ui.error}>{startError}</p>}
        <button type="button" className={s.start} onClick={() => void begin()} disabled={starting}>
          {starting ? t.starting : t.startButton}
        </button>
      </div>
    </div>
  );
}

export default function ExamApp() {
  const t = useT(examDict);
  const router = useRouter();
  const auth = useAuthUser();
  const examId = querySlug(router.query.examId);

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
  if (!examId) {
    return (
      <div className={ui.centered}>
        <p className={ui.error}>{t.examNotFound}</p>
      </div>
    );
  }
  return <ExamRoom key={`${examId}:${auth.user.uid}`} user={auth.user} examId={examId} />;
}
