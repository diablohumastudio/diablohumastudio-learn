import type { Dictionary } from '../../i18n/useT';

export const MIN_CORRECT_ANSWERS: number = 1;
export const MIN_INCORRECT_ANSWERS: number = 3;
/** Every display shows one correct answer plus this many wrong ones. */
export const SHOWN_INCORRECT_ANSWERS: number = 3;

export type QuizQuestion = {
  /** Stable and never reused: every student's stats are keyed by it (e.g. 'wu-001'). */
  id: string;
  /** Class slug from src/data/learn.ts, so results can be grouped by class. */
  topic?: string;
  prompt: Dictionary<string>;
  /** At least one; a random one is shown each time. */
  correct: Dictionary<string>[];
  /** At least three; a random subset is shown each time. */
  incorrect: Dictionary<string>[];
  explanation?: Dictionary<string>;
  /** Retired questions are kept so old stats still resolve, but are never asked. */
  retired: boolean;
};

export type ShuffledChoice = {
  isCorrect: boolean;
  text: Dictionary<string>;
};

function shuffled<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** The whole bank in a fresh random order: walk it, then ask for a new cycle. */
export function shuffledCycle(questions: readonly QuizQuestion[]): QuizQuestion[] {
  return shuffled(questions);
}

/** One random correct answer and a random subset of the wrong ones, in random order. */
export function drawChoices(question: QuizQuestion): ShuffledChoice[] {
  const correct = shuffled(question.correct).slice(0, 1);
  const incorrect = shuffled(question.incorrect).slice(0, SHOWN_INCORRECT_ANSWERS);
  return shuffled([
    ...correct.map((text) => ({ isCorrect: true, text })),
    ...incorrect.map((text) => ({ isCorrect: false, text })),
  ]);
}
