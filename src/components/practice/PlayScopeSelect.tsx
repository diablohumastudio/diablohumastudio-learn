import { useRouter } from 'next/router';
import { findCourse, practicePlayPath, querySlug } from '../../data/learn';
import { practiceDict } from '../../i18n/pages/practice';
import { useLocale, useT } from '../../i18n/useT';
import h from '../learn/LearnHeader.module.css';

const WHOLE_COURSE_VALUE: string = '';

/** Header control of the play screen: switches class without leaving it, never the course. */
export default function PlayScopeSelect() {
  const t = useT(practiceDict);
  const locale = useLocale();
  const router = useRouter();

  // The scope comes from the query string, which a static page only knows once the router is ready.
  if (!router.isReady) return null;
  const course = findCourse(querySlug(router.query.course));
  if (!course) return null;
  const activeClassSlug = course.classes.find((learnClass) => learnClass.slug === querySlug(router.query.class))?.slug;

  return (
    <label className={h.selectGroup}>
      <span className={h.selectLabel}>{t.brand}</span>
      <select
        className={h.select}
        aria-label={t.scopeLabel}
        value={activeClassSlug ?? WHOLE_COURSE_VALUE}
        onChange={(event) => {
          const classSlug = event.target.value === WHOLE_COURSE_VALUE ? undefined : event.target.value;
          router.push(practicePlayPath({ courseSlug: course.slug, classSlug }));
          event.target.blur();
        }}
      >
        <option value={WHOLE_COURSE_VALUE}>
          {course.title} · {t.wholeCourse}
        </option>
        {course.classes.map((learnClass) => (
          <option key={learnClass.slug} value={learnClass.slug}>
            {learnClass.title[locale]}
          </option>
        ))}
      </select>
    </label>
  );
}
