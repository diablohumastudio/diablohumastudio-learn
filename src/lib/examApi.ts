import type { DecodedIdToken } from 'firebase-admin/auth';
import type { DocumentReference, DocumentSnapshot, Firestore, Transaction } from 'firebase-admin/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';
import { assignmentOf, isAssignedTo } from '../data/course/assignment';
import { COURSES_COLLECTION, MEMBERS_SUBCOLLECTION } from '../data/course/types';
import {
  ATTEMPTS_SUBCOLLECTION,
  EXAMS_COLLECTION,
  EXAM_LOCK_DOC_ID,
  GRADES_SUBCOLLECTION,
  PAPER_DOC_ID,
  PRIVATE_SUBCOLLECTION,
  SETTINGS_COLLECTION,
} from '../data/exam/types';
import type { ExamApiErrorCode } from '../data/exam/types';
import { getAdminAuth, getAdminDb, isFirebaseAdminConfigured } from './firebaseAdmin';

const BEARER_PREFIX: string = 'Bearer ';
const TEACHERS_COLLECTION: string = 'teachers';

const STATUS_BY_ERROR: Record<ExamApiErrorCode, number> = {
  unauthenticated: 401,
  notTeacher: 403,
  notEnrolled: 403,
  badRequest: 400,
  notFound: 404,
  notDraft: 409,
  notRunning: 409,
  anotherExamRunning: 409,
  noQuestions: 409,
  notStarted: 409,
  serverNotConfigured: 503,
  internal: 500,
};

export class ExamApiError extends Error {
  code: ExamApiErrorCode;

  constructor(code: ExamApiErrorCode) {
    super(code);
    this.code = code;
  }
}

export type ExamApiContext = {
  db: Firestore;
  caller: DecodedIdToken;
  examId: string;
  body: Record<string, unknown>;
};

async function verifiedCaller(req: NextApiRequest): Promise<DecodedIdToken> {
  const header = req.headers.authorization ?? '';
  if (!header.startsWith(BEARER_PREFIX)) throw new ExamApiError('unauthenticated');
  try {
    return await getAdminAuth().verifyIdToken(header.slice(BEARER_PREFIX.length));
  } catch {
    throw new ExamApiError('unauthenticated');
  }
}

function teacherRef(context: ExamApiContext): DocumentReference {
  return context.db.collection(TEACHERS_COLLECTION).doc(context.caller.uid);
}

export async function requireTeacher(context: ExamApiContext): Promise<void> {
  const teacherDoc = await teacherRef(context).get();
  if (!teacherDoc.exists) throw new ExamApiError('notTeacher');
}

/** A student may take only an exam that is for them: enrolled in its course and among the
    assigned (docs/courses.md). The rules do not cover the API, so the route checks here, inside
    its transaction. Teachers may take any exam, to try it. */
export async function requireExaminee(context: ExamApiContext, examDoc: DocumentSnapshot, transaction: Transaction): Promise<void> {
  const courseSlug: unknown = examDoc.get('courseSlug');
  if (typeof courseSlug !== 'string' || courseSlug === '') throw new ExamApiError('notEnrolled');
  const memberRef = context.db.collection(COURSES_COLLECTION).doc(courseSlug).collection(MEMBERS_SUBCOLLECTION).doc(context.caller.uid);
  const [memberDoc, teacherDoc] = await Promise.all([transaction.get(memberRef), transaction.get(teacherRef(context))]);
  if (teacherDoc.exists) return;
  if (!memberDoc.exists || !isAssignedTo(assignmentOf(examDoc.data() ?? {}), context.caller.uid)) {
    throw new ExamApiError('notEnrolled');
  }
}

export function examRef(db: Firestore, examId: string): DocumentReference {
  return db.collection(EXAMS_COLLECTION).doc(examId);
}

export function paperRef(db: Firestore, examId: string): DocumentReference {
  return examRef(db, examId).collection(PRIVATE_SUBCOLLECTION).doc(PAPER_DOC_ID);
}

export function attemptRef(db: Firestore, examId: string, uid: string): DocumentReference {
  return examRef(db, examId).collection(ATTEMPTS_SUBCOLLECTION).doc(uid);
}

export function gradeRef(db: Firestore, examId: string, uid: string): DocumentReference {
  return examRef(db, examId).collection(GRADES_SUBCOLLECTION).doc(uid);
}

export function examLockRef(db: Firestore): DocumentReference {
  return db.collection(SETTINGS_COLLECTION).doc(EXAM_LOCK_DOC_ID);
}

/** Wraps an exam route: POST only, signed-in caller, `examId` in the body, errors as `{ error: code }`. */
export function examApiRoute<T>(handle: (context: ExamApiContext) => Promise<T>) {
  return async function route(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
      if (req.method !== 'POST') throw new ExamApiError('badRequest');
      if (!isFirebaseAdminConfigured()) throw new ExamApiError('serverNotConfigured');
      const caller = await verifiedCaller(req);
      const body: Record<string, unknown> = typeof req.body === 'object' && req.body !== null ? req.body : {};
      const examId = typeof body.examId === 'string' ? body.examId : '';
      if (examId === '' || examId.includes('/')) throw new ExamApiError('badRequest');
      res.status(200).json(await handle({ db: getAdminDb(), caller, examId, body }));
    } catch (error) {
      const code: ExamApiErrorCode = error instanceof ExamApiError ? error.code : 'internal';
      if (code === 'internal') console.error('Exam API failed', error);
      res.status(STATUS_BY_ERROR[code]).json({ error: code });
    }
  };
}
