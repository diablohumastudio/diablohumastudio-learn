import { signOut } from 'firebase/auth';
import { quizDict } from '../../i18n/pages/quiz';
import { useT } from '../../i18n/useT';
import { getFirebaseAuth, isFirebaseConfigured } from '../../lib/firebase';
import s from './QuizLayout.module.css';
import { useAuthUser } from './useAuthUser';

export default function UserMenu() {
  const t = useT(quizDict);
  const auth = useAuthUser();

  if (!isFirebaseConfigured() || auth.status !== 'signedIn') return null;

  return (
    <span className={s.userMenu}>
      <span className={s.userName}>{auth.user.displayName ?? auth.user.email}</span>
      <button type="button" className={s.signOutBtn} onClick={() => signOut(getFirebaseAuth())}>
        {t.signOut}
      </button>
    </span>
  );
}
