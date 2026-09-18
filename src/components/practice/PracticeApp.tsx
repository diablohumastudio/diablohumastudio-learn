import type { User } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { practicePath, practiceScope, querySlug } from '../../data/learn';
import type { PracticeScope } from '../../data/learn';
import { questionsInScope } from '../../data/practice';
import { practiceDict } from '../../i18n/pages/practice';
import { useT } from '../../i18n/useT';
import { isFirebaseConfigured } from '../../lib/firebase';
import SignInRedirect from '../learn/SignInRedirect';
import ui from '../learn/ui.module.css';
import { useAuthUser } from '../learn/useAuthUser';
import Player from './Player';
import PracticeHome from './PracticeHome';
import { ensureStudentProfile, subscribeStudent } from './progress';
import type { StudentStats } from './progress';
import { activeQuestions, useQuestionBank } from './questions';

/** Each screen has its own URL, so the browser's back button returns from playing to the numbers. */
export type PracticeScreen = 'home' | 'play';

type StudentAreaProps = {
  user: User;
  screen: PracticeScreen;
  scope: PracticeScope;
};

function StudentArea({ user, screen, scope }: StudentAreaProps) {
  const t = useT(practiceDict);
  const bank = useQuestionBank();
  const [stats, setStats] = useState<StudentStats | null>(null);

  useEffect(() => {
    ensureStudentProfile(user).catch((error) => console.error('Could not save the student profile', error));
    return subscribeStudent(user.uid, setStats);
  }, [user]);

  if (bank.status === 'loading') {
    return (
      <div className={ui.centered}>
        <span className={ui.mono}>{t.loading}</span>
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

  const questions = activeQuestions(bank);
  if (screen === 'home') {
    return <PracticeHome user={user} stats={stats} questions={questions} scope={scope} />;
  }

  const scopedQuestions = questionsInScope(questions, scope);
  if (scopedQuestions.length === 0) {
    return (
      <div className={ui.centered}>
        <p className={ui.mono}>{t.noQuestions}</p>
        <Link href={practicePath(scope)} className={ui.btn}>
          ← {t.backToPractice}
        </Link>
      </div>
    );
  }
  return <Player uid={user.uid} questions={scopedQuestions} lifetime={stats} stopHref={practicePath(scope)} />;
}

export default function PracticeApp({ screen }: { screen: PracticeScreen }) {
  const t = useT(practiceDict);
  const router = useRouter();
  const auth = useAuthUser();

  if (!isFirebaseConfigured()) {
    return (
      <div className={ui.centered}>
        <p className={ui.error}>{t.notConfigured}</p>
      </div>
    );
  }
  // The scope lives in the query string, which a static page only knows once the router is ready.
  if (auth.status === 'loading' || !router.isReady) {
    return (
      <div className={ui.centered}>
        <span className={ui.mono}>{t.loading}</span>
      </div>
    );
  }
  if (auth.status === 'signedOut') {
    return <SignInRedirect />;
  }

  const scope = practiceScope(querySlug(router.query.course), querySlug(router.query.class));
  // Keyed by scope so a session never mixes the questions of two scopes.
  return <StudentArea key={practicePath(scope)} user={auth.user} screen={screen} scope={scope} />;
}
