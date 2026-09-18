import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { LEARN_BASE_PATH, querySlug } from '../../data/learn';
import { learnDict } from '../../i18n/learn';
import { useT } from '../../i18n/useT';
import { isFirebaseConfigured } from '../../lib/firebase';
import SignIn from './SignIn';
import ui from './ui.module.css';
import { useAuthUser } from './useAuthUser';

/** `next` comes from the URL, so only paths inside the section are followed. */
function returnPath(next: string | undefined): string {
  const staysInSection = next !== undefined && (next === LEARN_BASE_PATH || next.startsWith(`${LEARN_BASE_PATH}/`));
  return staysInSection ? next : LEARN_BASE_PATH;
}

export default function SignInGate() {
  const t = useT(learnDict);
  const router = useRouter();
  const auth = useAuthUser();
  const isSignedIn = auth.status === 'signedIn';

  useEffect(() => {
    if (!isSignedIn || !router.isReady) return;
    router.replace(returnPath(querySlug(router.query.next)));
  }, [isSignedIn, router]);

  if (!isFirebaseConfigured()) {
    return (
      <div className={ui.centered}>
        <p className={ui.error}>{t.notConfigured}</p>
      </div>
    );
  }
  if (auth.status !== 'signedOut') {
    return (
      <div className={ui.centered}>
        <span className={ui.mono}>{t.loading}</span>
      </div>
    );
  }
  return <SignIn />;
}
