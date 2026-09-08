import { useEffect, useState } from 'react';
import { findQuestion, questionTopicTitle } from '../../data/quiz';
import { quizDict } from '../../i18n/pages/quiz';
import { useLocale, useT } from '../../i18n/useT';
import { isFirebaseConfigured } from '../../lib/firebase';
import SignIn from './SignIn';
import { dateText, percentText } from './format';
import { fetchAllStudents, fetchStudentQuestions, isPermissionDenied } from './progress';
import type { QuestionStats, StudentStats } from './progress';
import s from './TeacherBoard.module.css';
import ui from './ui.module.css';
import { useAuthUser } from './useAuthUser';

function byLastPlayedDesc(a: StudentStats, b: StudentStats): number {
  return (b.lastPlayedAt?.toMillis() ?? 0) - (a.lastPlayedAt?.toMillis() ?? 0);
}

function byAttemptsDesc(a: QuestionStats, b: QuestionStats): number {
  return b.attempts - a.attempts;
}

function StudentDetail({ student, onBack }: { student: StudentStats; onBack: () => void }) {
  const t = useT(quizDict);
  const locale = useLocale();
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
      <div className={s.card}>
        {questions === null ? (
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
                  const question = findQuestion(stats.questionId);
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

function StudentsTable() {
  const t = useT(quizDict);
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
      <div className={s.heading}>
        <span className={ui.eyebrow}>{t.brand}</span>
        <h1 className={ui.title}>{t.teacherTitle}</h1>
      </div>
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
  const t = useT(quizDict);
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
    return <SignIn />;
  }
  return <StudentsTable />;
}
