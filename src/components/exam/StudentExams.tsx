import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { Exam, ExamAttempt, ExamGrade } from '../../data/exam/types';
import { examPath } from '../../data/learn';
import type { LearnCourse } from '../../data/learn';
import { examDict } from '../../i18n/pages/exam';
import { useLocale, useT } from '../../i18n/useT';
import ui from '../learn/ui.module.css';
import { fetchAttempt, fetchGrade, subscribeOpenedExams } from './exams';
import { dateTimeYearText, durationText } from './format';
import s from './StudentExams.module.css';

/** What the student did in one exam: no attempt, an attempt, and the grade once the rules release it. */
type ExamResult = {
  attempt: ExamAttempt | null;
  grade: ExamGrade | null;
};

/** The signed-in student's own exams in one course, each linking to its room, where the result shows. */
export default function StudentExams({ course, uid }: { course: LearnCourse; uid: string }) {
  const t = useT(examDict);
  const locale = useLocale();
  const [exams, setExams] = useState<Exam[] | null>(null);
  const [results, setResults] = useState<Record<string, ExamResult> | null>(null);
  const courseExams = useMemo(() => (exams ?? []).filter((exam) => exam.courseSlug === course.slug), [exams, course.slug]);

  useEffect(
    () => subscribeOpenedExams(setExams, (error) => console.error('Could not load the exams', error)),
    []
  );

  useEffect(() => {
    if (exams === null) return undefined;
    let isCurrent = true;
    // The grade is refused until the exam clock ends: that reads as no grade yet.
    Promise.all(
      courseExams.map((exam) =>
        Promise.all([fetchAttempt(exam.id, uid).catch(() => null), fetchGrade(exam.id, uid).catch(() => null)])
      )
    )
      .then((loaded) => {
        if (!isCurrent) return;
        const byExam: Record<string, ExamResult> = {};
        courseExams.forEach((exam, index) => {
          byExam[exam.id] = { attempt: loaded[index][0], grade: loaded[index][1] };
        });
        setResults(byExam);
      })
      .catch((error) => console.error('Could not load the attempts', error));
    return () => {
      isCurrent = false;
    };
  }, [exams, courseExams, uid]);

  function attemptText(result: ExamResult | undefined): string {
    if (!result) return '…';
    if (!result.attempt) return '–';
    return result.attempt.status === 'submitted' ? t.attemptSubmitted : t.attemptStarted;
  }

  return (
    <div className={s.card}>
      {exams === null ? (
        <p className={s.empty}>{t.loading}</p>
      ) : courseExams.length === 0 ? (
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
              {courseExams.map((exam) => {
                const result = results?.[exam.id];
                return (
                  <tr key={exam.id}>
                    <td>
                      <Link href={examPath(course, exam.id)} className={s.link}>
                        {exam.title}
                      </Link>
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
  );
}
