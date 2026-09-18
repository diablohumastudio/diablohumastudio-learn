import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { getFirebaseAuth, isFirebaseConfigured } from '../../lib/firebase';

export type AuthState =
  | { status: 'loading' }
  | { status: 'signedOut' }
  | { status: 'signedIn'; user: User };

export function useAuthUser(): AuthState {
  const [state, setState] = useState<AuthState>({ status: 'loading' });

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setState({ status: 'signedOut' });
      return;
    }
    return onAuthStateChanged(getFirebaseAuth(), (user) => {
      setState(user ? { status: 'signedIn', user } : { status: 'signedOut' });
    });
  }, []);

  return state;
}
