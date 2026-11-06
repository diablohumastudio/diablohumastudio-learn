import { LEARN_COURSES } from '../../data/learn';
import { monthRange, monthText } from '../../data/practice';
import { practiceDict } from '../../i18n/pages/practice';
import { useLocale, useT } from '../../i18n/useT';
import ui from '../learn/ui.module.css';
import s from './PeriodControls.module.css';

/** The month option shown while the range is not exactly a month. */
const CUSTOM_RANGE: string = '';

type PeriodControlsProps = {
  courseSlug: string;
  firstDay: string;
  lastDay: string;
  /** Months offered, oldest first; today's is one of them. */
  months: string[];
  today: string;
  onCourseChange: (courseSlug: string) => void;
  onRangeChange: (firstDay: string, lastDay: string) => void;
};

/** The month whose days are exactly the range shown, or the custom option. */
function monthOfRange(months: readonly string[], firstDay: string, lastDay: string, today: string): string {
  return (
    months.find((month) => {
      const range = monthRange(month, today);
      return range.firstDay === firstDay && range.lastDay === lastDay;
    }) ?? CUSTOM_RANGE
  );
}

/** Course, month and the two days of the daily homework shown by the summary and the grid. */
export default function PeriodControls({
  courseSlug,
  firstDay,
  lastDay,
  months,
  today,
  onCourseChange,
  onRangeChange,
}: PeriodControlsProps) {
  const t = useT(practiceDict);
  const locale = useLocale();
  const selectedMonth = monthOfRange(months, firstDay, lastDay, today);

  function selectMonth(month: string): void {
    if (month === CUSTOM_RANGE) return;
    const range = monthRange(month, today);
    onRangeChange(range.firstDay, range.lastDay);
  }

  return (
    <div className={s.controls}>
      <span className={ui.eyebrow}>{t.homeworkTitle}</span>
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
        <span className={ui.label}>{t.monthLabel}</span>
        <select className={s.input} value={selectedMonth} onChange={(event) => selectMonth(event.target.value)}>
          <option value={CUSTOM_RANGE} disabled>
            {t.customRange}
          </option>
          {months.map((month) => (
            <option key={month} value={month}>
              {monthText(month, locale)}
            </option>
          ))}
        </select>
      </label>
      <label className={s.control}>
        <span className={ui.label}>{t.rangeFrom}</span>
        <input
          className={s.input}
          type="date"
          value={firstDay}
          max={lastDay}
          onChange={(event) => event.target.value && onRangeChange(event.target.value, lastDay)}
        />
      </label>
      <label className={s.control}>
        <span className={ui.label}>{t.rangeTo}</span>
        <input
          className={s.input}
          type="date"
          value={lastDay}
          min={firstDay}
          onChange={(event) => event.target.value && onRangeChange(firstDay, event.target.value)}
        />
      </label>
    </div>
  );
}
