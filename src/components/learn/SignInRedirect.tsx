import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { SIGN_IN_PATH } from '../../data/learn';
import { learnDict } from '../../i18n/learn';
import { useT } from '../../i18n/useT';
import ui from './ui.module.css';

/** Pages that need an account send a guest to the sign-in page, which brings them back here. */
export default function SignInRedirect() {
  const t = useT(learnDict);
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    router.replace({ pathname: SIGN_IN_PATH, query: { next: router.asPath } });
  }, [router]);

  return (
    <div className={ui.centered}>
      <span className={ui.mono}>{t.loading}</span>
    </div>
  );
}
