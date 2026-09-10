import { useEffect, useRef, useState } from 'react';
import { drawChoices, questionTopicTitle, shuffledCycle } from '../../data/quiz';
import type { QuizQuestion, ShuffledChoice } from '../../data/quiz';
import { quizDict } from '../../i18n/pages/quiz';
import { useLocale, useT } from '../../i18n/useT';
import { percentText } from './format';
import s from './Player.module.css';
import { newSessionId, recordAnswer } from './progress';
import type { StudentStats } from './progress';
import ui from './ui.module.css';

const CHOICE_KEYS: string = 'ABCDE';

type PlayerProps = {
  uid: string;
  questions: QuizQuestion[];
  lifetime: StudentStats | null;
  onStop: () => void;
};

type Turn = {
  cycle: QuizQuestion[];
  position: number;
  choices: ShuffledChoice[];
  /** Index into `choices`. */
  picked: number | null;
};

type SessionCount = { answered: number; correct: number };

function firstTurn(questions: QuizQuestion[]): Turn {
  const cycle = shuffledCycle(questions);
  return { cycle, position: 0, choices: drawChoices(cycle[0]), picked: null };
}

/** Advances one question; when the cycle is exhausted, starts a freshly shuffled one. */
function nextTurn(turn: Turn, questions: QuizQuestion[]): Turn {
  const exhausted = turn.position + 1 >= turn.cycle.length;
  const cycle = exhausted ? shuffledCycle(questions) : turn.cycle;
  const position = exhausted ? 0 : turn.position + 1;
  return { cycle, position, choices: drawChoices(cycle[position]), picked: null };
}

function choiceClassName(choice: ShuffledChoice, index: number, picked: number | null): string {
  if (picked === null) return s.choice;
  if (choice.isCorrect) return `${s.choice} ${s.choiceCorrect}`;
  if (index === picked) return `${s.choice} ${s.choiceWrong}`;
  return `${s.choice} ${s.choiceDim}`;
}

export default function Player({ uid, questions, lifetime, onStop }: PlayerProps) {
  const t = useT(quizDict);
  const locale = useLocale();
  const [sessionId] = useState(() => newSessionId(uid));
  const [turn, setTurn] = useState<Turn>(() => firstTurn(questions));
  const [session, setSession] = useState<SessionCount>({ answered: 0, correct: 0 });
  const [saveFailed, setSaveFailed] = useState(false);
  const keyHandlerRef = useRef<(event: KeyboardEvent) => void>(() => {});

  const question = turn.cycle[turn.position];
  const answered = turn.picked !== null;
  const wasCorrect = turn.picked !== null && turn.choices[turn.picked].isCorrect;

  function answer(index: number) {
    if (answered) return;
    const isCorrect = turn.choices[index].isCorrect;
    const isFirstAnswerOfSession = session.answered === 0;
    setTurn({ ...turn, picked: index });
    setSession({ answered: session.answered + 1, correct: session.correct + (isCorrect ? 1 : 0) });
    recordAnswer(uid, sessionId, question.id, isCorrect, isFirstAnswerOfSession).catch((error) => {
      console.error('Could not save the answer', error);
      setSaveFailed(true);
    });
  }

  function next() {
    if (!answered) return;
    setTurn(nextTurn(turn, questions));
  }

  keyHandlerRef.current = (event: KeyboardEvent) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
    const digit = Number(event.key);
    if (!answered && digit >= 1 && digit <= turn.choices.length) {
      event.preventDefault();
      answer(digit - 1);
      return;
    }
    if (answered && (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowRight')) {
      event.preventDefault();
      next();
    }
  };

  // One listener for the whole play; it reads the latest handler through the ref.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => keyHandlerRef.current(event);
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const topicTitle = questionTopicTitle(question, locale);
  const lifetimeAnswered = lifetime?.totalAnswered ?? 0;
  const lifetimeCorrect = lifetime?.totalCorrect ?? 0;

  return (
    <div className={s.wrap}>
      <div className={s.topbar}>
        <span className={s.topic}>{topicTitle ?? t.brand}</span>
        <button type="button" className={s.stop} onClick={onStop}>
          ■ {t.stop}
        </button>
      </div>

      <div className={s.card} key={`${question.id}-${turn.position}`}>
        <h1 className={s.prompt}>{question.prompt[locale]}</h1>
        <ol className={s.choices}>
          {turn.choices.map((choice, index) => (
            <li key={index}>
              <button
                type="button"
                className={choiceClassName(choice, index, turn.picked)}
                onClick={() => answer(index)}
                disabled={answered}
                aria-pressed={turn.picked === index}
              >
                <span className={s.key}>{CHOICE_KEYS[index]}</span>
                <span>{choice.text[locale]}</span>
              </button>
            </li>
          ))}
        </ol>

        {answered && (
          <div className={s.feedback} role="status">
            <span className={wasCorrect ? s.verdictCorrect : s.verdictWrong}>
              {wasCorrect ? t.correctFeedback : t.wrongFeedback}
            </span>
            {question.explanation && <p className={s.explanation}>{question.explanation[locale]}</p>}
          </div>
        )}

        <div className={s.actions}>
          <span className={ui.mono}>{t.keysHint}</span>
          <button type="button" className={s.next} onClick={next} disabled={!answered}>
            {t.next} →
          </button>
        </div>
      </div>

      <div className={s.counters}>
        <div className={s.counter}>
          <span className={s.counterValue}>
            {session.correct} / {session.answered} · {percentText(session.correct, session.answered)}
          </span>
          <span className={s.counterLabel}>{t.thisSession}</span>
        </div>
        <div className={s.counter}>
          <span className={s.counterValue}>
            {lifetimeCorrect} / {lifetimeAnswered} · {percentText(lifetimeCorrect, lifetimeAnswered)}
          </span>
          <span className={s.counterLabel}>{t.allTime}</span>
        </div>
      </div>

      {saveFailed && <p className={s.saveError}>{t.saveError}</p>}
    </div>
  );
}
