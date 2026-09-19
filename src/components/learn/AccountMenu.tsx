import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { SIGN_IN_PATH } from '../../data/learn';
import { learnDict } from '../../i18n/learn';
import { useT } from '../../i18n/useT';
import { getFirebaseAuth, isFirebaseConfigured } from '../../lib/firebase';
import LanguageSwitch from '../LanguageSwitch';
import ConfigDialog from './ConfigDialog';
import s from './LearnHeader.module.css';
import TeacherLink from './TeacherLink';
import { useAuthUser } from './useAuthUser';
import { toggleFullscreen, useIsFullscreen } from './useFullscreen';

/** The header's only control: the account name opens everything that is not page-specific. */
export default function AccountMenu() {
  const t = useT(learnDict);
  const router = useRouter();
  const auth = useAuthUser();
  const isFullscreen = useIsFullscreen();
  const [isOpen, setIsOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutsidePress);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePress);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  // Following a link of the menu closes it.
  useEffect(() => setIsOpen(false), [router.asPath, router.locale]);

  const isSignedIn = isFirebaseConfigured() && auth.status === 'signedIn';
  const canSignIn = isFirebaseConfigured() && auth.status === 'signedOut' && router.pathname !== SIGN_IN_PATH;
  const accountName = auth.status === 'signedIn' ? auth.user.displayName ?? auth.user.email : t.guestUser;

  return (
    <div className={s.account} ref={menuRef}>
      <button
        type="button"
        className={s.accountBtn}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={s.userName}>{accountName}</span>
        <span aria-hidden="true">▾</span>
      </button>

      {isOpen && (
        <div className={s.menu} role="menu">
          {isSignedIn && <TeacherLink className={s.menuItem} />}
          <div className={s.menuRow}>
            <span>{t.languageLabel}</span>
            <LanguageSwitch className={s.languageSwitch} />
          </div>
          <button type="button" className={s.menuItem} role="menuitem" onClick={toggleFullscreen}>
            {isFullscreen ? t.exitFullscreen : t.fullscreen}
          </button>
          <button
            type="button"
            className={s.menuItem}
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              setIsConfigOpen(true);
            }}
          >
            {t.config}
          </button>
          {canSignIn && (
            <Link
              href={{ pathname: SIGN_IN_PATH, query: { next: router.asPath } }}
              className={s.menuItemAccent}
              role="menuitem"
            >
              {t.signIn}
            </Link>
          )}
          {isSignedIn && (
            <button
              type="button"
              className={s.menuItemAccent}
              role="menuitem"
              onClick={() => signOut(getFirebaseAuth())}
            >
              {t.signOut}
            </button>
          )}
        </div>
      )}

      {isConfigOpen && <ConfigDialog onClose={() => setIsConfigOpen(false)} />}
    </div>
  );
}
