import { Timestamp } from 'firebase-admin/firestore';
import { ExamApiError, examApiRoute, examLockRef, examRef, requireTeacher } from '../../../lib/examApi';

/** "Close early": moves the end of a running exam to now, which also releases the results. */
export default examApiRoute(async (context) => {
  const { db, examId } = context;
  await requireTeacher(context);

  const examDoc = await examRef(db, examId).get();
  if (!examDoc.exists) throw new ExamApiError('notFound');
  const now = Timestamp.now();
  const closesAt: unknown = examDoc.get('closesAt');
  if (examDoc.get('status') !== 'opened' || !(closesAt instanceof Timestamp) || closesAt.toMillis() <= now.toMillis()) {
    throw new ExamApiError('notRunning');
  }

  const batch = db.batch();
  batch.update(examRef(db, examId), { closesAt: now });
  const lockDoc = await examLockRef(db).get();
  if (lockDoc.get('examId') === examId) batch.update(examLockRef(db), { closesAt: now });
  await batch.commit();

  return { closesAtMs: now.toMillis() };
});
