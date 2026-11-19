import type { CSSProperties } from 'react';

/* What a deck says in one step: the text to read and, once its voice has been
   generated, the audio and the second at which each turn of the step enters. */
export type StepNarration = {
  text: string;
  audioUrl?: string;
  turnSeconds: Record<string, number>;
};

/** The narration of a deck in one language, by step id (the keys of the deck dictionary's `labels`). */
export type DeckNarration = Record<string, StepNarration>;

/* One entry of `<class>.narracion-tiempos.json`, written by narration/scripts/generate-narration.js. */
type StepTiming = { duration: number; marks: Record<string, number>; version: string };

const TURN_MARK_PATTERN: RegExp = /\s*\[\d+\]\s*/g;

function withoutTurnMarks(narration: string): string {
  return narration
    .replace(TURN_MARK_PATTERN, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .trim();
}

export function buildNarration(texts: Record<string, string>, timings: Record<string, StepTiming> | undefined, audioBase: string): DeckNarration {
  const narration: DeckNarration = {};
  for (const [stepId, text] of Object.entries(texts)) {
    const timing: StepTiming | undefined = timings?.[stepId];
    narration[stepId] = {
      text: withoutTurnMarks(text),
      audioUrl: timing ? `${audioBase}${stepId}.mp3?v=${timing.version}` : undefined,
      turnSeconds: timing ? timing.marks : {},
    };
  }
  return narration;
}

/* The deck sets these on the slide; a deck reads them as `var(--turn-<n>, <silent delay>)`,
   so without voice every turn keeps its own delay. */
export function turnDelayVariables(turnSeconds: Record<string, number>): CSSProperties {
  return Object.fromEntries(Object.entries(turnSeconds).map(([turn, seconds]) => [`--turn-${turn}`, `${seconds}s`])) as CSSProperties;
}

export function lastTurnSeconds(turnSeconds: Record<string, number>): number {
  return Math.max(0, ...Object.values(turnSeconds));
}
