import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import type { Exam, ExamAttempt, ExamGrade } from '../../data/exam/types';
import {
  TEACHER_PATH,
  TEACHER_STUDENTS_PATH,
  findCourse,
  teacherAttemptPath,
  teacherStudentPath,
} from '../../data/learn';
import { dayKey, dayKeysBetween, summarizePeriod } from '../../data/practice';
import type { Homework } from '../../data/practice';
import { examDict } from '../../i18n/pages/exam';
import { practiceDict } from '../../i18n/pages/practice';
import { useLocale, useT } from '../../i18n/useT';
import { isFirebaseConfigured } from '../../lib/firebase';
import { fetchAttempt, fetchGrade, subscribeAllExams } from '../exam/exams';
import { dateTimeYearText, durationText } from '../exam/format';
import menu from '../learn/LearnMenu.module.css';
import SignInRedirect from '../learn/SignInRedirect';
import ui from '../learn/ui.module.css';
import { useTeacherStatus } from '../learn/useTeacherStatus';
import { homeworkDaysText, homeworkStatusText, scoreText } from './format';
import HomeworkGrid from './HomeworkGrid';
import { subscribeAllHomeworks } from './homeworks';
import { byDisplayName, fetchAllStudents, fetchStudentQuestions } from './progress';
import type { QuestionStats, StudentStats } from './progress';
import QuestionStatsTable, { byAttemptsDesc } from './QuestionStatsTable';
import s from './StudentReview.module.css';
import { CoursePeriod } from './TeacherBoard';
import { useStudentDays } from './useStudentDays';
import type { DaysByStudent } from './useStudentDays';

/** What one student did in one exam: no attempt, an attempt, and its grade once it exists. */
type ExamResult = {
  attempt: ExamAttempt | null;
  grade: ExamGrade | null;
};

function studentName(student: StudentStats): string {
  return student.displayName || student.email;
}

function StudentList({ students }: { students: StudentStats[] }) {
  const t = useT(practiceDict);

  return (
    <div className={s.wrap}>
      <Link href={TEACHER_PATH} className={ui.backLink}>
        ← {t.backToTeacher}
      </Link>
      <div className={s.titles}>
        <span className={ui.eyebrow}>{t.brand}</span>
        <h1 className={ui.title}>{t.studentReviewTitle}</h1>
      </div>
      <p className={ui.lede}>{t.pickStudent}</p>
      {students.length === 0 ? (
        <p className={ui.mono}>{t.noStudents}</p>
      ) : (
        <nav className={menu.list}>
          {students.map((student) => (
            <Link key={student.uid} href={teacherStudentPath(student.uid)} className={menu.item}>
              {studentName(student)}
              {student.displayName && <span className={s.listEmail}>{student.email}</span>}
              <span className={menu.itemArrow}>→</span>
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}

/** The per-question table, loaded only when asked for: it is one read per question answered. */
function QuestionsSection({ uid }: { uid: string }) {
  const t = useT(practiceDict);
  // Undefined until the teacher asks; null while loading.
  const [stats, setStats] = useState<QuestionStats[] | null | undefined>(undefined);

  function load(): void {
    setStats(null);
    fetchStudentQuestions(uid)
      .then((loaded) => setStats([...loaded].sort(byAttemptsDesc)))
      .catch((error) => console.error('Could not load the student questions', error));
  }

  return (
    <section className={s.section}>
      <hr className={s.divider} />
      <span className={ui.eyebrow}>{t.byQuestion}</span>
      {stats === undefined ? (
        <button type="button" className={s.button} onClick={load}>
          {t.showQuestions}
        </button>
      ) : (
        <QuestionStatsTable stats={stats} />
      )}
    </section>
  );
}

type HomeworksSectionProps = {
  student: StudentStats;
  daysByStudent: DaysByStudent | null;
};

/** Every specific homework with the student's points; a click opens its days. */
function HomeworksSection({ student, daysByStudent }: HomeworksSectionProps) {
  const t = useT(practiceDict);
  const locale = useLocale();
  const [homeworks, setHomeworks] = useState<Homework[] | null>(null);
  const [openHomeworkId, setOpenHomeworkId] = useState<string | null>(null);
  const today = dayKey(new Date());
  const studentDays = daysByStudent?.[student.uid] ?? [];
  const openHomework = homeworks?.find((homework) => homework.id === openHomeworkId);

  useEffect(
    () => subscribeAllHomeworks(setHomeworks, (error) => console.error('Could not load the homeworks', error)),
    []
  );

  function toggle(homeworkId: string): void {
    setOpenHomeworkId(homeworkId === openHomeworkId ? null : homeworkId);
  }

  return (
    <section className={s.section}>
      <hr className={s.divider} />
      <span className={ui.eyebrow}>{t.homeworksTitle}</span>
      <div className={s.card}>
        {homeworks === null ? (
          <p className={s.empty}>{t.loading}</p>
        ) : homeworks.length === 0 ? (
          <p className={s.empty}>{t.noHomeworks}</p>
        ) : (
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>{t.colTitle}</th>
                  <th>{t.colCourse}</th>
                  <th>{t.colDays}</th>
                  <th className={ui.num}>{t.colPoints}</th>
                  <th>{t.colStatus}</th>
                </tr>
              </thead>
              <tbody>
                {homeworks.map((homework) => {
                  const days = dayKeysBetween(homework.firstDay, homework.lastDay);
                  const summary = summarizePeriod(studentDays, { kind: 'homework', homework }, days);
                  return (
                    <tr
                      key={homework.id}
                      className={homework.id === openHomeworkId ? s.rowOpen : s.row}
                      onClick={() => toggle(homework.id)}
                    >
                      <td className={s.name}>{homework.title}</td>
                      <td>{findCourse(homework.courseSlug)?.title ?? homework.courseSlug}</td>
                      <td>{homeworkDaysText(homework, locale)}</td>
                      <td className={`${ui.num} ${s.score}`}>
                        {daysByStudent ? `${scoreText(summary.score, locale)} / ${days.length}` : '…'}
                      </td>
                      <td>{homeworkStatusText(homework, today, t)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {openHomework && (
        <HomeworkGrid
          students={[student]}
          daysByStudent={daysByStudent}
          days={dayKeysBetween(openHomework.firstDay, openHomework.lastDay)}
          scope={{ kind: 'homework', homework: openHomework }}
        />
      )}
      <p className={ui.mono}>{t.reviewHomeworkHint}</p>
    </section>
  );
}

/** Every opened exam with the student's attempt and score; the title links to the replay. */
function ExamsSection({ uid }: { uid: string }) {
  const t = useT(examDict);
  const practiceT = useT(practiceDict);
  const locale = useLocale();
  const [exams, setExams] = useState<Exam[] | null>(null);
  const [results, setResults] = useState<Record<string, ExamResult> | null>(null);
  // Drafts have no attempts: only an opened exam has anything of the student in it.
  const openedExams = useMemo(() => (exams ?? []).filter((exam) => exam.status === 'opened'), [exams]);

  useEffect(
    () => subscribeAllExams(setExams, (error) => console.error('Could not load the exams', error)),
    []
  );

  useEffect(() => {
    if (exams === null) return undefined;
    let isCurrent = true;
    Promise.all(openedExams.map((exam) => Promise.all([fetchAttempt(exam.id, uid), fetchGrade(exam.id, uid)])))
      .then((loaded) => {
        if (!isCurrent) return;
        const byExam: Record<string, ExamResult> = {};
        openedExams.forEach((exam, index) => {
          byExam[exam.id] = { attempt: loaded[index][0], grade: loaded[index][1] };
        });
        setResults(byExam);
      })
      .catch((error) => console.error('Could not load the attempts', error));
    return () => {
      isCurrent = false;
    };
  }, [exams, openedExams, uid]);

  function attemptText(result: ExamResult | undefined): string {
    if (!result) return '…';
    if (!result.attempt) return '–';
    return result.attempt.status === 'submitted' ? t.attemptSubmitted : t.attemptStarted;
  }

  return (
    <section className={s.section}>
      <hr className={s.divider} />
      <span className={ui.eyebrow}>{t.examsTitle}</span>
      <div className={s.card}>
        {exams === null ? (
          <p className={s.empty}>{t.loading}</p>
        ) : openedExams.length === 0 ? (
          <p className={s.empty}>{t.noExams}</p>
        ) : (
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>{t.colTitle}</th>
                  <th>{t.colClosesAt}</th>
                  <th>{t.colAttempt}</th>
                  <th className={ui.num}>{t.colScore}</th>
                  <th className={ui.num}>{t.colLate}</th>
                </tr>
              </thead>
              <tbody>
                {openedExams.map((exam) => {
                  const result = results?.[exam.id];
                  return (
                    <tr key={exam.id}>
                      <td>
                        {result?.attempt ? (
                          <Link href={teacherAttemptPath(exam.id, uid)} className={s.link}>
                            {exam.title}
                          </Link>
                        ) : (
                          <span className={s.name}>{exam.title}</span>
                        )}
                      </td>
                      <td>{dateTimeYearText(exam.closesAtMs, locale)}</td>
                      <td>{attemptText(result)}</td>
                      <td className={`${ui.num} ${s.score}`}>
                        {result?.grade ? `${result.grade.score} / ${result.grade.total}` : '–'}
                      </td>
                      <td className={result?.attempt?.late ? `${ui.num} ${s.late}` : ui.num}>
                        {result?.attempt?.late ? durationText(result.attempt.lateBySeconds) : '–'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className={ui.mono}>{practiceT.reviewExamHint}</p>
    </section>
  );
}

type StudentPageProps = {
  student: StudentStats;
  /** Everybody, alphabetical, for the switch in the heading. */
  students: StudentStats[];
};

/** One student's page: daily homework, questions on demand, specific homeworks and exams. */
function StudentPage({ student, students }: StudentPageProps) {
  const t = useT(practiceDict);
  const router = useRouter();
  // One array per student, or the days would be fetched again on every render.
  const studentList = useMemo(() => [student], [student]);
  const daysByStudent = useStudentDays(studentList);

  return (
    <div className={s.wrap}>
      <Link href={TEACHER_STUDENTS_PATH} className={ui.backLink}>
        ← {t.backToStudents}
      </Link>
      <div className={s.heading}>
        <div className={s.titles}>
          <span className={ui.eyebrow}>{student.email}</span>
          <h1 className={ui.title}>{studentName(student)}</h1>
        </div>
        <label className={s.control}>
          <span className={ui.label}>{t.colStudent}</span>
          <select
            className={s.select}
            value={student.uid}
            onChange={(event) => void router.push(teacherStudentPath(event.target.value))}
          >
            {students.map((candidate) => (
              <option key={candidate.uid} value={candidate.uid}>
                {studentName(candidate)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <CoursePeriod students={studentList} daysByStudent={daysByStudent} selectionScope={`student-${student.uid}-`} />
      <QuestionsSection uid={student.uid} />
      <HomeworksSection student={student} daysByStudent={daysByStudent} />
      <ExamsSection uid={student.uid} />
    </div>
  );
}

/** The route decides the screen: the list of students, or one student by uid. */
function Review() {
  const t = useT(practiceDict);
  const router = useRouter();
  const [students, setStudents] = useState<StudentStats[] | null>(null);
  const [failed, setFailed] = useState(false);
  const uid = typeof router.query.uid === 'string' ? router.query.uid : null;
  const student = students?.find((candidate) => candidate.uid === uid);

  useEffect(() => {
    fetchAllStudents()
      .then((loaded) => setStudents([...loaded].sort(byDisplayName)))
      .catch((error) => {
        console.error('Could not load the students', error);
        setFailed(true);
      });
  }, []);

  if (failed) {
    return (
      <div className={ui.centered}>
        <p className={ui.error}>{t.errorGeneric}</p>
      </div>
    );
  }
  // The route's uid arrives with the router; until then nothing says which screen this is.
  if (!router.isReady || !students) {
    return (
      <div className={ui.centered}>
        <span className={ui.mono}>{t.loading}</span>
      </div>
    );
  }
  if (uid === null) return <StudentList students={students} />;
  if (!student) {
    return (
      <div className={s.wrap}>
        <Link href={TEACHER_STUDENTS_PATH} className={ui.backLink}>
          ← {t.backToStudents}
        </Link>
        <p className={ui.error}>{t.studentNotFound}</p>
      </div>
    );
  }
  // Keyed by uid so switching students starts the sections, and their loads, afresh.
  return <StudentPage key={uid} student={student} students={students} />;
}

/** Teacher only: one student at a time, so a review shows nobody else's numbers. */
export default function StudentReview() {
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
  return <Review />;
}
