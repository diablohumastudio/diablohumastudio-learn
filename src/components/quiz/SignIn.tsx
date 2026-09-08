import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { quizDict } from '../../i18n/pages/quiz';
import { useT } from '../../i18n/useT';
import { getFirebaseAuth } from '../../lib/firebase';
import s from './SignIn.module.css';
import ui from './ui.module.css';

type Mode = 'signIn' | 'register' | 'reset';

type QuizTexts = Record<keyof (typeof quizDict)['en'], string>;

const ERROR_KEYS_BY_CODE: Record<string, keyof QuizTexts> = {
  'auth/invalid-credential': 'errorInvalidCredential',
  'auth/wrong-password': 'errorInvalidCredential',
  'auth/user-not-found': 'errorInvalidCredential',
  'auth/email-already-in-use': 'errorEmailInUse',
  'auth/weak-password': 'errorWeakPassword',
  'auth/invalid-email': 'errorInvalidEmail',
  'auth/popup-closed-by-user': 'errorPopupClosed',
  'auth/cancelled-popup-request': 'errorPopupClosed',
};

function errorText(t: QuizTexts, error: unknown): string {
  const code = (error as { code?: string })?.code ?? '';
  return t[ERROR_KEYS_BY_CODE[code] ?? 'errorGeneric'];
}

export default function SignIn() {
  const t = useT(quizDict);
  const [mode, setMode] = useState<Mode>('signIn');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  function switchMode(next: Mode) {
    setMode(next);
    setError('');
    setNotice('');
  }

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await action();
    } catch (caught) {
      setError(errorText(t, caught));
    } finally {
      setBusy(false);
    }
  }

  function signInWithGoogle() {
    run(async () => {
      await signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider());
    });
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const auth = getFirebaseAuth();
    run(async () => {
      if (mode === 'signIn') {
        await signInWithEmailAndPassword(auth, email, password);
      } else if (mode === 'register') {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(credential.user, { displayName: name.trim() });
      } else {
        await sendPasswordResetEmail(auth, email);
        setNotice(t.resetSent);
      }
    });
  }

  const submitLabel = mode === 'signIn' ? t.signInButton : mode === 'register' ? t.registerButton : t.resetButton;

  return (
    <div className={s.wrap}>
      <div className={s.heading}>
        <span className={ui.eyebrow}>{t.brand}</span>
        <h1 className={ui.title}>{t.signInTitle}</h1>
        <p className={ui.lede}>{t.signInLede}</p>
      </div>
      <div className={s.card}>
        <button type="button" className={s.google} onClick={signInWithGoogle} disabled={busy}>
          {t.continueWithGoogle}
        </button>
        <div className={s.divider}>{t.orWithEmail}</div>
        <form className={s.form} onSubmit={submit}>
          {mode === 'register' && (
            <label className={ui.field}>
              <span className={ui.label}>{t.nameLabel}</span>
              <input
                className={ui.input}
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>
          )}
          <label className={ui.field}>
            <span className={ui.label}>{t.emailLabel}</span>
            <input
              className={ui.input}
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          {mode !== 'reset' && (
            <label className={ui.field}>
              <span className={ui.label}>{t.passwordLabel}</span>
              <input
                className={ui.input}
                type="password"
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
          )}
          {error && <p className={ui.error}>{error}</p>}
          {notice && <p className={ui.notice}>{notice}</p>}
          <button type="submit" className={s.submit} disabled={busy}>
            {submitLabel}
          </button>
        </form>
        <div className={s.links}>
          {mode !== 'register' && (
            <button type="button" className={s.link} onClick={() => switchMode('register')}>
              {t.goToRegister}
            </button>
          )}
          {mode !== 'signIn' && (
            <button type="button" className={s.link} onClick={() => switchMode('signIn')}>
              {t.goToSignIn}
            </button>
          )}
          {mode === 'signIn' && (
            <button type="button" className={s.link} onClick={() => switchMode('reset')}>
              {t.goToReset}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
