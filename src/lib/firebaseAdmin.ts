import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import type { App, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import type { Auth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import type { Firestore } from 'firebase-admin/firestore';

/* Server only (API routes). FIREBASE_SERVICE_ACCOUNT holds the whole service-account JSON
   on one line; it is a secret and bypasses the Firestore rules. See docs/exam.md. */

export function isFirebaseAdminConfigured(): boolean {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT);
}

/* A double-quoted value in an env file gets the `\n` of the private key turned into real line
   breaks, which JSON forbids inside a string. The one-line JSON has no other line breaks, so
   escaping them all back makes both ways of writing the variable work. */
function serviceAccount(): ServiceAccount {
  return JSON.parse((process.env.FIREBASE_SERVICE_ACCOUNT ?? '').replace(/\r?\n/g, '\\n'));
}

function getAdminApp(): App {
  if (getApps().length > 0) return getApp();
  return initializeApp({ credential: cert(serviceAccount()) });
}

export function getAdminAuth(): Auth {
  return getAuth(getAdminApp());
}

export function getAdminDb(): Firestore {
  return getFirestore(getAdminApp());
}
