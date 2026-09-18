import Link from 'next/link';
import { LEARN_BASE_PATH, QUESTIONS_EDITOR_PATH, STUDENTS_PRACTICE_INFO_PATH } from '../../data/learn';
import { learnDict } from '../../i18n/learn';
import { useT } from '../../i18n/useT';
import { isFirebaseConfigured } from '../../lib/firebase';
import s from './LearnMenu.module.css';
import SignInRedirect from './SignInRedirect';
import ui from './ui.module.css';
import { useTeacherStatus } from './useTeacherStatus';

export default function TeacherHub() {
  const t = useT(learnDict);
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
  if (teacherStatus === 'signedOut') {
    return <SignInRedirect />;
  }
  if (teacherStatus === 'notTeacher') {
    return (
      <div className={ui.centered}>
        <p className={ui.error}>{t.notAuthorized}</p>
      </div>
    );
  }

  return (
    <div className={s.wrap}>
      <Link href={LEARN_BASE_PATH} className={ui.backLink}>
        ← {t.backToStudentMode}
      </Link>
      <div className={s.heading}>
        <span className={ui.eyebrow}>{t.brand}</span>
        <h1 className={ui.title}>{t.teacherTitle}</h1>
      </div>
      <nav className={s.list}>
        <Link href={STUDENTS_PRACTICE_INFO_PATH} className={s.item}>
          {t.studentsPracticeInfo}
          <span className={s.itemArrow}>→</span>
        </Link>
        <Link href={QUESTIONS_EDITOR_PATH} className={s.item}>
          {t.practiceQuestions}
          <span className={s.itemArrow}>→</span>
        </Link>
      </nav>
    </div>
  );
}
