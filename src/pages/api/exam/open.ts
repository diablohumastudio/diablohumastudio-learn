import { Timestamp } from 'firebase-admin/firestore';
import type { Firestore } from 'firebase-admin/firestore';
import { toPaperQuestion, withAnswerIds } from '../../../data/exam/paper';
import { parseQuestion } from '../../../data/practice/parse';
import { parseQuestionIds, questionsWithIds } from '../../../data/practice/selection';
import { EXAM_QUESTIONS_COLLECTION, QUESTIONS_COLLECTION } from '../../../data/practice/types';
import type { PracticeQuestion } from '../../../data/practice/types';
import { ExamApiError, examApiRoute, examLockRef, examRef, paperRef, requireTeacher } from '../../../lib/examApi';

const MS_PER_MINUTE: number = 60_000;

type BankRead = {
  questions: PracticeQuestion[];
  /** Questions that had answers without an id; the ids given here are saved back to the bank. */
  questionsGivenIds: PracticeQuestion[];
};

/** Reads one of the two banks; `examOnly` marks the questions of the teacher-only one. */
async function readActiveBank(db: Firestore, collectionName: string, examOnly: boolean): Promise<BankRead> {
  const bank: BankRead = { questions: [], questionsGivenIds: [] };
  const snapshot = await db.collection(collectionName).get();
  for (const questionDoc of snapshot.docs) {
    try {
      const { question, changed } = withAnswerIds(parseQuestion(questionDoc.id, questionDoc.data()));
      if (question.retired) continue;
      bank.questions.push(examOnly ? { ...question, examOnly: true } : question);
      if (changed) bank.questionsGivenIds.push(question);
    } catch (error) {
      console.warn('Skipping a malformed question', error);
    }
  }
  return bank;
}

export default examApiRoute(async (context) => {
  const { db, examId } = context;
  await requireTeacher(context);

  const examDoc = await examRef(db, examId).get();
  if (!examDoc.exists) throw new ExamApiError('notFound');
  if (examDoc.get('status') !== 'draft') throw new ExamApiError('notDraft');

  const now = Timestamp.now();
  const lockDoc = await examLockRef(db).get();
  const lockedUntil: unknown = lockDoc.get('closesAt');
  if (lockedUntil instanceof Timestamp && lockedUntil.toMillis() > now.toMillis()) {
    throw new ExamApiError('anotherExamRunning');
  }

  const practiceBank = await readActiveBank(db, QUESTIONS_COLLECTION, false);
  const examOnlyBank = await readActiveBank(db, EXAM_QUESTIONS_COLLECTION, true);
  const paper = questionsWithIds(
    [...practiceBank.questions, ...examOnlyBank.questions],
    parseQuestionIds(examDoc.get('questionIds'))
  ).map(toPaperQuestion);
  if (paper.length === 0) throw new ExamApiError('noQuestions');

  const closesAt = Timestamp.fromMillis(now.toMillis() + Number(examDoc.get('durationMinutes')) * MS_PER_MINUTE);
  const batch = db.batch();
  const banks: [string, BankRead][] = [
    [QUESTIONS_COLLECTION, practiceBank],
    [EXAM_QUESTIONS_COLLECTION, examOnlyBank],
  ];
  for (const [collectionName, bank] of banks) {
    for (const question of bank.questionsGivenIds) {
      batch.update(db.collection(collectionName).doc(question.id), {
        correct: question.correct,
        incorrect: question.incorrect,
      });
    }
  }
  batch.set(paperRef(db, examId), { questions: paper });
  batch.update(examRef(db, examId), { status: 'opened', openedAt: now, closesAt, paperSize: paper.length });
  batch.set(examLockRef(db), { examId, closesAt });
  await batch.commit();

  return { closesAtMs: closesAt.toMillis() };
});
