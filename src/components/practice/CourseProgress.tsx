import Link from 'next/link';
import { courseExamsPath, practicePlayPath } from '../../data/learn';
import type { LearnCourse } from '../../data/learn';
import { dayKey, emptyDay, isDayDone, weekDayKeys, weekdayInitial } from '../../data/practice';
import type { DayProgress } from '../../data/practice';
import { learnDict } from '../../i18n/learn';
import { practiceDict } from '../../i18n/pages/practice';
import { useLocale, useT } from '../../i18n/useT';
import s from './CourseProgress.module.css';
import { useCourseProgress } from './CourseProgressContext';
import type { CourseProgressData } from './CourseProgressContext';
import HomeworkMeter from './HomeworkMeter';

function dayOf(progress: CourseProgressData, courseSlug: string, day: string): DayProgress {
  return progress.days.find((candidate) => candidate.day === day) ?? emptyDay(courseSlug, day);
}

function dayMarkClassName(progress: DayProgress, isFuture: boolean): string {
  if (isFuture) return s.dayFuture;
  if (isDayDone(progress)) return s.dayDone;
  return progress.answered > 0 ? s.dayStarted : s.dayEmpty;
}

type WeekSectionProps = {
  progress: CourseProgressData;
  course: LearnCourse;
  today: string;
};

function WeekSection({ progress, course, today }: WeekSectionProps) {
  const t = useT(practiceDict);
  const locale = useLocale();
  const weekDays = weekDayKeys(new Date()).map((day) => dayOf(progress, course.slug, day));

  return (
    <div className={s.weekSection}>
      <span className={s.sectionLabel}>{t.homeworkThisWeek}</span>
      <div className={s.week}>
        <ol className={s.days}>
          {weekDays.map((dayProgress) => (
            <li
              key={dayProgress.day}
              className={s.day}
              title={`${dayProgress.day} · ${dayProgress.answered} · ${dayProgress.bestRun}`}
            >
              <span className={s.dayLabel}>{weekdayInitial(dayProgress.day, locale)}</span>
              <span className={dayMarkClassName(dayProgress, dayProgress.day > today)}>
                {isDayDone(dayProgress) ? '✓' : ''}
              </span>
            </li>
          ))}
        </ol>
        <dl className={s.weekNumbers}>
          <div className={s.weekNumber}>
            <dt className={s.weekNumberLabel}>{t.weekDaysDone}</dt>
            <dd className={s.weekNumberValue}>
              {weekDays.filter(isDayDone).length} / {weekDays.length}
            </dd>
          </div>
          <div className={s.weekNumber}>
            <dt className={s.weekNumberLabel}>{t.weekAnswered}</dt>
            <dd className={s.weekNumberValue}>{weekDays.reduce((sum, dayProgress) => sum + dayProgress.answered, 0)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

/** Homework of the signed-in student in one course; guests only get the buttons. */
export default function CourseProgress({ course }: { course: LearnCourse }) {
  const t = useT(practiceDict);
  const learnT = useT(learnDict);
  const progress = useCourseProgress();
  const today = dayKey(new Date());

  return (
    <section className={s.card}>
      <span className={s.title}>{t.homeworkTitle}</span>

      {progress && (
        <>
          <div className={s.section}>
            <span className={s.sectionLabel}>{t.homeworkToday}</span>
            <HomeworkMeter today={dayOf(progress, course.slug, today)} />
          </div>

          <WeekSection progress={progress} course={course} today={today} />
        </>
      )}

      <div className={s.actions}>
        <Link href={practicePlayPath({ courseSlug: course.slug })} className={s.practice}>
          {learnT.practiceThisCourse}
        </Link>
        <Link href={courseExamsPath(course)} className={s.exams}>
          {learnT.exams}
        </Link>
      </div>
    </section>
  );
}
