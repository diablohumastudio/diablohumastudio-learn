import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { COURSES_PATH, querySlug } from '../../data/learn';
import { learnDict } from '../../i18n/learn';
import { useT } from '../../i18n/useT';
import { isFirebaseConfigured } from '../../lib/firebase';
import SignIn from './SignIn';
import ui from './ui.module.css';
import { useAuthUser } from './useAuthUser';

/** `next` comes from the URL, so only paths of this site are followed (`//host` would leave it). */
function returnPath(next: string | undefined): string {
  const staysOnSite = next !== undefined && next.startsWith('/') && !next.startsWith('//');
  return staysOnSite ? next : COURSES_PATH;
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
