import { ExamApiError, examApiRoute, examLockRef, examRef, requireTeacher } from '../../../lib/examApi';

/** Deletes an exam in any state with everything under it: the paper, the attempts and the grades,
    which browsers may never write or delete. A running exam releases the practice lock on its way
    out. Drafts have nothing underneath and the browser deletes them itself (the rules allow it). */
export default examApiRoute(async (context) => {
  const { db, examId } = context;
  await requireTeacher(context);

  const examDoc = await examRef(db, examId).get();
  if (!examDoc.exists) throw new ExamApiError('notFound');

  const lockDoc = await examLockRef(db).get();
  if (lockDoc.get('examId') === examId) await examLockRef(db).delete();
  await db.recursiveDelete(examRef(db, examId));

  return { deleted: true };
});
