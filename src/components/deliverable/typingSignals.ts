import { useEffect, useMemo, useRef } from 'react';
import {
  JUMP_CHARS,
  MAX_JUMPS,
  MAX_SAMPLES,
  SAMPLE_INTERVAL_MS,
  emptyTypingSignals,
} from '../../data/deliverable/types';
import type { TypingSignals } from '../../data/deliverable/types';

/* The record of how the text was typed. Pasting and dropping are refused by the fields, so what
   is left to a student who wants to hand in a copied text is to type it, have a tool type it, or
   inject it: the first shows as a human rhythm, the other two as a jump or an inhuman speed. None
   of this is a verdict; the teacher reads the numbers. */

const MS_PER_SECOND: number = 1000;
const SECONDS_PER_MINUTE: number = 60;
const SAMPLE_SECONDS: number = SAMPLE_INTERVAL_MS / MS_PER_SECOND;

export type TypingRecorder = {
  /** A copy of the signals so far, safe to store. */
  read: () => TypingSignals;
  /** One change of one field: the lengths before and after. */
  recordInput: (questionId: string, previousLength: number, nextLength: number) => void;
  recordPasteAttempt: () => void;
  recordDropAttempt: () => void;
};

function copyOf(signals: TypingSignals): TypingSignals {
  return { ...signals, jumps: signals.jumps.map((jump) => ({ ...jump })), samples: signals.samples.map((s) => ({ ...s })) };
}

/** Collects the typing signals of one deliverable. `initial` is what an earlier visit recorded
    (the draft kept in this browser, or the saved submission), so the timeline carries on.
    `totalChars` is read at every sample; `isActive` stops the clock once the deliverable is over. */
export function useTypingRecorder(
  initial: TypingSignals | null,
  totalChars: () => number,
  isActive: boolean
): TypingRecorder {
  const signalsRef = useRef<TypingSignals>(initial ? copyOf(initial) : emptyTypingSignals());
  // The timeline starts with the first keystroke, so an open tab nobody types in records nothing.
  const startedRef = useRef<boolean>(signalsRef.current.samples.length > 0 || signalsRef.current.elapsedSeconds > 0);
  const typedInWindowRef = useRef(false);
  const totalCharsRef = useRef(totalChars);
  totalCharsRef.current = totalChars;

  useEffect(() => {
    if (!isActive) return undefined;
    let previousChars = totalCharsRef.current();

    function sample(): void {
      const signals = signalsRef.current;
      if (!startedRef.current || document.visibilityState !== 'visible') return;
      const chars = totalCharsRef.current();
      const charsPerMinute = Math.max(0, chars - previousChars) * (SECONDS_PER_MINUTE / SAMPLE_SECONDS);
      previousChars = chars;
      signals.elapsedSeconds += SAMPLE_SECONDS;
      if (typedInWindowRef.current) signals.activeSeconds += SAMPLE_SECONDS;
      typedInWindowRef.current = false;
      if (charsPerMinute > signals.maxCharsPerMinute) signals.maxCharsPerMinute = charsPerMinute;
      if (signals.samples.length < MAX_SAMPLES) signals.samples.push({ atSeconds: signals.elapsedSeconds, chars });
    }

    function onBlur(): void {
      if (startedRef.current) signalsRef.current.focusLosses += 1;
    }

    const interval = window.setInterval(sample, SAMPLE_INTERVAL_MS);
    window.addEventListener('blur', onBlur);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('blur', onBlur);
    };
  }, [isActive]);

  return useMemo(
    () => ({
      read: () => copyOf(signalsRef.current),
      recordInput: (questionId, previousLength, nextLength) => {
        const signals = signalsRef.current;
        startedRef.current = true;
        typedInWindowRef.current = true;
        const added = nextLength - previousLength;
        if (added >= JUMP_CHARS && signals.jumps.length < MAX_JUMPS) {
          signals.jumps.push({ atSeconds: signals.elapsedSeconds, chars: added, questionId });
        }
      },
      recordPasteAttempt: () => {
        startedRef.current = true;
        signalsRef.current.pasteAttempts += 1;
      },
      recordDropAttempt: () => {
        startedRef.current = true;
        signalsRef.current.dropAttempts += 1;
      },
    }),
    []
  );
}
