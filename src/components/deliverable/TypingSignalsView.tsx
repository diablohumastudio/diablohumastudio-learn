import { JUMP_CHARS } from '../../data/deliverable/types';
import type { DeliverableQuestion, TypingSignals } from '../../data/deliverable/types';
import { deliverableDict } from '../../i18n/pages/deliverable';
import { useT } from '../../i18n/useT';
import ui from '../learn/ui.module.css';
import s from './TypingSignalsView.module.css';
import { elapsedText } from './format';

const CHART_WIDTH: number = 600;
const CHART_HEIGHT: number = 72;
const CHART_PADDING: number = 4;
const JUMP_DOT_RADIUS: number = 3;

type TypingSignalsViewProps = {
  signals: TypingSignals | null;
  questions: readonly DeliverableQuestion[];
  /** Characters in the saved answers: the end of the timeline. */
  charsWritten: number;
};

/** Anything a pasted or injected text would leave behind: the teacher judges, this only shows. */
export function hasSuspiciousSignals(signals: TypingSignals | null): boolean {
  if (!signals) return false;
  return signals.pasteAttempts > 0 || signals.dropAttempts > 0 || signals.jumps.length > 0;
}

function TimelineChart({ signals }: { signals: TypingSignals }) {
  const samples = signals.samples;
  if (samples.length < 2) return null;
  const maxSeconds = Math.max(samples[samples.length - 1].atSeconds, 1);
  const maxChars = Math.max(...samples.map((sample) => sample.chars), 1);
  const innerWidth = CHART_WIDTH - CHART_PADDING * 2;
  const innerHeight = CHART_HEIGHT - CHART_PADDING * 2;
  const x = (seconds: number) => CHART_PADDING + (seconds / maxSeconds) * innerWidth;
  const y = (chars: number) => CHART_PADDING + innerHeight - (chars / maxChars) * innerHeight;
  const points = samples.map((sample) => `${x(sample.atSeconds)},${y(sample.chars)}`).join(' ');
  const charsAt = (seconds: number) => samples.find((sample) => sample.atSeconds >= seconds)?.chars ?? maxChars;

  return (
    <svg className={s.chart} viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} preserveAspectRatio="none" role="img">
      <polyline className={s.line} points={points} />
      {signals.jumps.map((jump, index) => (
        <circle key={index} className={s.jump} cx={x(jump.atSeconds)} cy={y(charsAt(jump.atSeconds))} r={JUMP_DOT_RADIUS} />
      ))}
    </svg>
  );
}

export default function TypingSignalsView({ signals, questions, charsWritten }: TypingSignalsViewProps) {
  const t = useT(deliverableDict);

  if (!signals) return <p className={ui.mono}>{t.noSignals}</p>;

  function questionNumber(questionId: string): string {
    const index = questions.findIndex((question) => question.id === questionId);
    return index === -1 ? '?' : String(index + 1);
  }

  const stats: { label: string; value: string; flagged: boolean }[] = [
    { label: t.signalPasteAttempts, value: String(signals.pasteAttempts), flagged: signals.pasteAttempts > 0 },
    { label: t.signalDropAttempts, value: String(signals.dropAttempts), flagged: signals.dropAttempts > 0 },
    {
      label: t.signalJumps.replace('{min}', String(JUMP_CHARS)),
      value: String(signals.jumps.length),
      flagged: signals.jumps.length > 0,
    },
    { label: t.signalFocusLosses, value: String(signals.focusLosses), flagged: false },
    {
      label: `${t.signalMaxSpeed} (${t.signalCharsPerMinute})`,
      value: String(Math.round(signals.maxCharsPerMinute)),
      flagged: false,
    },
    { label: t.signalActiveTime, value: elapsedText(signals.activeSeconds), flagged: false },
    { label: t.signalElapsedTime, value: elapsedText(signals.elapsedSeconds), flagged: false },
    { label: t.signalChars, value: String(charsWritten), flagged: false },
  ];

  return (
    <section className={s.signals}>
      <span className={ui.eyebrow}>{t.signalsTitle}</span>
      <div className={ui.stats}>
        {stats.map((stat) => (
          <div key={stat.label} className={ui.stat}>
            <span className={stat.flagged ? `${ui.statValue} ${s.flag}` : ui.statValue}>{stat.value}</span>
            <span className={ui.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>
      <TimelineChart signals={signals} />
      {signals.jumps.length > 0 && (
        <ul className={s.jumpList}>
          {signals.jumps.map((jump, index) => (
            <li key={index} className={ui.mono}>
              {t.signalJumpDetail
                .replace('{chars}', String(jump.chars))
                .replace('{time}', elapsedText(jump.atSeconds))
                .replace('{number}', questionNumber(jump.questionId))}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
