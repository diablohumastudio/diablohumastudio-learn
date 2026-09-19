import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  TIMEOUT_COUNTS_AS_ANSWER,
  dayKey,
  drawChoices,
  emptyDay,
  pushRunResult,
  questionTopicTitle,
  runCorrectCount,
  shuffledCycle,
} from '../../data/practice';
import type { DayProgress, PracticeQuestion, ShuffledChoice } from '../../data/practice';
import { practiceDict } from '../../i18n/pages/practice';
import { useLocale, useT } from '../../i18n/useT';
import { percentText } from './format';
import HomeworkMeter from './HomeworkMeter';
import s from './Player.module.css';
import { useQuestionSeconds } from './practiceSettings';
import { newSessionId, recordAnswer, subscribeDay } from './progress';
import ui from '../learn/ui.module.css';

const CHOICE_KEYS: string = 'ABCDE';
const TIMER_TICK_MS: number = 250;
const TIMER_URGENT_SECONDS: number = 5;

type PlayerProps = {
  uid: string;
  questions: PracticeQuestion[];
  /** Course the questions belong to: homework is counted per course. */
  courseSlug: string;
  /** Leaving is a link so the browser history matches. */
  stopHref: string;
};

type Turn = {
  /** Counts every question shown; restarts the timer and the card animation. */
  number: number;
  cycle: PracticeQuestion[];
  position: number;
  choices: ShuffledChoice[];
  /** Index into `choices`; stays null when the time ran out. */
  picked: number | null;
  timedOut: boolean;
};

type SessionCount = { answered: number; correct: number };

function firstTurn(questions: PracticeQuestion[]): Turn {
  const cycle = shuffledCycle(questions);
  return { number: 0, cycle, position: 0, choices: drawChoices(cycle[0]), picked: null, timedOut: false };
}

/** Advances one question; when the cycle is exhausted, starts a freshly shuffled one. */
function nextTurn(turn: Turn, questions: PracticeQuestion[]): Turn {
  const exhausted = turn.position + 1 >= turn.cycle.length;
  const cycle = exhausted ? shuffledCycle(questions) : turn.cycle;
  const position = exhausted ? 0 : turn.position + 1;
  return {
    number: turn.number + 1,
    cycle,
    position,
    choices: drawChoices(cycle[position]),
    picked: null,
    timedOut: false,
  };
}

function choiceClassName(choice: ShuffledChoice, index: number, turn: Turn): string {
  const { picked } = turn;
  if (picked === null && !turn.timedOut) return s.choice;
  if (choice.isCorrect) return `${s.choice} ${s.choiceCorrect}`;
  if (index === picked) return `${s.choice} ${s.choiceWrong}`;
  return `${s.choice} ${s.choiceDim}`;
}

export default function Player({ uid, questions, courseSlug, stopHref }: PlayerProps) {
  const t = useT(practiceDict);
  const locale = useLocale();
  const questionSeconds = useQuestionSeconds();
  const [sessionId] = useState(() => newSessionId(uid));
  const [turn, setTurn] = useState<Turn>(() => firstTurn(questions));
  const [session, setSession] = useState<SessionCount>({ answered: 0, correct: 0 });
  const [run, setRun] = useState<boolean[]>([]);
  const [day, setDay] = useState(() => dayKey(new Date()));
  const [today, setToday] = useState<DayProgress>(() => emptyDay(courseSlug, day));
  const [secondsLeft, setSecondsLeft] = useState(questionSeconds);
  const [saveFailed, setSaveFailed] = useState(false);
  const keyHandlerRef = useRef<(event: KeyboardEvent) => void>(() => {});
  const timeUpHandlerRef = useRef<() => void>(() => {});

  const question = turn.cycle[turn.position];
  const answered = turn.picked !== null || turn.timedOut;
  const wasCorrect = turn.picked !== null && turn.choices[turn.picked].isCorrect;

  function saveResult(isCorrect: boolean) {
    const nextRun = pushRunResult(run, isCorrect);
    const runCorrect = runCorrectCount(nextRun);
    // Read at answer time: a session that crosses midnight starts filling the new day.
    const answerDay = dayKey(new Date());
    const knownBestRun = today.day === answerDay ? today.bestRun : 0;
    setRun(nextRun);
    setDay(answerDay);
    setSession({ answered: session.answered + 1, correct: session.correct + (isCorrect ? 1 : 0) });
    recordAnswer({
      uid,
      sessionId,
      questionId: question.id,
      courseSlug,
      day: answerDay,
      isCorrect,
      isFirstAnswerOfSession: session.answered === 0,
      newBestRun: runCorrect > knownBestRun ? runCorrect : null,
    }).catch((error) => {
      console.error('Could not save the answer', error);
      setSaveFailed(true);
    });
  }

  function answer(index: number) {
    if (answered) return;
    setTurn({ ...turn, picked: index });
    saveResult(turn.choices[index].isCorrect);
  }

  function next() {
    if (!answered) return;
    setTurn(nextTurn(turn, questions));
  }

  // Never advances by itself: an abandoned tab costs one wrong answer, not one per timer.
  timeUpHandlerRef.current = () => {
    if (answered) return;
    setTurn({ ...turn, timedOut: true });
    if (TIMEOUT_COUNTS_AS_ANSWER) saveResult(false);
  };

  useEffect(() => subscribeDay(uid, courseSlug, day, setToday), [uid, courseSlug, day]);

  // One countdown per question shown; it stops as soon as the question is settled.
  useEffect(() => {
    if (answered) return undefined;
    const deadline = Date.now() + questionSeconds * 1000;
    setSecondsLeft(questionSeconds);
    const interval = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining > 0) return;
      // Cleared here, not only on cleanup: a second tick before the re-render would save twice.
      window.clearInterval(interval);
      timeUpHandlerRef.current();
    }, TIMER_TICK_MS);
    return () => window.clearInterval(interval);
  }, [turn.number, answered, questionSeconds]);

  keyHandlerRef.current = (event: KeyboardEvent) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
    // The config dialog opens over the player: its keys are not answers.
    if (event.target instanceof Element && event.target.closest('dialog')) return;
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
  const timerClassName = secondsLeft <= TIMER_URGENT_SECONDS ? s.timerUrgent : s.timer;

  return (
    <div className={s.wrap}>
      <div className={s.topbar}>
        <span className={s.topic}>{topicTitle ?? t.brand}</span>
        <span className={s.topbarSpacer} />
        <span className={timerClassName} role="timer" aria-label={t.timeLeft}>
          {secondsLeft} s
        </span>
        <Link href={stopHref} className={s.stop}>
          ■ {t.stop}
        </Link>
      </div>

      <div className={s.card} key={turn.number}>
        <span className={s.timerTrack}>
          <span
            className={answered ? s.timerFillStopped : s.timerFill}
            style={{ animationDuration: `${questionSeconds}s` }}
          />
        </span>
        <h1 className={s.prompt}>{question.prompt[locale]}</h1>
        <ol className={s.choices}>
          {turn.choices.map((choice, index) => (
            <li key={index}>
              <button
                type="button"
                className={choiceClassName(choice, index, turn)}
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
              {wasCorrect ? t.correctFeedback : turn.timedOut ? t.timeUpFeedback : t.wrongFeedback}
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

      <div className={s.homework}>
        <HomeworkMeter today={today} liveRun={run} />
        <span className={s.sessionCount}>
          {t.thisSession}: {session.correct} / {session.answered} · {percentText(session.correct, session.answered)}
        </span>
      </div>

      {saveFailed && <p className={s.saveError}>{t.saveError}</p>}
    </div>
  );
}
