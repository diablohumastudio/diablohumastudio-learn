import { LEARN_COURSES } from '../../data/learn';
import { monthRange, monthText } from '../../data/practice';
import type { DayRange } from '../../data/practice';
import { practiceDict } from '../../i18n/pages/practice';
import { useLocale, useT } from '../../i18n/useT';
import ui from '../learn/ui.module.css';
import s from './PeriodControls.module.css';

/** What the teacher looks at: one month with practice, everything so far, or any two days. */
export type Period = { kind: 'month'; month: string } | { kind: 'all' } | { kind: 'custom' } & DayRange;

const ALL_OPTION: string = 'all';
const CUSTOM_OPTION: string = 'custom';
const MONTH_OPTION_PREFIX: string = 'month:';

type PeriodControlsProps = {
  courseSlug: string;
  period: Period;
  /** The days the period stands for today. */
  range: DayRange;
  /** Months offered, oldest first; today's is one of them. */
  months: string[];
  onCourseChange: (courseSlug: string) => void;
  onPeriodChange: (period: Period) => void;
};

/** The days of a period: a month cut at today, everything since the first day anybody
    practiced, or the two days the teacher typed. */
export function periodRange(period: Period, firstDayEver: string, today: string): DayRange {
  if (period.kind === 'month') return monthRange(period.month, today);
  if (period.kind === 'all') return { firstDay: firstDayEver, lastDay: today };
  return { firstDay: period.firstDay, lastDay: period.lastDay };
}

function optionOf(period: Period): string {
  if (period.kind === 'month') return `${MONTH_OPTION_PREFIX}${period.month}`;
  return period.kind === 'all' ? ALL_OPTION : CUSTOM_OPTION;
}

/** Course and period of the daily homework shown by the summary and the grid. */
export default function PeriodControls({
  courseSlug,
  period,
  range,
  months,
  onCourseChange,
  onPeriodChange,
}: PeriodControlsProps) {
  const t = useT(practiceDict);
  const locale = useLocale();

  /** Custom starts from the days on screen, so switching to it changes nothing until a day is typed. */
  function selectPeriod(option: string): void {
    if (option === ALL_OPTION) onPeriodChange({ kind: 'all' });
    else if (option === CUSTOM_OPTION) onPeriodChange({ kind: 'custom', ...range });
    else onPeriodChange({ kind: 'month', month: option.slice(MONTH_OPTION_PREFIX.length) });
  }

  return (
    <div className={s.wrap}>
      <span className={ui.eyebrow}>{t.homeworkTitle}</span>
      <div className={s.controls}>
        <label className={s.control}>
          <span className={ui.label}>{t.colCourse}</span>
          <select className={s.input} value={courseSlug} onChange={(event) => onCourseChange(event.target.value)}>
            {LEARN_COURSES.map((course) => (
              <option key={course.slug} value={course.slug}>
                {course.title}
              </option>
            ))}
          </select>
        </label>
        <label className={s.control}>
          <span className={ui.label}>{t.periodLabel}</span>
          <select className={s.input} value={optionOf(period)} onChange={(event) => selectPeriod(event.target.value)}>
            {months.map((month) => (
              <option key={month} value={`${MONTH_OPTION_PREFIX}${month}`}>
                {monthText(month, locale)}
              </option>
            ))}
            <option value={ALL_OPTION}>{t.periodAll}</option>
            <option value={CUSTOM_OPTION}>{t.periodCustom}</option>
          </select>
        </label>
        {period.kind === 'custom' && (
          <>
            <label className={s.control}>
              <span className={ui.label}>{t.rangeFrom}</span>
              <input
                className={s.input}
                type="date"
                value={period.firstDay}
                max={period.lastDay}
                onChange={(event) =>
                  event.target.value && onPeriodChange({ ...period, firstDay: event.target.value })
                }
              />
            </label>
            <label className={s.control}>
              <span className={ui.label}>{t.rangeTo}</span>
              <input
                className={s.input}
                type="date"
                value={period.lastDay}
                min={period.firstDay}
                onChange={(event) =>
                  event.target.value && onPeriodChange({ ...period, lastDay: event.target.value })
                }
              />
            </label>
          </>
        )}
      </div>
    </div>
  );
}
