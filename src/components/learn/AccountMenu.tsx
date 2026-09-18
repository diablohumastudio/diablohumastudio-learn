import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SIGN_IN_PATH, TEACHER_PATH } from '../../data/learn';
import { learnDict } from '../../i18n/learn';
import { useT } from '../../i18n/useT';
import { getFirebaseAuth, isFirebaseConfigured } from '../../lib/firebase';
import s from './LearnHeader.module.css';
import TeacherLink from './TeacherLink';
import { useAuthUser } from './useAuthUser';

export default function AccountMenu() {
  const t = useT(learnDict);
  const router = useRouter();
  const auth = useAuthUser();

  if (!isFirebaseConfigured() || auth.status === 'loading') return null;

  if (auth.status === 'signedOut') {
    const isSignInPage = router.pathname === SIGN_IN_PATH;
    return (
      <span className={s.account}>
        <span className={s.userName}>{t.guestUser}</span>
        {!isSignInPage && (
          <Link href={{ pathname: SIGN_IN_PATH, query: { next: router.asPath } }} className={s.headerBtn}>
            {t.signIn}
          </Link>
        )}
      </span>
    );
  }

  return (
    <span className={s.account}>
      {router.pathname !== TEACHER_PATH && <TeacherLink className={s.headerBtn} />}
      <span className={s.userName}>{auth.user.displayName ?? auth.user.email}</span>
      <button type="button" className={s.headerBtn} onClick={() => signOut(getFirebaseAuth())}>
        {t.signOut}
      </button>
    </span>
  );
}
