import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { getFirestoreDb } from '../../lib/firebase';
import { useAuthUser } from './useAuthUser';

const TEACHERS_COLLECTION: string = 'teachers';

export type TeacherStatus = 'loading' | 'signedOut' | 'teacher' | 'notTeacher';

/* The header and the menus ask on every page, so one read per account is shared. */
const teacherChecksByUid: Map<string, Promise<boolean>> = new Map();

/** The rules let an account read only its own `teachers` doc, so this is a safe self-check. */
export function isTeacher(uid: string): Promise<boolean> {
  const pendingCheck = teacherChecksByUid.get(uid);
  if (pendingCheck) return pendingCheck;
  const check = getDoc(doc(getFirestoreDb(), TEACHERS_COLLECTION, uid)).then((snapshot) => snapshot.exists());
  teacherChecksByUid.set(uid, check);
  check.catch(() => teacherChecksByUid.delete(uid));
  return check;
}

export function useTeacherStatus(): TeacherStatus {
  const auth = useAuthUser();
  const [teacherUid, setTeacherUid] = useState<string | null>(null);
  const [checkedUid, setCheckedUid] = useState<string | null>(null);
  const uid = auth.status === 'signedIn' ? auth.user.uid : null;

  useEffect(() => {
    if (!uid) return;
    let cancelled = false;
    isTeacher(uid)
      .then((allowed) => {
        if (cancelled) return;
        setTeacherUid(allowed ? uid : null);
        setCheckedUid(uid);
      })
      .catch((error) => {
        console.error('Could not check the teacher role', error);
        if (!cancelled) setCheckedUid(uid);
      });
    return () => {
      cancelled = true;
    };
  }, [uid]);

  if (auth.status === 'loading') return 'loading';
  if (!uid) return 'signedOut';
  if (checkedUid !== uid) return 'loading';
  return teacherUid === uid ? 'teacher' : 'notTeacher';
}
