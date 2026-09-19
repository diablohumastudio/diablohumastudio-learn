import Link from 'next/link';
import { useEffect, useState } from 'react';
import { isExamRunning, questionsPerStudent } from '../../data/exam/types';
import type { Exam, ExamAttempt, ExamGrade, ExamSettings } from '../../data/exam/types';
import { LEARN_COURSES, TEACHER_PATH, examPath, findClass, findCourse, practiceScope, scopeTopics } from '../../data/learn';
import type { PracticeScope } from '../../data/learn';
import { questionsInScope } from '../../data/practice';
import type { Locale } from '../../i18n/locales';
import { examDict } from '../../i18n/pages/exam';
import { useLocale, useT } from '../../i18n/useT';
import { isFirebaseConfigured } from '../../lib/firebase';
import SignInRedirect from '../learn/SignInRedirect';
import ui from '../learn/ui.module.css';
import { useTeacherStatus } from '../learn/useTeacherStatus';
import { activeQuestions, useQuestionBank } from '../practice/questions';
import AttemptReplay from './AttemptReplay';
import ConfirmPanel from './ConfirmPanel';
import s from './ExamManager.module.css';
import {
  closeExam,
  createDraft,
  deleteDraft,
  openExam,
  subscribeAllExams,
  subscribeAttempts,
  subscribeGrades,
  updateDraft,
} from './exams';
import { dateTimeText, durationText, examErrorText } from './format';
import type { ExamTexts } from './format';

const SCOPE_VALUE_SEPARATOR: string = '/';
const DEFAULT_MAX_QUESTIONS: string = '10';
const DEFAULT_DURATION_MINUTES: string = '15';
const RUNNING_CHECK_MS: number = 1000;

type Draft = {
  title: string;
  scopeValue: string;
  maxQuestions: string;
  durationMinutes: string;
};

type DraftValidation = { ok: true; settings: ExamSettings } | { ok: false; message: string };

type Screen = { kind: 'list' } | { kind: 'new' } | { kind: 'exam'; examId: string };

function scopeValue(scope: PracticeScope): string {
  return [scope.courseSlug, scope.classSlug].filter(Boolean).join(SCOPE_VALUE_SEPARATOR);
}

function scopeFromValue(value: string): PracticeScope {
  const [courseSlug, classSlug] = value.split(SCOPE_VALUE_SEPARATOR);
  return practiceScope(courseSlug, classSlug);
}

function scopeTitle(exam: Exam, locale: Locale, t: ExamTexts): string {
  const course = findCourse(exam.courseSlug ?? undefined);
  if (!course) return t.allCourses;
  const learnClass = findClass(course, exam.classSlug ?? undefined);
  return learnClass ? `${course.title} · ${learnClass.title[locale]}` : `${course.title} · ${t.wholeCourse}`;
}

function draftOf(exam: Exam | null): Draft {
  if (!exam) {
    return { title: '', scopeValue: '', maxQuestions: DEFAULT_MAX_QUESTIONS, durationMinutes: DEFAULT_DURATION_MINUTES };
  }
  return {
    title: exam.title,
    scopeValue: scopeValue({ courseSlug: exam.courseSlug ?? undefined, classSlug: exam.classSlug ?? undefined }),
    maxQuestions: String(exam.maxQuestions),
    durationMinutes: String(exam.durationMinutes),
  };
}

function validateDraft(draft: Draft, t: ExamTexts): DraftValidation {
  const title = draft.title.trim();
  const maxQuestions = Number(draft.maxQuestions);
  const durationMinutes = Number(draft.durationMinutes);
  const scope = scopeFromValue(draft.scopeValue);
  if (title === '') return { ok: false, message: t.validationTitle };
  if (!Number.isInteger(maxQuestions) || maxQuestions < 1 || !Number.isInteger(durationMinutes) || durationMinutes < 1) {
    return { ok: false, message: t.validationNumbers };
  }
  return {
    ok: true,
    settings: {
      title,
      courseSlug: scope.courseSlug ?? null,
      classSlug: scope.classSlug ?? null,
      topics: scopeTopics(scope),
      maxQuestions,
      durationMinutes,
    },
  };
}

function useIsRunning(exam: Exam): boolean {
  const [running, setRunning] = useState(() => isExamRunning(exam, Date.now()));
  useEffect(() => {
    setRunning(isExamRunning(exam, Date.now()));
    const interval = window.setInterval(() => setRunning(isExamRunning(exam, Date.now())), RUNNING_CHECK_MS);
    return () => window.clearInterval(interval);
  }, [exam]);
  return running;
}

type DraftFormProps = {
  exam: Exam | null;
  onDone: () => void;
};

function DraftForm({ exam, onDone }: DraftFormProps) {
  const t = useT(examDict);
  const locale = useLocale();
  const bank = useQuestionBank();
  const [draft, setDraft] = useState<Draft>(() => draftOf(exam));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<'open' | 'delete' | null>(null);
  const inScopeCount = questionsInScope(activeQuestions(bank), scopeFromValue(draft.scopeValue)).length;

  async function run(action: () => Promise<unknown>, leaveAfter: boolean) {
    setBusy(true);
    setMessage(null);
    setNotice(null);
    try {
      await action();
      if (leaveAfter) onDone();
      else setNotice(t.savedNotice);
    } catch (error) {
      console.error('Exam action failed', error);
      setMessage(examErrorText(error, t));
    } finally {
      setBusy(false);
      setConfirming(null);
    }
  }

  function save() {
    const validation = validateDraft(draft, t);
    if (validation.ok === false) {
      setMessage(validation.message);
      return;
    }
    void run(() => (exam ? updateDraft(exam.id, validation.settings) : createDraft(validation.settings)), !exam);
  }

  /* Saves first, so the exam that opens is the one on screen. It stays on this screen: the
     subscription turns it into the opened view. */
  function open(draftExam: Exam) {
    const validation = validateDraft(draft, t);
    if (validation.ok === false) {
      setMessage(validation.message);
      setConfirming(null);
      return;
    }
    void run(async () => {
      await updateDraft(draftExam.id, validation.settings);
      await openExam(draftExam.id);
    }, false);
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

      <label className={ui.field}>
        <span className={ui.label}>{t.scopeLabel}</span>
        <select
          className={s.select}
          value={draft.scopeValue}
          onChange={(event) => setDraft({ ...draft, scopeValue: event.target.value })}
        >
          <option value="">{t.allCourses}</option>
          {LEARN_COURSES.map((course) => (
            <optgroup key={course.slug} label={course.title}>
              <option value={scopeValue({ courseSlug: course.slug })}>
                {course.title} · {t.wholeCourse}
              </option>
              {course.classes.map((learnClass) => (
                <option key={learnClass.slug} value={scopeValue({ courseSlug: course.slug, classSlug: learnClass.slug })}>
                  {learnClass.title[locale]}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <span className={ui.mono}>
          {bank.status === 'ready' ? inScopeCount : '…'} {t.inScope}
        </span>
      </label>

      <div className={s.numbers}>
        <label className={ui.field}>
          <span className={ui.label}>{t.maxQuestionsLabel}</span>
          <input
            className={ui.input}
            type="number"
            min={1}
            value={draft.maxQuestions}
            onChange={(event) => setDraft({ ...draft, maxQuestions: event.target.value })}
          />
        </label>
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
      </div>

      {message && <p className={ui.error}>{message}</p>}
      {notice && <p className={ui.notice}>{notice}</p>}

      {exam && confirming === 'open' && (
        <ConfirmPanel
          message={t.confirmOpen}
          confirmLabel={busy ? t.opening : t.confirmOpenButton}
          busy={busy}
          onConfirm={() => open(exam)}
          onCancel={() => setConfirming(null)}
        />
      )}
      {exam && confirming === 'delete' && (
        <ConfirmPanel
          message={t.confirmDelete}
          confirmLabel={t.confirmDeleteButton}
          busy={busy}
          onConfirm={() => void run(() => deleteDraft(exam.id), true)}
          onCancel={() => setConfirming(null)}
        />
      )}
      {confirming === null && (
        <div className={s.actions}>
          <button type="submit" className={exam ? s.secondary : s.primary} disabled={busy}>
            {busy ? t.saving : t.save}
          </button>
          {exam && (
            <>
              <button type="button" className={s.primary} onClick={() => setConfirming('open')} disabled={busy}>
                {t.open}
              </button>
              <button type="button" className={s.ghost} onClick={() => setConfirming('delete')} disabled={busy}>
                {t.deleteDraft}
              </button>
            </>
          )}
        </div>
      )}
    </form>
  );
}

function OpenedExam({ exam }: { exam: Exam }) {
  const t = useT(examDict);
  const locale = useLocale();
  const running = useIsRunning(exam);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [grades, setGrades] = useState<ExamGrade[]>([]);
  const [replayUid, setReplayUid] = useState<string | null>(null);
  const [confirmingClose, setConfirmingClose] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const replayAttempt = attempts.find((attempt) => attempt.uid === replayUid);
  const replayGrade = grades.find((grade) => grade.uid === replayUid);

  useEffect(() => {
    const stopAttempts = subscribeAttempts(exam.id, setAttempts, (error) => console.error('Could not load the attempts', error));
    const stopGrades = subscribeGrades(exam.id, setGrades, (error) => console.error('Could not load the grades', error));
    return () => {
      stopAttempts();
      stopGrades();
    };
  }, [exam.id]);

  async function close() {
    setBusy(true);
    setMessage(null);
    try {
      await closeExam(exam.id);
    } catch (error) {
      console.error('Could not close the exam', error);
      setMessage(examErrorText(error, t));
    } finally {
      setBusy(false);
      setConfirmingClose(false);
    }
  }

  if (replayAttempt) {
    return (
      <>
        <button type="button" className={s.back} onClick={() => setReplayUid(null)}>
          ← {t.backToAttempts}
        </button>
        <div className={s.summary}>
          <span className={s.name}>{replayAttempt.displayName || replayAttempt.email}</span>
          <span className={ui.mono}>{replayAttempt.email}</span>
          <span className={ui.mono}>
            {t.attemptStarted}: {dateTimeText(replayAttempt.startedAtMs, locale)} · {t.attemptSubmitted}:{' '}
            {dateTimeText(replayAttempt.submittedAtMs, locale)}
          </span>
          {replayGrade && (
            <span className={s.name}>
              {t.colScore}: {replayGrade.score} / {replayGrade.total}
            </span>
          )}
          {replayAttempt.late && (
            <span className={ui.error}>
              {t.lateNote} {durationText(replayAttempt.lateBySeconds)}
            </span>
          )}
        </div>
        <AttemptReplay
          questions={replayAttempt.questions}
          answers={replayAttempt.answers}
          correctOptionIds={replayGrade?.correctOptionIds ?? {}}
        />
      </>
    );
  }

  return (
    <>
      <div className={s.summary}>
        <span className={running ? s.running : ui.mono}>
          {running ? `${t.stateRunning} · ${t.closesAt}` : `${t.stateFinished} · ${t.closedAt}`}{' '}
          {dateTimeText(exam.closesAtMs, locale)}
        </span>
        <span className={ui.mono}>
          {questionsPerStudent(exam)} {t.colQuestions.toLowerCase()} · {exam.durationMinutes} {t.colMinutes.toLowerCase()}
        </span>
        <span className={ui.mono}>
          {t.studentLink}:{' '}
          <Link href={examPath(exam.id)} className={s.link}>
            {examPath(exam.id)}
          </Link>
        </span>
        {running && <span className={ui.notice}>{t.practicePausedNote}</span>}
      </div>

      {message && <p className={ui.error}>{message}</p>}
      {running &&
        (confirmingClose ? (
          <ConfirmPanel
            message={t.confirmClose}
            confirmLabel={t.confirmCloseButton}
            busy={busy}
            onConfirm={() => void close()}
            onCancel={() => setConfirmingClose(false)}
          />
        ) : (
          <button type="button" className={s.secondary} onClick={() => setConfirmingClose(true)}>
            {t.closeEarly}
          </button>
        ))}

      <div className={s.card}>
        {attempts.length === 0 ? (
          <p className={s.empty}>{t.noAttempts}</p>
        ) : (
          <div className={ui.tableWrap}>
            <table className={ui.table}>
              <thead>
                <tr>
                  <th>{t.colStudent}</th>
                  <th>{t.colAttempt}</th>
                  <th className={ui.num}>{t.colScore}</th>
                  <th className={ui.num}>{t.colLate}</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((attempt) => {
                  const grade = grades.find((candidate) => candidate.uid === attempt.uid);
                  return (
                    <tr key={attempt.uid} className={s.row} onClick={() => setReplayUid(attempt.uid)}>
                      <td>
                        <span className={s.name}>{attempt.displayName || attempt.email}</span>
                        <span className={s.email}>{attempt.email}</span>
                      </td>
                      <td>{attempt.status === 'submitted' ? t.attemptSubmitted : t.attemptStarted}</td>
                      <td className={ui.num}>{grade ? `${grade.score} / ${grade.total}` : '–'}</td>
                      <td className={attempt.late ? `${ui.num} ${s.late}` : ui.num}>
                        {attempt.late ? durationText(attempt.lateBySeconds) : '–'}
                      </td>
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

function Exams() {
  const t = useT(examDict);
  const locale = useLocale();
  const [exams, setExams] = useState<Exam[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [screen, setScreen] = useState<Screen>({ kind: 'list' });
  const shownExam = screen.kind === 'exam' ? exams?.find((exam) => exam.id === screen.examId) : undefined;

  useEffect(
    () =>
      subscribeAllExams(setExams, (error) => {
        console.error('Could not load the exams', error);
        setFailed(true);
      }),
    []
  );

  if (failed) {
    return (
      <div className={ui.centered}>
        <p className={ui.error}>{t.errorGeneric}</p>
      </div>
    );
  }
  if (!exams) {
    return (
      <div className={ui.centered}>
        <span className={ui.mono}>{t.loading}</span>
      </div>
    );
  }

  if (screen.kind === 'new' || shownExam) {
    return (
      <div className={s.wrap}>
        <button type="button" className={s.back} onClick={() => setScreen({ kind: 'list' })}>
          ← {t.backToExams}
        </button>
        <div className={s.heading}>
          <span className={ui.eyebrow}>{shownExam ? scopeTitle(shownExam, locale, t) : t.managerTitle}</span>
          <h1 className={ui.title}>{shownExam ? shownExam.title : t.newExam}</h1>
        </div>
        {shownExam && shownExam.status === 'opened' ? (
          <OpenedExam exam={shownExam} />
        ) : (
          <DraftForm key={shownExam?.id ?? 'new'} exam={shownExam ?? null} onDone={() => setScreen({ kind: 'list' })} />
        )}
      </div>
    );
  }

  return (
    <div className={s.wrap}>
      <Link href={TEACHER_PATH} className={ui.backLink}>
        ← {t.backToTeacher}
      </Link>
      <div className={s.heading}>
        <span className={ui.eyebrow}>{t.brand}</span>
        <h1 className={ui.title}>{t.managerTitle}</h1>
      </div>
      <div className={s.actions}>
        <button type="button" className={s.primary} onClick={() => setScreen({ kind: 'new' })}>
          + {t.newExam}
        </button>
      </div>
      <div className={s.card}>
        {exams.length === 0 ? (
          <p className={s.empty}>{t.noExams}</p>
        ) : (
          <div className={ui.tableWrap}>
            <table className={ui.table}>
              <thead>
                <tr>
                  <th>{t.colTitle}</th>
                  <th>{t.colScope}</th>
                  <th className={ui.num}>{t.colQuestions}</th>
                  <th className={ui.num}>{t.colMinutes}</th>
                  <th>{t.colStatus}</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => (
                  <tr key={exam.id} className={s.row} onClick={() => setScreen({ kind: 'exam', examId: exam.id })}>
                    <td className={s.name}>{exam.title}</td>
                    <td>{scopeTitle(exam, locale, t)}</td>
                    <td className={ui.num}>{exam.maxQuestions}</td>
                    <td className={ui.num}>{exam.durationMinutes}</td>
                    <td>
                      <ExamStatusText exam={exam} />
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

function ExamStatusText({ exam }: { exam: Exam }) {
  const t = useT(examDict);
  const running = useIsRunning(exam);
  if (exam.status === 'draft') return <>{t.statusDraft}</>;
  return running ? <span className={s.running}>{t.stateRunning}</span> : <>{t.stateFinished}</>;
}

export default function ExamManager() {
  const t = useT(examDict);
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
  return <Exams />;
}
