import type { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { quizDict } from '../../i18n/pages/quiz';
import { useT } from '../../i18n/useT';
import { isFirebaseConfigured } from '../../lib/firebase';
import Player from './Player';
import QuizHome from './QuizHome';
import SignIn from './SignIn';
import { ensureStudentProfile, subscribeStudent } from './progress';
import type { StudentStats } from './progress';
import ui from './ui.module.css';
import { useAuthUser } from './useAuthUser';

function StudentArea({ user }: { user: User }) {
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    ensureStudentProfile(user).catch((error) => console.error('Could not save the student profile', error));
    return subscribeStudent(user.uid, setStats);
  }, [user]);

  if (playing) {
    return <Player uid={user.uid} lifetime={stats} onStop={() => setPlaying(false)} />;
  }
  return <QuizHome user={user} stats={stats} onPlay={() => setPlaying(true)} />;
}

export default function QuizApp() {
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
  return <StudentArea user={auth.user} />;
}
