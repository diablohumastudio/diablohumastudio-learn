import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { coursePath } from '../../data/learn';
import type { LearnCourse } from '../../data/learn';
import {
  DAILY_QUESTIONS_GOAL,
  RUN_CORRECT_GOAL,
  RUN_LENGTH,
  dayKey,
  dayKeysBetween,
  monthKeyOf,
  monthKeysBetween,
  monthRange,
  monthText,
  questionsInScope,
  summarizePeriod,
} from '../../data/practice';
import type { ProgressScope } from '../../data/practice';
import { practiceDict } from '../../i18n/pages/practice';
import { useLocale, useT } from '../../i18n/useT';
import { isFirebaseConfigured } from '../../lib/firebase';
import SignInRedirect from '../learn/SignInRedirect';
import ui from '../learn/ui.module.css';
import { useAuthUser } from '../learn/useAuthUser';
import { CourseProgressProvider, useCourseProgress } from './CourseProgressContext';
import type { CourseProgressData } from './CourseProgressContext';
import { percentText, scoreText } from './format';
import HomeworkGrid from './HomeworkGrid';
import { MonthSelect } from './PeriodControls';
import { subscribeStudent } from './progress';
import type { QuestionStats, StudentStats } from './progress';
import QuestionStatsTable, { byAttemptsDesc } from './QuestionStatsTable';
import { useQuestionBank } from './questions';
import s from './StudentHistory.module.css';

type HistoryPageProps = {
  course: LearnCourse;
  user: User;
};

/** The months the student practiced this course in, oldest first; today's month always. */
function monthsOf(progress: CourseProgressData, today: string): string[] {
  const firstDay = progress.days.reduce((earliest, day) => (day.day && day.day < earliest ? day.day : earliest), today);
  return monthKeysBetween(monthKeyOf(firstDay), monthKeyOf(today));
}

/** The grid wants a student row; before the profile arrives, the account itself names it. */
function studentOf(user: User, student: StudentStats | null): StudentStats {
  if (student) return student;
  return {
    uid: user.uid,
    displayName: user.displayName ?? '',
    email: user.email ?? '',
    sessionsPlayed: 0,
    totalAnswered: 0,
    totalCorrect: 0,
    lastPlayedAt: null,
  };
}

function LifetimeStats({ student }: { student: StudentStats | null }) {
  const t = useT(practiceDict);
  if (!student) return null;

  return (
    <section className={s.section}>
      <span className={ui.eyebrow}>{t.groupLifetime}</span>
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
    </section>
  );
}

type MonthsTableProps = {
  progress: CourseProgressData;
  scope: ProgressScope;
  months: string[];
  today: string;
};

/** One row per month: the days done as the teacher counts them, and the month's answers. */
function MonthsTable({ progress, scope, months, today }: MonthsTableProps) {
  const t = useT(practiceDict);
  const locale = useLocale();
  const hint = t.monthGradeHint
    .replace('{count}', String(DAILY_QUESTIONS_GOAL))
    .replace('{goal}', String(RUN_CORRECT_GOAL))
    .replace('{length}', String(RUN_LENGTH));

  return (
    <section className={s.section}>
      <hr className={s.divider} />
      <span className={ui.eyebrow}>{t.monthlyTable}</span>
      <div className={s.card}>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>{t.monthLabel}</th>
                <th className={ui.num}>{t.colDaysDone}</th>
                <th className={ui.num}>{t.colFullDays}</th>
                <th className={ui.num}>{t.colPartialDays}</th>
                <th className={ui.num}>{t.colAnswered}</th>
                <th className={ui.num}>{t.colCorrect}</th>
                <th className={ui.num}>{t.colAccuracy}</th>
              </tr>
            </thead>
            <tbody>
              {months.map((month) => {
                const range = monthRange(month, today);
                const days = dayKeysBetween(range.firstDay, range.lastDay);
                const summary = summarizePeriod(progress.days, scope, days);
                return (
                  <tr key={month}>
                    <td className={s.month}>{monthText(month, locale)}</td>
                    <td className={`${ui.num} ${s.score}`}>
                      {scoreText(summary.score, locale)} / {days.length}
                    </td>
                    <td className={ui.num}>{summary.fullDays}</td>
                    <td className={ui.num}>{summary.partialDays}</td>
                    <td className={ui.num}>{summary.answered}</td>
                    <td className={ui.num}>{summary.correct}</td>
                    <td className={ui.num}>{percentText(summary.correct, summary.answered)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <p className={ui.mono}>{hint}</p>
    </section>
  );
}

type CourseQuestionsProps = {
  course: LearnCourse;
  questionStats: QuestionStats[];
};

/** The student's attempts on the questions of this course only, most attempted first. */
function CourseQuestions({ course, questionStats }: CourseQuestionsProps) {
  const t = useT(practiceDict);
  const bank = useQuestionBank();
  let stats: QuestionStats[] | null = null;
  if (bank.status === 'ready') {
    const courseQuestionIds = new Set(questionsInScope(bank.questions, { courseSlug: course.slug }).map((q) => q.id));
    stats = questionStats.filter((candidate) => courseQuestionIds.has(candidate.questionId)).sort(byAttemptsDesc);
  }

  return (
    <section className={s.section}>
      <hr className={s.divider} />
      <span className={ui.eyebrow}>{t.byQuestion}</span>
      <QuestionStatsTable stats={stats} />
    </section>
  );
}

function HistoryPage({ course, user }: HistoryPageProps) {
  const t = useT(practiceDict);
  const progress = useCourseProgress();
  const today = dayKey(new Date());
  const [student, setStudent] = useState<StudentStats | null>(null);
  const [gridMonth, setGridMonth] = useState(monthKeyOf(today));
  const scope: ProgressScope = { kind: 'daily', courseSlug: course.slug };
  const gridRange = monthRange(gridMonth, today);

  useEffect(() => subscribeStudent(user.uid, setStudent), [user.uid]);

  return (
    <div className={s.wrap}>
      <Link href={coursePath(course)} className={ui.backLink}>
        ← {t.backToCourse}
      </Link>
      <div className={s.heading}>
        <span className={ui.eyebrow}>{course.title}</span>
        <h1 className={ui.title}>{t.historyTitle}</h1>
      </div>
      {progress === null ? (
        <div className={s.card}>
          <p className={s.empty}>{t.loading}</p>
        </div>
      ) : (
        <>
          <LifetimeStats student={student} />
          <MonthsTable progress={progress} scope={scope} months={monthsOf(progress, today)} today={today} />
          <HomeworkGrid
            students={[studentOf(user, student)]}
            daysByStudent={{ [user.uid]: progress.days }}
            days={dayKeysBetween(gridRange.firstDay, gridRange.lastDay)}
            scope={scope}
            controls={<MonthSelect month={gridMonth} months={monthsOf(progress, today)} onChange={setGridMonth} />}
          />
          <CourseQuestions course={course} questionStats={progress.questionStats} />
        </>
      )}
    </div>
  );
}

/** The signed-in student's own numbers in one course; nobody else's are readable from here. */
export default function StudentHistory({ course }: { course: LearnCourse }) {
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
  if (auth.status === 'signedOut') return <SignInRedirect />;
  return (
    <CourseProgressProvider course={course}>
      <HistoryPage course={course} user={auth.user} />
    </CourseProgressProvider>
  );
}
