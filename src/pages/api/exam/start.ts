import { Timestamp } from 'firebase-admin/firestore';
import type { ExamQuestion, PaperQuestion, StartExamResponse } from '../../../data/exam/types';
import { shuffled } from '../../../data/practice/types';
import { ExamApiError, attemptRef, examApiRoute, examRef, paperRef } from '../../../lib/examApi';

/* Without the key: this is the copy frozen into the attempt and sent to the browser. */
function drawQuestions(paper: PaperQuestion[], maxQuestions: number): ExamQuestion[] {
  return shuffled(paper)
    .slice(0, maxQuestions)
    .map((question) => ({ id: question.id, prompt: question.prompt, options: shuffled(question.options) }));
}

/** Safe to call again: a student who already started gets the same frozen draw back. */
export default examApiRoute(async (context): Promise<StartExamResponse> => {
  const { db, examId, caller } = context;

  return db.runTransaction(async (transaction) => {
    const examDoc = await transaction.get(examRef(db, examId));
    if (!examDoc.exists) throw new ExamApiError('notFound');
    const now = Timestamp.now();
    const closesAt: unknown = examDoc.get('closesAt');
    if (examDoc.get('status') !== 'opened' || !(closesAt instanceof Timestamp) || closesAt.toMillis() <= now.toMillis()) {
      throw new ExamApiError('notRunning');
    }
    const times = { closesAtMs: closesAt.toMillis(), serverNowMs: now.toMillis() };

    const attemptDoc = await transaction.get(attemptRef(db, examId, caller.uid));
    if (attemptDoc.exists) {
      return { attemptStatus: attemptDoc.get('status'), questions: attemptDoc.get('questions'), ...times };
    }

    const paperDoc = await transaction.get(paperRef(db, examId));
    const questions = drawQuestions(paperDoc.get('questions') ?? [], Number(examDoc.get('maxQuestions')));
    transaction.set(attemptRef(db, examId, caller.uid), {
      displayName: caller.name ?? '',
      email: caller.email ?? '',
      status: 'started',
      questions,
      answers: {},
      startedAt: now,
      submittedAt: null,
      late: false,
      lateBySeconds: 0,
    });
    return { attemptStatus: 'started', questions, ...times };
  });
});
