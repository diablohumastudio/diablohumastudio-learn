import Link from 'next/link';
import { homeworkPlayPath } from '../../data/learn';
import type { LearnCourse } from '../../data/learn';
import {
  dayKey,
  dayKeysBetween,
  dayText,
  emptyHomeworkDay,
  isHomeworkDayDone,
  isHomeworkOpen,
  isHomeworkShown,
  weekdayInitial,
} from '../../data/practice';
import type { DayProgress, Homework } from '../../data/practice';
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

function dayOf(homeworkDays: readonly DayProgress[], homework: Homework, day: string): DayProgress {
  return (
    homeworkDays.find((candidate) => candidate.homeworkId === homework.id && candidate.day === day) ??
    emptyHomeworkDay(homework.id, day)
  );
}

function dayMarkClassName(progress: DayProgress, homework: Homework, isFuture: boolean): string {
  if (isFuture) return s.dayFuture;
  if (isHomeworkDayDone(progress, homework)) return s.dayDone;
  return progress.answered > 0 ? s.dayStarted : s.dayEmpty;
}

function HomeworkCard({ course, homework, homeworkDays, today }: HomeworkCardProps) {
  const t = useT(practiceDict);
  const locale = useLocale();
  const days = dayKeysBetween(homework.firstDay, homework.lastDay).map((day) => dayOf(homeworkDays, homework, day));
  const isOpen = isHomeworkOpen(homework, today);

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
          <HomeworkMeter today={dayOf(homeworkDays, homework, today)} questionsGoal={homework.dailyGoal} />
        </div>
      )}

      <div className={s.daysSection}>
        <div className={s.week}>
          <ol className={s.days}>
            {days.map((dayProgress) => (
              <li
                key={dayProgress.day}
                className={s.day}
                title={`${dayProgress.day} · ${dayProgress.answered} · ${dayProgress.bestRun}`}
              >
                <span className={s.dayLabel}>{weekdayInitial(dayProgress.day, locale)}</span>
                <span className={dayMarkClassName(dayProgress, homework, dayProgress.day > today)}>
                  {isHomeworkDayDone(dayProgress, homework) ? '✓' : ''}
                </span>
              </li>
            ))}
          </ol>
          <dl className={s.weekNumbers}>
            <div className={s.weekNumber}>
              <dt className={s.weekNumberLabel}>{t.weekDaysDone}</dt>
              <dd className={s.weekNumberValue}>
                {days.filter((dayProgress) => isHomeworkDayDone(dayProgress, homework)).length} / {days.length}
              </dd>
            </div>
            <div className={s.weekNumber}>
              <dt className={s.weekNumberLabel}>{t.weekAnswered}</dt>
              <dd className={s.weekNumberValue}>{days.reduce((sum, dayProgress) => sum + dayProgress.answered, 0)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className={s.actions}>
        {isOpen ? (
          <Link href={homeworkPlayPath(course.slug, homework.id)} className={s.practice}>
            {t.practiceThisHomework}
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
