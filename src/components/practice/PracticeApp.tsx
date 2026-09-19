import type { User } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { LEARN_BASE_PATH, coursePath, findCourse, practicePlayPath, practiceScope, querySlug } from '../../data/learn';
import type { LearnCourse, PracticeScope } from '../../data/learn';
import { questionsInScope } from '../../data/practice';
import { practiceDict } from '../../i18n/pages/practice';
import { useT } from '../../i18n/useT';
import { isFirebaseConfigured } from '../../lib/firebase';
import SignInRedirect from '../learn/SignInRedirect';
import ui from '../learn/ui.module.css';
import { useAuthUser } from '../learn/useAuthUser';
import Player from './Player';
import { ensureStudentProfile, isPermissionDenied } from './progress';
import { activeQuestions, useQuestionBank } from './questions';

type StudentAreaProps = {
  user: User;
  course: LearnCourse;
  scope: PracticeScope;
};

function StudentArea({ user, course, scope }: StudentAreaProps) {
  const t = useT(practiceDict);
  const bank = useQuestionBank();

  useEffect(() => {
    ensureStudentProfile(user).catch((error) => console.error('Could not save the student profile', error));
  }, [user]);

  if (bank.status === 'loading') {
    return (
      <div className={ui.centered}>
        <span className={ui.mono}>{t.loading}</span>
      </div>
    );
  }
  // The rules refuse the bank to every non-teacher while an exam runs (firebase/firestore.rules).
  if (bank.status === 'error' && isPermissionDenied(bank.error)) {
    return (
      <div className={ui.centered}>
        <p className={ui.notice}>{t.pausedForExam}</p>
      </div>
    );
  }
  if (bank.status === 'error') {
    console.error('Could not load the questions', bank.error);
    return (
      <div className={ui.centered}>
        <p className={ui.error}>{t.bankLoadError}</p>
      </div>
    );
  }

  const scopedQuestions = questionsInScope(activeQuestions(bank), scope);
  if (scopedQuestions.length === 0) {
    return (
      <div className={ui.centered}>
        <p className={ui.mono}>{t.noQuestions}</p>
        <Link href={coursePath(course)} className={ui.btn}>
          ← {t.backToCourse}
        </Link>
      </div>
    );
  }
  return (
    <Player uid={user.uid} questions={scopedQuestions} courseSlug={course.slug} stopHref={coursePath(course)} />
  );
}

export default function PracticeApp() {
  const t = useT(practiceDict);
  const router = useRouter();
  const auth = useAuthUser();
  const scope = practiceScope(querySlug(router.query.course), querySlug(router.query.class));
  const course = findCourse(scope.courseSlug);
  const isCourseMissing = router.isReady && !course;

  // Practice never mixes courses: a link without a known course goes back to the course menu.
  useEffect(() => {
    if (isCourseMissing) router.replace(LEARN_BASE_PATH);
  }, [isCourseMissing, router]);

  if (!isFirebaseConfigured()) {
    return (
      <div className={ui.centered}>
        <p className={ui.error}>{t.notConfigured}</p>
      </div>
    );
  }
  // The scope lives in the query string, which a static page only knows once the router is ready.
  if (auth.status === 'loading' || !course) {
    return (
      <div className={ui.centered}>
        <span className={ui.mono}>{t.loading}</span>
      </div>
    );
  }
  if (auth.status === 'signedOut') {
    return <SignInRedirect />;
  }

  // Keyed by scope so a session never mixes the questions of two scopes.
  return <StudentArea key={practicePlayPath(scope)} user={auth.user} course={course} scope={scope} />;
}
