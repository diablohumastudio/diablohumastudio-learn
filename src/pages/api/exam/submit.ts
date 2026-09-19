import { Timestamp } from 'firebase-admin/firestore';
import { SUBMIT_GRACE_MS } from '../../../data/exam/types';
import type { ExamAnswers, ExamQuestion, PaperQuestion } from '../../../data/exam/types';
import { ExamApiError, attemptRef, examApiRoute, examRef, gradeRef, paperRef } from '../../../lib/examApi';

const MS_PER_SECOND: number = 1000;

/* Only answers to the questions of this attempt, and only options that were shown for them. */
function acceptedAnswers(sent: unknown, questions: ExamQuestion[]): ExamAnswers {
  const answers: ExamAnswers = {};
  if (typeof sent !== 'object' || sent === null) return answers;
  for (const question of questions) {
    const optionId: unknown = (sent as Record<string, unknown>)[question.id];
    if (question.options.some((option) => option.id === optionId)) answers[question.id] = optionId as string;
  }
  return answers;
}

function correctOptionIdsOf(questions: ExamQuestion[], paper: PaperQuestion[]): Record<string, string> {
  const correctOptionIds: Record<string, string> = {};
  for (const question of questions) {
    const paperQuestion = paper.find((candidate) => candidate.id === question.id);
    if (paperQuestion) correctOptionIds[question.id] = paperQuestion.correctOptionId;
  }
  return correctOptionIds;
}

/** The only write of answers, graded on arrival. Arriving after the end (plus the grace) is
    accepted but stamped late with the server's clock, for the teacher to judge. */
export default examApiRoute(async (context) => {
  const { db, examId, caller, body } = context;

  return db.runTransaction(async (transaction) => {
    const examDoc = await transaction.get(examRef(db, examId));
    const attemptDoc = await transaction.get(attemptRef(db, examId, caller.uid));
    const closesAt: unknown = examDoc.get('closesAt');
    if (!examDoc.exists || !(closesAt instanceof Timestamp)) throw new ExamApiError('notFound');
    if (!attemptDoc.exists) throw new ExamApiError('notStarted');
    // A retry of a submit that did arrive: the first one stands.
    if (attemptDoc.get('status') === 'submitted') return { submitted: true };

    const now = Timestamp.now();
    const questions: ExamQuestion[] = attemptDoc.get('questions');
    const answers = acceptedAnswers(body.answers, questions);
    const paperDoc = await transaction.get(paperRef(db, examId));
    const correctOptionIds = correctOptionIdsOf(questions, paperDoc.get('questions') ?? []);
    const msAfterEnd = now.toMillis() - closesAt.toMillis();
    const late = msAfterEnd > SUBMIT_GRACE_MS;

    transaction.update(attemptRef(db, examId, caller.uid), {
      status: 'submitted',
      answers,
      submittedAt: now,
      late,
      lateBySeconds: late ? Math.round(msAfterEnd / MS_PER_SECOND) : 0,
    });
    transaction.set(gradeRef(db, examId, caller.uid), {
      score: questions.filter((question) => question.id in answers && answers[question.id] === correctOptionIds[question.id])
        .length,
      total: questions.length,
      correctOptionIds,
    });
    return { submitted: true };
  });
});
