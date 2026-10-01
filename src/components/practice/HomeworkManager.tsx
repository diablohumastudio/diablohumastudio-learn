import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LEARN_COURSES, TEACHER_PATH, findCourse } from '../../data/learn';
import {
  DEFAULT_HOMEWORK_DAILY_GOAL,
  MAX_GRID_DAYS,
  dayKey,
  dayKeyAfter,
  dayText,
  isDayKey,
  isHomeworkOpen,
} from '../../data/practice';
import type { Homework, HomeworkSettings } from '../../data/practice';
import type { Locale } from '../../i18n/locales';
import { practiceDict } from '../../i18n/pages/practice';
import { useLocale, useT } from '../../i18n/useT';
import { isFirebaseConfigured } from '../../lib/firebase';
import ConfirmPanel from '../exam/ConfirmPanel';
import SignInRedirect from '../learn/SignInRedirect';
import ui from '../learn/ui.module.css';
import { useTeacherStatus } from '../learn/useTeacherStatus';
import HomeworkGrid from './HomeworkGrid';
import s from './HomeworkManager.module.css';
import { createHomework, deleteHomework, subscribeAllHomeworks, updateHomework } from './homeworks';
import { fetchAllStudents } from './progress';
import type { StudentStats } from './progress';
import QuestionPicker from './QuestionPicker';
import { activeQuestions, useQuestionBank } from './questions';

const DEFAULT_HOMEWORK_DAYS: number = 4;

type PracticeTexts = Record<keyof typeof practiceDict.en, string>;

/** The form's values: numbers stay text until they are validated. */
type Draft = {
  title: string;
  courseSlug: string;
  questionIds: string[];
  firstDay: string;
  lastDay: string;
  dailyGoal: string;
};

type DraftValidation = { ok: true; settings: HomeworkSettings } | { ok: false; message: string };

type Screen = { kind: 'list' } | { kind: 'new' } | { kind: 'homework'; homeworkId: string };

function draftOf(homework: Homework | null): Draft {
  if (!homework) {
    const today = dayKey(new Date());
    return {
      title: '',
      courseSlug: LEARN_COURSES[0].slug,
      questionIds: [],
      firstDay: today,
      lastDay: dayKeyAfter(today, DEFAULT_HOMEWORK_DAYS - 1),
      dailyGoal: String(DEFAULT_HOMEWORK_DAILY_GOAL),
    };
  }
  return {
    title: homework.title,
    courseSlug: homework.courseSlug,
    questionIds: homework.questionIds,
    firstDay: homework.firstDay,
    lastDay: homework.lastDay,
    dailyGoal: String(homework.dailyGoal),
  };
}

function areDaysValid(firstDay: string, lastDay: string): boolean {
  if (!isDayKey(firstDay) || !isDayKey(lastDay) || firstDay > lastDay) return false;
  // The teacher's grid draws one column per day, up to MAX_GRID_DAYS.
  return lastDay <= dayKeyAfter(firstDay, MAX_GRID_DAYS - 1);
}

function validateDraft(draft: Draft, t: PracticeTexts): DraftValidation {
  const title = draft.title.trim();
  const dailyGoal = Number(draft.dailyGoal);
  if (title === '') return { ok: false, message: t.validationHomeworkTitle };
  if (!findCourse(draft.courseSlug) || draft.questionIds.length === 0) {
    return { ok: false, message: t.validationHomeworkQuestions };
  }
  if (!areDaysValid(draft.firstDay, draft.lastDay)) {
    return { ok: false, message: t.validationHomeworkDays.replace('{days}', String(MAX_GRID_DAYS)) };
  }
  if (!Number.isInteger(dailyGoal) || dailyGoal < 1) return { ok: false, message: t.validationHomeworkGoal };
  return {
    ok: true,
    settings: {
      title,
      courseSlug: draft.courseSlug,
      questionIds: draft.questionIds,
      firstDay: draft.firstDay,
      lastDay: draft.lastDay,
      dailyGoal,
    },
  };
}

function daysText(homework: Homework, locale: Locale): string {
  return `${dayText(homework.firstDay, locale)} – ${dayText(homework.lastDay, locale)}`;
}

function statusText(homework: Homework, today: string, t: PracticeTexts): string {
  if (isHomeworkOpen(homework, today)) return t.homeworkOpen;
  return today < homework.firstDay ? t.homeworkUpcoming : t.homeworkFinished;
}

type HomeworkFormProps = {
  homework: Homework | null;
  onDone: () => void;
};

function HomeworkForm({ homework, onDone }: HomeworkFormProps) {
  const t = useT(practiceDict);
  const bank = useQuestionBank();
  const [draft, setDraft] = useState<Draft>(() => draftOf(homework));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  async function run(action: () => Promise<void>, leaveAfter: boolean) {
    setBusy(true);
    setMessage(null);
    setNotice(null);
    try {
      await action();
      if (leaveAfter) onDone();
      else setNotice(t.savedNotice);
    } catch (error) {
      console.error('Homework action failed', error);
      setMessage(t.errorGeneric);
    } finally {
      setBusy(false);
      setConfirmingDelete(false);
    }
  }

  function save() {
    const validation = validateDraft(draft, t);
    if (validation.ok === false) {
      setMessage(validation.message);
      return;
    }
    void run(
      () => (homework ? updateHomework(homework.id, validation.settings) : createHomework(validation.settings)),
      !homework
    );
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
        <span className={ui.label}>{t.homeworkTitleLabel}</span>
        <input
          className={ui.input}
          type="text"
          value={draft.title}
          onChange={(event) => setDraft({ ...draft, title: event.target.value })}
        />
      </label>

      {/* Exam-only questions are left out: students cannot read that bank. */}
      <QuestionPicker
        courseSlug={draft.courseSlug}
        questionIds={draft.questionIds}
        onChange={(courseSlug, questionIds) => setDraft({ ...draft, courseSlug, questionIds })}
        questions={activeQuestions(bank)}
      />

      <div className={s.numbers}>
        <label className={ui.field}>
          <span className={ui.label}>{t.homeworkFirstDay}</span>
          <input
            className={s.dateInput}
            type="date"
            value={draft.firstDay}
            onChange={(event) => setDraft({ ...draft, firstDay: event.target.value })}
          />
        </label>
        <label className={ui.field}>
          <span className={ui.label}>{t.homeworkLastDay}</span>
          <input
            className={s.dateInput}
            type="date"
            value={draft.lastDay}
            min={draft.firstDay}
            onChange={(event) => setDraft({ ...draft, lastDay: event.target.value })}
          />
        </label>
        <label className={ui.field}>
          <span className={ui.label}>{t.homeworkDailyGoalLabel}</span>
          <input
            className={ui.input}
            type="number"
            min={1}
            value={draft.dailyGoal}
            onChange={(event) => setDraft({ ...draft, dailyGoal: event.target.value })}
          />
        </label>
      </div>

      {message && <p className={ui.error}>{message}</p>}
      {notice && <p className={ui.notice}>{notice}</p>}

      {homework && confirmingDelete ? (
        <ConfirmPanel
          message={t.confirmDeleteHomework}
          confirmLabel={t.deleteHomework}
          busy={busy}
          onConfirm={() => void run(() => deleteHomework(homework.id), true)}
          onCancel={() => setConfirmingDelete(false)}
        />
      ) : (
        <div className={s.actions}>
          <button type="submit" className={s.primary} disabled={busy}>
            {busy ? t.saving : t.save}
          </button>
          {homework && (
            <button type="button" className={s.ghost} onClick={() => setConfirmingDelete(true)} disabled={busy}>
              {t.deleteHomework}
            </button>
          )}
        </div>
      )}
    </form>
  );
}

function Homeworks() {
  const t = useT(practiceDict);
  const locale = useLocale();
  const [homeworks, setHomeworks] = useState<Homework[] | null>(null);
  const [students, setStudents] = useState<StudentStats[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [screen, setScreen] = useState<Screen>({ kind: 'list' });
  const today = dayKey(new Date());
  const shownHomework =
    screen.kind === 'homework' ? homeworks?.find((homework) => homework.id === screen.homeworkId) : undefined;

  useEffect(
    () =>
      subscribeAllHomeworks(setHomeworks, (error) => {
        console.error('Could not load the homeworks', error);
        setFailed(true);
      }),
    []
  );

  useEffect(() => {
    fetchAllStudents()
      .then(setStudents)
      .catch((error) => console.error('Could not load the students', error));
  }, []);

  if (failed) {
    return (
      <div className={ui.centered}>
        <p className={ui.error}>{t.homeworksLoadError}</p>
      </div>
    );
  }
  if (!homeworks) {
    return (
      <div className={ui.centered}>
        <span className={ui.mono}>{t.loading}</span>
      </div>
    );
  }

  if (screen.kind === 'new' || shownHomework) {
    return (
      <div className={s.wrap}>
        <button type="button" className={s.back} onClick={() => setScreen({ kind: 'list' })}>
          ← {t.backToHomeworks}
        </button>
        <div className={s.heading}>
          <span className={ui.eyebrow}>
            {shownHomework
              ? `${daysText(shownHomework, locale)} · ${statusText(shownHomework, today, t)}`
              : t.homeworksTitle}
          </span>
          <h1 className={ui.title}>{shownHomework ? shownHomework.title : t.newHomework}</h1>
        </div>
        {shownHomework && students && students.length > 0 && (
          <HomeworkGrid students={students} homework={shownHomework} />
        )}
        <HomeworkForm
          key={shownHomework?.id ?? 'new'}
          homework={shownHomework ?? null}
          onDone={() => setScreen({ kind: 'list' })}
        />
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
        <h1 className={ui.title}>{t.homeworksTitle}</h1>
      </div>
      <div className={s.actions}>
        <button type="button" className={s.primary} onClick={() => setScreen({ kind: 'new' })}>
          + {t.newHomework}
        </button>
      </div>
      <div className={s.card}>
        {homeworks.length === 0 ? (
          <p className={s.empty}>{t.noHomeworks}</p>
        ) : (
          <div className={ui.tableWrap}>
            <table className={ui.table}>
              <thead>
                <tr>
                  <th>{t.colTitle}</th>
                  <th>{t.colCourse}</th>
                  <th>{t.colDays}</th>
                  <th className={ui.num}>{t.colQuestions}</th>
                  <th className={ui.num}>{t.colDailyGoal}</th>
                  <th>{t.colStatus}</th>
                </tr>
              </thead>
              <tbody>
                {homeworks.map((homework) => (
                  <tr
                    key={homework.id}
                    className={s.row}
                    onClick={() => setScreen({ kind: 'homework', homeworkId: homework.id })}
                  >
                    <td className={s.name}>{homework.title}</td>
                    <td>{findCourse(homework.courseSlug)?.title ?? homework.courseSlug}</td>
                    <td>{daysText(homework, locale)}</td>
                    <td className={ui.num}>{homework.questionIds.length}</td>
                    <td className={ui.num}>{homework.dailyGoal}</td>
                    <td>{statusText(homework, today, t)}</td>
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

/** Teacher only: creates the specific homeworks and shows who is doing each one. */
export default function HomeworkManager() {
  const t = useT(practiceDict);
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
  return <Homeworks />;
}
