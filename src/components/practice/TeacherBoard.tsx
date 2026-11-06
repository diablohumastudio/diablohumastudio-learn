import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LEARN_COURSES, TEACHER_PATH } from '../../data/learn';
import { dayKey, dayKeysBetween, monthKeyOf, monthKeysBetween, monthRange, questionTopicTitle } from '../../data/practice';
import type { PracticeQuestion, ProgressScope } from '../../data/practice';
import { practiceDict } from '../../i18n/pages/practice';
import { useLocale, useT } from '../../i18n/useT';
import { isFirebaseConfigured } from '../../lib/firebase';
import SignInRedirect from '../learn/SignInRedirect';
import { dateText, percentText } from './format';
import HomeworkGrid from './HomeworkGrid';
import PeriodControls from './PeriodControls';
import PeriodSummary from './PeriodSummary';
import { byDisplayName, fetchAllStudents, fetchStudentQuestions, isPermissionDenied } from './progress';
import type { QuestionStats, StudentStats } from './progress';
import { useQuestionBank } from './questions';
import s from './TeacherBoard.module.css';
import ui from '../learn/ui.module.css';
import { useAuthUser } from '../learn/useAuthUser';
import { earliestDayKey, useStudentDays } from './useStudentDays';

function byLastPlayedDesc(a: StudentStats, b: StudentStats): number {
  return (b.lastPlayedAt?.toMillis() ?? 0) - (a.lastPlayedAt?.toMillis() ?? 0);
}

function byAttemptsDesc(a: QuestionStats, b: QuestionStats): number {
  return b.attempts - a.attempts;
}

function questionsById(bank: ReturnType<typeof useQuestionBank>): Map<string, PracticeQuestion> {
  if (bank.status !== 'ready') return new Map();
  return new Map(bank.questions.map((question) => [question.id, question]));
}

function StudentDetail({ student, onBack }: { student: StudentStats; onBack: () => void }) {
  const t = useT(practiceDict);
  const locale = useLocale();
  const bank = useQuestionBank();
  const [questions, setQuestions] = useState<QuestionStats[] | null>(null);
  const bankById = questionsById(bank);

  useEffect(() => {
    fetchStudentQuestions(student.uid)
      .then((loaded) => setQuestions([...loaded].sort(byAttemptsDesc)))
      .catch((error) => console.error('Could not load the student questions', error));
  }, [student.uid]);

  return (
    <div className={s.wrap}>
      <button type="button" className={s.back} onClick={onBack}>
        ← {t.backToStudents}
      </button>
      <div className={s.heading}>
        <span className={ui.eyebrow}>{t.colStudent}</span>
        <h1 className={ui.title}>{student.displayName || student.email}</h1>
      </div>
      <div className={ui.stats}>
        <div className={ui.stat}>
          <span className={ui.statValue}>{student.sessionsPlayed}</span>
          <span className={ui.statLabel}>{t.statSessions}</span>
        </div>
        <div className={ui.stat}>
          <span className={ui.statValue}>{student.totalAnswered}</span>
          <span className={ui.statLabel}>{t.statAnswered}</span>
        </div>
        <div className={ui.stat}>
          <span className={ui.statValue}>{student.totalCorrect}</span>
          <span className={ui.statLabel}>{t.statCorrect}</span>
        </div>
        <div className={ui.stat}>
          <span className={ui.statValue}>{percentText(student.totalCorrect, student.totalAnswered)}</span>
          <span className={ui.statLabel}>{t.statAccuracy}</span>
        </div>
      </div>
      <div className={s.card}>
        {questions === null || bank.status === 'loading' ? (
          <p className={s.empty}>{t.loading}</p>
        ) : questions.length === 0 ? (
          <p className={s.empty}>{t.noAnswersYet}</p>
        ) : (
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>{t.colQuestion}</th>
                  <th>{t.colTopic}</th>
                  <th className={ui.num}>{t.colAttempts}</th>
                  <th className={ui.num}>{t.colCorrect}</th>
                  <th className={ui.num}>{t.colAccuracy}</th>
                  <th>{t.colLastResult}</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((stats) => {
                  const question = bankById.get(stats.questionId);
                  return (
                    <tr key={stats.questionId}>
                      <td>{question ? question.prompt[locale] : `${t.unknownQuestion} (${stats.questionId})`}</td>
                      <td>{question ? questionTopicTitle(question, locale) ?? '' : ''}</td>
                      <td className={ui.num}>{stats.attempts}</td>
                      <td className={ui.num}>{stats.correct}</td>
                      <td className={ui.num}>{percentText(stats.correct, stats.attempts)}</td>
                      <td className={stats.lastCorrect ? s.right : s.wrong}>
                        {stats.lastCorrect ? t.resultRight : t.resultWrong}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/** The homework of a course over a period: its controls, the summary and the day grid. */
function CoursePeriod({ students }: { students: StudentStats[] }) {
  const today = dayKey(new Date());
  const [courseSlug, setCourseSlug] = useState(LEARN_COURSES[0].slug);
  const [range, setRange] = useState(() => monthRange(monthKeyOf(today), today));
  const daysByStudent = useStudentDays(students);
  const days = dayKeysBetween(range.firstDay, range.lastDay);
  const months = monthKeysBetween(monthKeyOf(earliestDayKey(daysByStudent) ?? today), monthKeyOf(today));
  const studentsByName = [...students].sort(byDisplayName);
  const scope: ProgressScope = { kind: 'daily', courseSlug };

  return (
    <>
      <PeriodControls
        courseSlug={courseSlug}
        firstDay={range.firstDay}
        lastDay={range.lastDay}
        months={months}
        today={today}
        onCourseChange={setCourseSlug}
        onRangeChange={(firstDay, lastDay) => setRange({ firstDay, lastDay })}
      />
      <PeriodSummary
        key={courseSlug}
        students={studentsByName}
        daysByStudent={daysByStudent}
        days={days}
        scope={scope}
        selectionKey={courseSlug}
        fileName={`practica_${courseSlug}_${range.firstDay}_${range.lastDay}`}
      />
      <HomeworkGrid students={studentsByName} daysByStudent={daysByStudent} days={days} scope={scope} />
    </>
  );
}

function StudentsTable() {
  const t = useT(practiceDict);
  const locale = useLocale();
  const [students, setStudents] = useState<StudentStats[] | null>(null);
  const [denied, setDenied] = useState(false);
  const [selected, setSelected] = useState<StudentStats | null>(null);

  useEffect(() => {
    fetchAllStudents()
      .then((loaded) => setStudents([...loaded].sort(byLastPlayedDesc)))
      .catch((error) => {
        if (isPermissionDenied(error)) {
          setDenied(true);
          return;
        }
        console.error('Could not load the students', error);
      });
  }, []);

  if (denied) {
    return (
      <div className={ui.centered}>
        <p className={ui.error}>{t.notAuthorized}</p>
      </div>
    );
  }
  if (selected) {
    return <StudentDetail student={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className={s.wrap}>
      <Link href={TEACHER_PATH} className={ui.backLink}>
        ← {t.backToTeacher}
      </Link>
      <div className={s.heading}>
        <span className={ui.eyebrow}>{t.brand}</span>
        <h1 className={ui.title}>{t.teacherTitle}</h1>
      </div>
      {students !== null && students.length > 0 && <CoursePeriod students={students} />}
      <div className={s.card}>
        {students === null ? (
          <p className={s.empty}>{t.loading}</p>
        ) : students.length === 0 ? (
          <p className={s.empty}>{t.noStudents}</p>
        ) : (
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>{t.colStudent}</th>
                  <th className={ui.num}>{t.colSessions}</th>
                  <th className={ui.num}>{t.colAnswered}</th>
                  <th className={ui.num}>{t.colCorrect}</th>
                  <th className={ui.num}>{t.colAccuracy}</th>
                  <th>{t.colLastPlayed}</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.uid} className={s.row} onClick={() => setSelected(student)}>
                    <td>
                      <span className={s.name}>{student.displayName || student.email}</span>
                      {student.displayName && <span className={s.email}>{student.email}</span>}
                    </td>
                    <td className={ui.num}>{student.sessionsPlayed}</td>
                    <td className={ui.num}>{student.totalAnswered}</td>
                    <td className={ui.num}>{student.totalCorrect}</td>
                    <td className={ui.num}>{percentText(student.totalCorrect, student.totalAnswered)}</td>
                    <td>{dateText(student.lastPlayedAt, locale, t.never)}</td>
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

export default function TeacherBoard() {
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
  return <StudentsTable />;
}
