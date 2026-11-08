import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import {
  LEARN_COURSES,
  NEW_ITEM_SEGMENT,
  TEACHER_HOMEWORKS_PATH,
  TEACHER_HOMEWORK_NEW_PATH,
  TEACHER_PATH,
  findCourse,
  teacherHomeworkPath,
} from '../../data/learn';
import {
  DEFAULT_HOMEWORK_DAILY_GOAL,
  MAX_GRID_DAYS,
  dayKey,
  dayKeyAfter,
  dayKeysBetween,
  homeworkState,
  isDayKey,
  newRoundId,
} from '../../data/practice';
import type { Homework, HomeworkSettings, HomeworkState, PracticeQuestion, ProgressScope } from '../../data/practice';
import { practiceDict } from '../../i18n/pages/practice';
import { useLocale, useT } from '../../i18n/useT';
import { isFirebaseConfigured } from '../../lib/firebase';
import { assignedAccounts } from '../../data/course/assignment';
import StudentPicker from '../course/StudentPicker';
import { useCourseMembers } from '../course/useCourseMembers';
import DeliverableSection from '../deliverable/DeliverableSection';
import ConfirmPanel from '../exam/ConfirmPanel';
import SignInRedirect from '../learn/SignInRedirect';
import ui from '../learn/ui.module.css';
import { useTeacherStatus } from '../learn/useTeacherStatus';
import HomeworkGrid from './HomeworkGrid';
import s from './HomeworkManager.module.css';
import { homeworkDaysText, homeworkStatusText } from './format';
import type { PracticeTexts } from './format';
import { createHomework, deleteHomework, subscribeAllHomeworks, updateHomework } from './homeworks';
import PeriodSummary from './PeriodSummary';
import { byDisplayName, fetchAllStudents } from './progress';
import type { StudentStats } from './progress';
import QuestionPicker from './QuestionPicker';
import { activeQuestions, useQuestionBank } from './questions';
import { fileSlug } from './tableExport';
import { useStudentDays } from './useStudentDays';

const DEFAULT_HOMEWORK_DAYS: number = 4;

/** A round in the form: its answers per day stay text until they are validated. */
type RoundDraft = {
  id: string;
  questionIds: string[];
  goal: string;
};

/** The form's values. */
type Draft = {
  title: string;
  courseSlug: string;
  rounds: RoundDraft[];
  firstDay: string;
  lastDay: string;
  /** For everybody enrolled in the course; otherwise `assignedUids` says who. */
  everyone: boolean;
  assignedUids: string[];
};

type DraftValidation = { ok: true; settings: HomeworkSettings } | { ok: false; message: string };

type Screen = { kind: 'list' } | { kind: 'new' } | { kind: 'homework'; homeworkId: string };

function draftOf(homework: Homework | null): Draft {
  if (!homework) {
    const today = dayKey(new Date());
    return {
      title: '',
      courseSlug: LEARN_COURSES[0].slug,
      rounds: [{ id: newRoundId(), questionIds: [], goal: String(DEFAULT_HOMEWORK_DAILY_GOAL) }],
      firstDay: today,
      lastDay: dayKeyAfter(today, DEFAULT_HOMEWORK_DAYS - 1),
      everyone: true,
      assignedUids: [],
    };
  }
  return {
    title: homework.title,
    courseSlug: homework.courseSlug,
    rounds: homework.rounds.map((round) => ({ ...round, goal: String(round.goal) })),
    firstDay: homework.firstDay,
    lastDay: homework.lastDay,
    everyone: homework.assignedUids.length === 0,
    assignedUids: homework.assignedUids,
  };
}

function areDaysValid(firstDay: string, lastDay: string): boolean {
  if (!isDayKey(firstDay) || !isDayKey(lastDay) || firstDay > lastDay) return false;
  // The teacher's grid draws one column per day, up to MAX_GRID_DAYS.
  return lastDay <= dayKeyAfter(firstDay, MAX_GRID_DAYS - 1);
}

function validateDraft(draft: Draft, t: PracticeTexts): DraftValidation {
  const title = draft.title.trim();
  const rounds = draft.rounds.map((round) => ({ ...round, goal: Number(round.goal) }));
  if (title === '') return { ok: false, message: t.validationHomeworkTitle };
  if (!findCourse(draft.courseSlug) || rounds.some((round) => round.questionIds.length === 0)) {
    return { ok: false, message: t.validationHomeworkQuestions };
  }
  if (!areDaysValid(draft.firstDay, draft.lastDay)) {
    return { ok: false, message: t.validationHomeworkDays.replace('{days}', String(MAX_GRID_DAYS)) };
  }
  if (rounds.some((round) => !Number.isInteger(round.goal) || round.goal < 1)) {
    return { ok: false, message: t.validationHomeworkGoal };
  }
  if (!draft.everyone && draft.assignedUids.length === 0) return { ok: false, message: t.validationStudents };
  return {
    ok: true,
    settings: {
      title,
      courseSlug: draft.courseSlug,
      rounds,
      firstDay: draft.firstDay,
      lastDay: draft.lastDay,
      assignedUids: draft.everyone ? [] : draft.assignedUids,
    },
  };
}

/** Two rounds may ask the same question: it is counted once. */
function questionCount(homework: Homework): number {
  return new Set(homework.rounds.flatMap((round) => round.questionIds)).size;
}

function answersPerDay(homework: Homework): number {
  return homework.rounds.reduce((sum, round) => sum + round.goal, 0);
}

type RoundEditorProps = {
  /** 1 for the first round. */
  number: number;
  round: RoundDraft;
  courseSlug: string;
  questions: readonly PracticeQuestion[];
  isOpen: boolean;
  /** A homework keeps at least one round. */
  isOnlyRound: boolean;
  onToggle: () => void;
  onChange: (round: RoundDraft) => void;
  onDuplicate: () => void;
  onRemove: () => void;
};

/** One round of the form. Only the open one shows its picker: a homework may have many. */
function RoundEditor({
  number,
  round,
  courseSlug,
  questions,
  isOpen,
  isOnlyRound,
  onToggle,
  onChange,
  onDuplicate,
  onRemove,
}: RoundEditorProps) {
  const t = useT(practiceDict);

  return (
    <div className={s.round}>
      <div className={s.roundHead}>
        <button type="button" className={s.roundToggle} onClick={onToggle} aria-expanded={isOpen}>
          <span className={s.roundName}>
            {isOpen ? '▾' : '▸'} {t.roundLabel} {number}
          </span>
          <span className={ui.mono}>
            {t.roundSummary
              .replace('{questions}', String(round.questionIds.length))
              .replace('{answers}', round.goal)}
          </span>
        </button>
        <button type="button" className={s.duplicate} onClick={onDuplicate}>
          {t.duplicateRound}
        </button>
        <button type="button" className={s.remove} onClick={onRemove} disabled={isOnlyRound} aria-label={t.removeRound}>
          ×
        </button>
      </div>

      {isOpen && (
        <>
          <label className={s.goalField}>
            <span className={ui.label}>{t.homeworkDailyGoalLabel}</span>
            <input
              className={ui.input}
              type="number"
              min={1}
              value={round.goal}
              onChange={(event) => onChange({ ...round, goal: event.target.value })}
            />
          </label>
          {/* Exam-only questions are left out: students cannot read that bank. */}
          <QuestionPicker
            // Its class filter belongs to the course: another course starts it over.
            key={courseSlug}
            hideCourse
            courseSlug={courseSlug}
            questionIds={round.questionIds}
            onChange={(_courseSlug, questionIds) => onChange({ ...round, questionIds })}
            questions={questions}
          />
        </>
      )}
    </div>
  );
}

type HomeworkFormProps = {
  homework: Homework | null;
  /** Null for a homework not saved yet. Over: nothing can change. Open: saving asks first. */
  state: HomeworkState | null;
  /** After the homework is deleted: back to the list. */
  onDeleted: () => void;
  /** After a new homework is saved: to its own page. */
  onCreated: (homeworkId: string) => void;
};

function HomeworkForm({ homework, state, onDeleted, onCreated }: HomeworkFormProps) {
  const t = useT(practiceDict);
  const bank = useQuestionBank();
  const [draft, setDraft] = useState<Draft>(() => draftOf(homework));
  // A homework with a single round opens on it, the way the form looked before rounds existed.
  const [openRoundId, setOpenRoundId] = useState<string | null>(() =>
    draft.rounds.length === 1 ? draft.rounds[0].id : null
  );
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [confirmingSave, setConfirmingSave] = useState(false);
  const isFinished = state === 'finished';
  const isOpen = state === 'open';

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
      console.error('Homework action failed', error);
      setMessage(t.errorGeneric);
    } finally {
      setBusy(false);
      setConfirmingDelete(false);
      setConfirmingSave(false);
    }
  }

  function persist(settings: HomeworkSettings) {
    if (homework) void run(() => updateHomework(homework.id, settings), null);
    else void run(() => createHomework(settings), onCreated);
  }

  /** An open homework is being played: saving it changes the rules mid-way, so it asks first. */
  function save() {
    const validation = validateDraft(draft, t);
    if (validation.ok === false) {
      setMessage(validation.message);
      return;
    }
    if (isOpen && !confirmingSave) {
      setConfirmingSave(true);
      return;
    }
    persist(validation.settings);
  }

  function replaceRound(changed: RoundDraft) {
    setDraft({ ...draft, rounds: draft.rounds.map((round) => (round.id === changed.id ? changed : round)) });
  }

  /** The new round starts without questions and opens, ready to pick them. */
  function addRound() {
    const lastRound = draft.rounds[draft.rounds.length - 1];
    const added: RoundDraft = { id: newRoundId(), questionIds: [], goal: lastRound.goal };
    setDraft({ ...draft, rounds: [...draft.rounds, added] });
    setOpenRoundId(added.id);
  }

  /** The copy goes right after its original, with an id of its own: its answers are counted apart. */
  function duplicateRound(index: number) {
    const copy: RoundDraft = { ...draft.rounds[index], id: newRoundId() };
    setDraft({ ...draft, rounds: [...draft.rounds.slice(0, index + 1), copy, ...draft.rounds.slice(index + 1)] });
  }

  function removeRound(roundId: string) {
    setDraft({ ...draft, rounds: draft.rounds.filter((round) => round.id !== roundId) });
  }

  return (
    <form
      className={s.form}
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
    >
      {isFinished && <p className={ui.mono}>{t.homeworkFinishedNotice}</p>}
      {isOpen && <p className={s.warning}>{t.homeworkOpenNotice}</p>}
      {/* A disabled fieldset disables every control inside, the question picker's included. */}
      <fieldset className={isFinished ? s.fieldsFinished : s.fields} disabled={isFinished}>
        <label className={ui.field}>
          <span className={ui.label}>{t.homeworkTitleLabel}</span>
          <input
            className={ui.input}
            type="text"
            value={draft.title}
            onChange={(event) => setDraft({ ...draft, title: event.target.value })}
          />
        </label>

        <label className={ui.field}>
          <span className={ui.label}>{t.colCourse}</span>
          <select
            className={s.select}
            value={draft.courseSlug}
            // The questions and the students belong to a course: another course starts every
            // round with none ticked and with everybody again.
            onChange={(event) =>
              setDraft({
                ...draft,
                courseSlug: event.target.value,
                rounds: draft.rounds.map((round) => ({ ...round, questionIds: [] })),
                everyone: true,
                assignedUids: [],
              })
            }
          >
            {LEARN_COURSES.map((course) => (
              <option key={course.slug} value={course.slug}>
                {course.title}
              </option>
            ))}
          </select>
        </label>

        <StudentPicker
          key={draft.courseSlug}
          courseSlug={draft.courseSlug}
          everyone={draft.everyone}
          assignedUids={draft.assignedUids}
          onChange={(everyone, assignedUids) => setDraft({ ...draft, everyone, assignedUids })}
        />

        <div className={ui.field}>
          <span className={ui.label}>{t.colRounds}</span>
          <div className={s.rounds}>
            {draft.rounds.map((round, index) => (
              <RoundEditor
                key={round.id}
                number={index + 1}
                round={round}
                courseSlug={draft.courseSlug}
                questions={activeQuestions(bank)}
                isOpen={round.id === openRoundId}
                isOnlyRound={draft.rounds.length === 1}
                onToggle={() => setOpenRoundId(round.id === openRoundId ? null : round.id)}
                onChange={replaceRound}
                onDuplicate={() => duplicateRound(index)}
                onRemove={() => removeRound(round.id)}
              />
            ))}
          </div>
          <button type="button" className={s.add} onClick={addRound}>
            + {t.addRound}
          </button>
        </div>

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
        </div>
      </fieldset>

      {message && <p className={ui.error}>{message}</p>}
      {notice && <p className={ui.notice}>{notice}</p>}

      {homework && confirmingDelete ? (
        <ConfirmPanel
          message={t.confirmDeleteHomework}
          confirmLabel={t.deleteHomework}
          busy={busy}
          onConfirm={() => void run(() => deleteHomework(homework.id), onDeleted)}
          onCancel={() => setConfirmingDelete(false)}
        />
      ) : confirmingSave ? (
        <ConfirmPanel
          message={t.confirmSaveOpenHomework}
          confirmLabel={t.save}
          busy={busy}
          onConfirm={save}
          onCancel={() => setConfirmingSave(false)}
        />
      ) : (
        <div className={s.actions}>
          {!isFinished && (
            <button type="submit" className={s.primary} disabled={busy}>
              {busy ? t.saving : t.save}
            </button>
          )}
          {homework && (
            <button type="button" className={s.delete} onClick={() => setConfirmingDelete(true)} disabled={busy}>
              {t.deleteHomework}
            </button>
          )}
        </div>
      )}
    </form>
  );
}

type HomeworkProgressProps = {
  students: StudentStats[];
  homework: Homework;
};

/** What every student did in one homework: the summary to grade it and the grid of its days. */
function HomeworkProgress({ students, homework }: HomeworkProgressProps) {
  const members = useCourseMembers(homework.courseSlug);
  // The students the homework is for. One array per membership list, or the days would be
  // fetched again on every render.
  const assignedStudents = useMemo(() => {
    if (members === null) return [];
    const assigned = new Set(assignedAccounts(homework, members).map((account) => account.uid));
    return students.filter((student) => assigned.has(student.uid));
  }, [homework, members, students]);
  const daysByStudent = useStudentDays(assignedStudents);
  const scope: ProgressScope = { kind: 'homework', homework };
  const days = dayKeysBetween(homework.firstDay, homework.lastDay);
  const studentsByName = [...assignedStudents].sort(byDisplayName);

  return (
    <>
      <PeriodSummary
        key={homework.id}
        students={studentsByName}
        daysByStudent={daysByStudent}
        days={days}
        scope={scope}
        selectionKey={`hw-${homework.id}`}
        fileName={`deber_${fileSlug(homework.title)}`}
      />
      <HomeworkGrid students={studentsByName} daysByStudent={daysByStudent} days={days} scope={scope} />
    </>
  );
}

/** The route decides the screen: the list, the form of a new homework, or one homework by its id. */
function screenOf(homeworkIdParam: string | string[] | undefined): Screen {
  if (typeof homeworkIdParam !== 'string') return { kind: 'list' };
  return homeworkIdParam === NEW_ITEM_SEGMENT ? { kind: 'new' } : { kind: 'homework', homeworkId: homeworkIdParam };
}

function Homeworks() {
  const t = useT(practiceDict);
  const locale = useLocale();
  const router = useRouter();
  const [homeworks, setHomeworks] = useState<Homework[] | null>(null);
  const [students, setStudents] = useState<StudentStats[] | null>(null);
  const [failed, setFailed] = useState(false);
  const screen = screenOf(router.query.homeworkId);
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
  // The route's id arrives with the router; until then nothing says which screen this is.
  if (!router.isReady || !homeworks) {
    return (
      <div className={ui.centered}>
        <span className={ui.mono}>{t.loading}</span>
      </div>
    );
  }

  function goToList(): void {
    void router.push(TEACHER_HOMEWORKS_PATH);
  }

  if (screen.kind === 'homework' && !shownHomework) {
    return (
      <div className={s.wrap}>
        <button type="button" className={s.back} onClick={goToList}>
          ← {t.backToHomeworks}
        </button>
        <p className={ui.error}>{t.homeworkNotFound}</p>
      </div>
    );
  }

  if (screen.kind === 'new' || shownHomework) {
    return (
      <div className={s.wrap}>
        <button type="button" className={s.back} onClick={goToList}>
          ← {t.backToHomeworks}
        </button>
        <div className={s.heading}>
          <span className={ui.eyebrow}>
            {shownHomework
              ? `${homeworkDaysText(shownHomework, locale)} · ${homeworkStatusText(shownHomework, today, t)}`
              : t.homeworksTitle}
          </span>
          <h1 className={ui.title}>{shownHomework ? shownHomework.title : t.newHomework}</h1>
        </div>
        {shownHomework && students && students.length > 0 && (
          <HomeworkProgress students={students} homework={shownHomework} />
        )}
        <HomeworkForm
          key={shownHomework?.id ?? NEW_ITEM_SEGMENT}
          homework={shownHomework ?? null}
          state={shownHomework ? homeworkState(shownHomework, today) : null}
          onDeleted={goToList}
          onCreated={(homeworkId) => void router.replace(teacherHomeworkPath(homeworkId))}
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
      <div className={ui.sectionHead}>
        <h2 className={ui.sectionTitle}>{t.multipleOptionHomeworksSection}</h2>
        <button type="button" className={s.primary} onClick={() => void router.push(TEACHER_HOMEWORK_NEW_PATH)}>
          + {t.newHomework}
        </button>
      </div>
      <div className={s.card}>
        {homeworks.length === 0 ? (
          <p className={s.empty}>{t.noHomeworks}</p>
        ) : (
          <div className={ui.tableWrap}>
            <table className={s.list}>
              <thead>
                <tr>
                  <th className={s.titleCell} title={t.colTitle}>
                    {t.colTitle}
                  </th>
                  <th className={s.courseCell} title={t.colCourse}>
                    {t.colCourse}
                  </th>
                  <th className={s.daysCell} title={t.colDays}>
                    {t.colDays}
                  </th>
                  <th className={`${ui.num} ${s.countCell}`} title={t.colRounds}>
                    {t.colRounds}
                  </th>
                  <th className={`${ui.num} ${s.countCell}`} title={t.colQuestions}>
                    {t.colQuestions}
                  </th>
                  <th className={`${ui.num} ${s.countCell}`} title={t.colDailyGoal}>
                    {t.colDailyGoal}
                  </th>
                  <th className={s.statusCell} title={t.colStatus}>
                    {t.colStatus}
                  </th>
                </tr>
              </thead>
              <tbody>
                {homeworks.map((homework) => {
                  const courseTitle = findCourse(homework.courseSlug)?.title ?? homework.courseSlug;
                  const days = homeworkDaysText(homework, locale);
                  const status = homeworkStatusText(homework, today, t);
                  return (
                    <tr
                      key={homework.id}
                      className={s.row}
                      onClick={() => void router.push(teacherHomeworkPath(homework.id))}
                    >
                      <td className={s.titleCell} title={homework.title}>
                        {homework.title}
                      </td>
                      <td className={s.courseCell} title={courseTitle}>
                        {courseTitle}
                      </td>
                      <td className={s.daysCell} title={days}>
                        {days}
                      </td>
                      <td className={`${ui.num} ${s.countCell}`}>{homework.rounds.length}</td>
                      <td className={`${ui.num} ${s.countCell}`}>{questionCount(homework)}</td>
                      <td className={`${ui.num} ${s.countCell}`}>{answersPerDay(homework)}</td>
                      <td className={s.statusCell} title={status}>
                        {status}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <DeliverableSection role="homework" />
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
