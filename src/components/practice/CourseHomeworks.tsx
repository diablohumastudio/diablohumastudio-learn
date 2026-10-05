import Link from 'next/link';
import { homeworkPlayPath } from '../../data/learn';
import type { LearnCourse } from '../../data/learn';
import {
  RUN_CORRECT_GOAL,
  RUN_LENGTH,
  dayKey,
  dayKeysBetween,
  dayText,
  isHomeworkDayDone,
  isHomeworkOpen,
  isHomeworkShown,
  isRoundDone,
  roundDay,
  weekdayInitial,
} from '../../data/practice';
import type { DayProgress, Homework, HomeworkRound } from '../../data/practice';
import { practiceDict } from '../../i18n/pages/practice';
import { useLocale, useT } from '../../i18n/useT';
import s from './CourseHomeworks.module.css';
import { useCourseProgress } from './CourseProgressContext';
import HomeworkMeter from './HomeworkMeter';

type HomeworkCardProps = {
  course: LearnCourse;
  homework: Homework;
  /** The student's days of every specific homework; the card picks its own. */
  homeworkDays: readonly DayProgress[];
  /** The student's local day (`dayKey`). */
  today: string;
};

/** One day of a homework in the student's account. */
type HomeworkDay = {
  day: string;
  /** The progress in each round, in the order of the rounds. */
  rounds: DayProgress[];
  isDone: boolean;
};

function homeworkDayOf(homeworkDays: readonly DayProgress[], homework: Homework, day: string): HomeworkDay {
  return {
    day,
    rounds: homework.rounds.map((round) => roundDay(homeworkDays, homework, round, day)),
    isDone: isHomeworkDayDone(homeworkDays, homework, day),
  };
}

function answeredOn(homeworkDay: HomeworkDay): number {
  return homeworkDay.rounds.reduce((sum, progress) => sum + progress.answered, 0);
}

function dayMarkClassName(homeworkDay: HomeworkDay, isFuture: boolean): string {
  if (isFuture) return s.dayFuture;
  if (homeworkDay.isDone) return s.dayDone;
  return answeredOn(homeworkDay) > 0 ? s.dayStarted : s.dayEmpty;
}

type RoundRowProps = {
  /** 1 for the first round. */
  number: number;
  round: HomeworkRound;
  progress: DayProgress;
};

/** Today in one round: the two numbers of the meter on a single line. */
function RoundRow({ number, round, progress }: RoundRowProps) {
  const t = useT(practiceDict);
  const countDone = progress.answered >= round.goal;
  const runDone = progress.bestRun >= RUN_CORRECT_GOAL;
  const answeredShare = Math.min(1, progress.answered / round.goal);

  return (
    <li className={s.round}>
      <span className={s.roundLabel}>
        {t.roundLabel} {number}
      </span>
      <span className={s.roundTrack} role="img" aria-label={`${progress.answered} / ${round.goal}`}>
        <span className={countDone ? s.roundFillDone : s.roundFill} style={{ width: `${answeredShare * 100}%` }} />
      </span>
      <span className={s.roundValue}>
        <span className={countDone ? s.roundPartDone : undefined}>
          {progress.answered} / {round.goal}
        </span>
        {' · '}
        <span className={runDone ? s.roundPartDone : undefined}>
          {progress.bestRun} / {RUN_LENGTH}
        </span>
      </span>
    </li>
  );
}

function HomeworkCard({ course, homework, homeworkDays, today }: HomeworkCardProps) {
  const t = useT(practiceDict);
  const locale = useLocale();
  const days = dayKeysBetween(homework.firstDay, homework.lastDay).map((day) =>
    homeworkDayOf(homeworkDays, homework, day)
  );
  const todayRounds = homeworkDayOf(homeworkDays, homework, today).rounds;
  const isOpen = isHomeworkOpen(homework, today);
  // A homework with a single round reads as it did before rounds existed.
  const hasRounds = homework.rounds.length > 1;
  const pendingIndex = homework.rounds.findIndex((round, index) => !isRoundDone(todayRounds[index], round));
  // With every round done, the button goes back to the first one.
  const roundToPlay = homework.rounds[Math.max(pendingIndex, 0)];

  return (
    <section className={s.card}>
      <div className={s.heading}>
        <span className={s.eyebrow}>
          {t.specificHomework} · {dayText(homework.firstDay, locale)} – {dayText(homework.lastDay, locale)}
        </span>
        <span className={s.name}>{homework.title}</span>
      </div>

      {isOpen && (
        <div className={s.section}>
          <span className={s.sectionLabel}>{t.homeworkToday}</span>
          {hasRounds ? (
            <>
              <ol className={s.rounds}>
                {homework.rounds.map((round, index) => (
                  <RoundRow key={round.id} number={index + 1} round={round} progress={todayRounds[index]} />
                ))}
              </ol>
              <p className={s.roundsHint}>
                {t.homeworkRoundsHint
                  .replace('{goal}', String(RUN_CORRECT_GOAL))
                  .replace('{length}', String(RUN_LENGTH))}
              </p>
            </>
          ) : (
            <HomeworkMeter today={todayRounds[0]} questionsGoal={homework.rounds[0].goal} />
          )}
        </div>
      )}

      <div className={s.daysSection}>
        <div className={s.week}>
          <ol className={s.days}>
            {days.map((homeworkDay) => (
              <li
                key={homeworkDay.day}
                className={s.day}
                title={`${homeworkDay.day} · ${homeworkDay.rounds
                  .map((progress) => `${progress.answered} · ${progress.bestRun}`)
                  .join(' | ')}`}
              >
                <span className={s.dayLabel}>{weekdayInitial(homeworkDay.day, locale)}</span>
                <span className={dayMarkClassName(homeworkDay, homeworkDay.day > today)}>
                  {homeworkDay.isDone ? '✓' : ''}
                </span>
              </li>
            ))}
          </ol>
          <dl className={s.weekNumbers}>
            <div className={s.weekNumber}>
              <dt className={s.weekNumberLabel}>{t.weekDaysDone}</dt>
              <dd className={s.weekNumberValue}>
                {days.filter((homeworkDay) => homeworkDay.isDone).length} / {days.length}
              </dd>
            </div>
            <div className={s.weekNumber}>
              <dt className={s.weekNumberLabel}>{t.weekAnswered}</dt>
              <dd className={s.weekNumberValue}>{days.reduce((sum, homeworkDay) => sum + answeredOn(homeworkDay), 0)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className={s.actions}>
        {isOpen ? (
          <Link href={homeworkPlayPath(course.slug, homework.id, roundToPlay.id)} className={s.practice}>
            {hasRounds && pendingIndex >= 0
              ? t.practiceRound.replace('{number}', String(pendingIndex + 1))
              : t.practiceThisHomework}
          </Link>
        ) : (
          <span className={s.finished}>{t.homeworkFinished}</span>
        )}
      </div>
    </section>
  );
}

/** One card per specific homework of the course that is open or just finished; nothing for guests. */
export default function CourseHomeworks({ course }: { course: LearnCourse }) {
  const progress = useCourseProgress();
  const today = dayKey(new Date());

  if (!progress) return null;
  return (
    <>
      {progress.homeworks
        .filter((homework) => isHomeworkShown(homework, today))
        .map((homework) => (
          <HomeworkCard
            key={homework.id}
            course={course}
            homework={homework}
            homeworkDays={progress.homeworkDays}
            today={today}
          />
        ))}
    </>
  );
}
