import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LEARN_COURSES, TEACHER_PATH, teacherStudentPath } from '../../data/learn';
import { dayKey, dayKeysBetween, monthKeyOf, monthKeysBetween } from '../../data/practice';
import type { ProgressScope } from '../../data/practice';
import { practiceDict } from '../../i18n/pages/practice';
import { useT } from '../../i18n/useT';
import { isFirebaseConfigured } from '../../lib/firebase';
import SignInRedirect from '../learn/SignInRedirect';
import HomeworkGrid from './HomeworkGrid';
import { CourseSelect, PeriodSelect, periodRange } from './PeriodControls';
import type { Period } from './PeriodControls';
import PeriodSummary from './PeriodSummary';
import { byDisplayName, fetchAllStudents, isPermissionDenied } from './progress';
import type { StudentStats } from './progress';
import s from './TeacherBoard.module.css';
import ui from '../learn/ui.module.css';
import { useAuthUser } from '../learn/useAuthUser';
import { earliestDayKey, useStudentDays } from './useStudentDays';
import type { DaysByStudent } from './useStudentDays';

type CoursePeriodProps = {
  students: StudentStats[];
  /** Their days, loaded by the caller; null while they arrive. */
  daysByStudent: DaysByStudent | null;
  /** Keeps the ticks and order of the summary apart from another page's: the board stores
      them by course, a student's page adds the student. */
  selectionScope?: string;
  /** Makes each name of the summary a link to the student's own page. */
  studentHref?: (student: StudentStats) => string;
};

/** The daily homework of a course for these students: the summary and the day grid, each over a
    period of its own. The board passes everybody; a student's review page passes that one. */
export function CoursePeriod({ students, daysByStudent, selectionScope = '', studentHref }: CoursePeriodProps) {
  const today = dayKey(new Date());
  const currentMonth: Period = { kind: 'month', month: monthKeyOf(today) };
  const [courseSlug, setCourseSlug] = useState(LEARN_COURSES[0].slug);
  const [summaryPeriod, setSummaryPeriod] = useState<Period>(currentMonth);
  const [gridPeriod, setGridPeriod] = useState<Period>(currentMonth);
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
        selectionKey={`${selectionScope}${courseSlug}`}
        fileName={`practica_${courseSlug}_${summaryRange.firstDay}_${summaryRange.lastDay}`}
        studentHref={studentHref}
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
  const daysByStudent = useStudentDays(students);

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
        <CoursePeriod
          students={students}
          daysByStudent={daysByStudent}
          studentHref={(student) => teacherStudentPath(student.uid)}
        />
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
