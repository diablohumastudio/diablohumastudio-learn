import { DAILY_QUESTIONS_GOAL, RUN_CORRECT_GOAL, RUN_LENGTH, runCorrectCount } from '../../data/practice';
import type { DayProgress } from '../../data/practice';
import { practiceDict } from '../../i18n/pages/practice';
import { useT } from '../../i18n/useT';
import s from './HomeworkMeter.module.css';

type HomeworkMeterProps = {
  today: DayProgress;
  /** Results of the run being played, oldest first (the player). Without it the meter sits under
      a "Today" heading and only names its two numbers: the total and the day's best run. */
  liveRun?: readonly boolean[];
  /** Answers the day needs: the daily homework's unless a specific homework sets its own. */
  questionsGoal?: number;
  /** The meter counts one round of a homework that has several: the hint says so. */
  isRound?: boolean;
};

function pipClassName(result: boolean | undefined): string {
  if (result === undefined) return s.pip;
  return result ? `${s.pip} ${s.pipCorrect}` : `${s.pip} ${s.pipWrong}`;
}

/** The two homework numbers of one day: questions answered and the best run. */
export default function HomeworkMeter({
  today,
  liveRun,
  questionsGoal = DAILY_QUESTIONS_GOAL,
  isRound = false,
}: HomeworkMeterProps) {
  const t = useT(practiceDict);
  const answeredShare = Math.min(1, today.answered / questionsGoal);
  const countDone = today.answered >= questionsGoal;
  const runDone = today.bestRun >= RUN_CORRECT_GOAL;
  const pips: (boolean | undefined)[] = [];
  for (let index = 0; index < RUN_LENGTH; index += 1) pips.push(liveRun?.[index]);

  return (
    <div className={s.meter}>
      <div className={s.row}>
        <span className={s.label}>{liveRun ? t.homeworkToday : t.homeworkTotal}</span>
        <span className={s.track} role="img" aria-label={`${today.answered} / ${questionsGoal}`}>
          <span className={countDone ? s.fillDone : s.fill} style={{ width: `${answeredShare * 100}%` }} />
        </span>
        <span className={countDone ? s.valueDone : s.value}>
          {today.answered} / {questionsGoal}
        </span>
      </div>

      <div className={s.row}>
        <span className={s.label}>{liveRun ? t.homeworkRun : t.homeworkBestRun}</span>
        {liveRun ? (
          <span className={s.pips} role="img" aria-label={`${runCorrectCount(liveRun)} / ${RUN_LENGTH}`}>
            {pips.map((result, index) => (
              <span key={index} className={pipClassName(result)} />
            ))}
          </span>
        ) : (
          <span className={s.spacer} />
        )}
        <span className={runDone ? s.valueDone : s.value}>
          {liveRun && `${runCorrectCount(liveRun)} / ${RUN_LENGTH} · ${t.bestToday} `}
          {today.bestRun} / {RUN_LENGTH}
        </span>
      </div>

      <p className={s.hint}>
        {(isRound ? t.homeworkRoundGoalHint : t.homeworkGoalHint)
          .replace('{count}', String(questionsGoal))
          .replace('{goal}', String(RUN_CORRECT_GOAL))
          .replace('{length}', String(RUN_LENGTH))}
      </p>
    </div>
  );
}
