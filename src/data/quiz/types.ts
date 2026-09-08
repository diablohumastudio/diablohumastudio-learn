import type { Dictionary } from '../../i18n/useT';

export type QuizQuestion = {
  /** Stable and never reused: every student's stats are keyed by it (e.g. 'wu-001'). */
  id: string;
  /** Class slug from src/data/learn.ts, so results can be grouped by class. */
  topic?: string;
  prompt: Dictionary<string>;
  /** Two to five choices. */
  choices: Dictionary<string>[];
  correctIndex: number;
  explanation?: Dictionary<string>;
};

export type ShuffledChoice = {
  /** Index into `question.choices`; compare with `question.correctIndex`. */
  originalIndex: number;
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

export function shuffleChoices(question: QuizQuestion): ShuffledChoice[] {
  return shuffled(question.choices.map((text, originalIndex) => ({ originalIndex, text })));
}
