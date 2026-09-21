import { SHOWN_INCORRECT_ANSWERS, newAnswerId, shuffled } from '../practice/types';
import type { PracticeAnswer, PracticeQuestion } from '../practice/types';
import type { ExamQuestion, PaperQuestion } from './types';

/* How bank questions become an exam. The API routes are the only ones that do it for real
   (docs/exam.md); the teacher's preview runs the same code in the browser, so what it shows
   is what a student gets. Kept free of Firebase for that reason. */

/** Options are recorded by id; answers written before ids existed get one here. */
export function withAnswerIds(question: PracticeQuestion): { question: PracticeQuestion; changed: boolean } {
  let changed: boolean = false;
  function withId(answer: PracticeAnswer): PracticeAnswer {
    if (answer.id) return answer;
    changed = true;
    return { ...answer, id: newAnswerId() };
  }
  const correct = question.correct.map(withId);
  const incorrect = question.incorrect.map(withId);
  return { question: { ...question, correct, incorrect }, changed };
}

/** One random correct answer and three random wrong ones, the same four for every student. */
export function toPaperQuestion(question: PracticeQuestion): PaperQuestion {
  const correct = shuffled(question.correct)[0];
  const incorrect = shuffled(question.incorrect).slice(0, SHOWN_INCORRECT_ANSWERS);
  return {
    id: question.id,
    prompt: question.prompt,
    options: shuffled([correct, ...incorrect]).map((answer) => ({
      id: answer.id ?? '',
      text: { en: answer.en, es: answer.es },
    })),
    correctOptionId: correct.id ?? '',
  };
}

/** One student's exam: a random draw from the paper, options reshuffled, never the answer key. */
export function drawQuestions(paper: readonly PaperQuestion[], maxQuestions: number): ExamQuestion[] {
  return shuffled(paper)
    .slice(0, maxQuestions)
    .map((question) => ({ id: question.id, prompt: question.prompt, options: shuffled(question.options) }));
}
