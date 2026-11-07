import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LEARN_COURSES, TEACHER_PATH } from '../../data/learn';
import { dayKey, dayKeysBetween, monthKeyOf, monthKeysBetween } from '../../data/practice';
import type { ProgressScope } from '../../data/practice';
import { practiceDict } from '../../i18n/pages/practice';
import { useT } from '../../i18n/useT';
import { isFirebaseConfigured } from '../../lib/firebase';
import SignInRedirect from '../learn/SignInRedirect';
import { percentText } from './format';
import HomeworkGrid from './HomeworkGrid';
import { CourseSelect, PeriodSelect, periodRange } from './PeriodControls';
import type { Period } from './PeriodControls';
import PeriodSummary from './PeriodSummary';
import { byDisplayName, fetchAllStudents, fetchStudentQuestions, isPermissionDenied } from './progress';
import type { QuestionStats, StudentStats } from './progress';
import QuestionStatsTable, { byAttemptsDesc } from './QuestionStatsTable';
import s from './TeacherBoard.module.css';
import ui from '../learn/ui.module.css';
import { useAuthUser } from '../learn/useAuthUser';
import { earliestDayKey, useStudentDays } from './useStudentDays';

function StudentDetail({ student, onBack }: { student: StudentStats; onBack: () => void }) {
  const t = useT(practiceDict);
  const [questions, setQuestions] = useState<QuestionStats[] | null>(null);

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
      <QuestionStatsTable stats={questions} />
    </div>
  );
}

type CoursePeriodProps = {
  students: StudentStats[];
  onSelectStudent: (student: StudentStats) => void;
};

/** The daily homework of a course: the summary and the day grid, each over a period of its own. */
function CoursePeriod({ students, onSelectStudent }: CoursePeriodProps) {
  const today = dayKey(new Date());
  const currentMonth: Period = { kind: 'month', month: monthKeyOf(today) };
  const [courseSlug, setCourseSlug] = useState(LEARN_COURSES[0].slug);
  const [summaryPeriod, setSummaryPeriod] = useState<Period>(currentMonth);
  const [gridPeriod, setGridPeriod] = useState<Period>(currentMonth);
  const daysByStudent = useStudentDays(students);
  const firstDayEver = earliestDayKey(daysByStudent) ?? today;
  const summaryRange = periodRange(summaryPeriod, firstDayEver, today);
  const gridRange = periodRange(gridPeriod, firstDayEver, today);
  const months = monthKeysBetween(monthKeyOf(firstDayEver), monthKeyOf(today));
  const studentsByName = [...students].sort(byDisplayName);
  const scope: ProgressScope = { kind: 'daily', courseSlug };

  return (
    <>
      <CourseSelect courseSlug={courseSlug} onChange={setCourseSlug} />
      <PeriodSummary
        key={courseSlug}
        students={studentsByName}
        daysByStudent={daysByStudent}
        days={dayKeysBetween(summaryRange.firstDay, summaryRange.lastDay)}
        scope={scope}
        selectionKey={courseSlug}
        fileName={`practica_${courseSlug}_${summaryRange.firstDay}_${summaryRange.lastDay}`}
        onSelectStudent={onSelectStudent}
        controls={
          <PeriodSelect period={summaryPeriod} range={summaryRange} months={months} onChange={setSummaryPeriod} />
        }
      />
      <HomeworkGrid
        students={studentsByName}
        daysByStudent={daysByStudent}
        days={dayKeysBetween(gridRange.firstDay, gridRange.lastDay)}
        scope={scope}
        controls={<PeriodSelect period={gridPeriod} range={gridRange} months={months} onChange={setGridPeriod} />}
      />
    </>
  );
}

function StudentsTable() {
  const t = useT(practiceDict);
  const [students, setStudents] = useState<StudentStats[] | null>(null);
  const [denied, setDenied] = useState(false);
  const [selected, setSelected] = useState<StudentStats | null>(null);

  useEffect(() => {
    fetchAllStudents()
      .then(setStudents)
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
      {students === null ? (
        <div className={s.card}>
          <p className={s.empty}>{t.loading}</p>
        </div>
      ) : students.length === 0 ? (
        <div className={s.card}>
          <p className={s.empty}>{t.noStudents}</p>
        </div>
      ) : (
        <CoursePeriod students={students} onSelectStudent={setSelected} />
      )}
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
