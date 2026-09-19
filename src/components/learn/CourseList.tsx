import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState } from 'react';
import { LEARN_COURSES, coursePath, findCourse } from '../../data/learn';
import { learnDict } from '../../i18n/learn';
import { useT } from '../../i18n/useT';
import s from './LearnMenu.module.css';
import ui from './ui.module.css';

const TeacherLink = dynamic(() => import('./TeacherLink'), { ssr: false });

const NO_COURSE_VALUE: string = '';

export default function CourseList() {
  const t = useT(learnDict);
  const [courseSlug, setCourseSlug] = useState(NO_COURSE_VALUE);
  const course = findCourse(courseSlug);

  return (
    <div className={s.wrap}>
      <div className={s.heading}>
        <span className={ui.eyebrow}>{t.brand}</span>
        <h1 className={ui.title}>{t.coursesTitle}</h1>
      </div>
      <div className={s.coursePicker}>
        <select
          className={course ? s.courseSelect : s.courseSelectEmpty}
          aria-label={t.courseLabel}
          value={courseSlug}
          onChange={(event) => setCourseSlug(event.target.value)}
        >
          <option value={NO_COURSE_VALUE} disabled>
            {t.selectCourse}
          </option>
          {LEARN_COURSES.map((candidate) => (
            <option key={candidate.slug} value={candidate.slug}>
              {candidate.title}
            </option>
          ))}
        </select>
        {/* A link, like every navigation of the section; without a course there is nowhere to go yet. */}
        {course ? (
          <Link href={coursePath(course)} className={s.primaryAction}>
            {t.goToCourse} →
          </Link>
        ) : (
          <span className={s.primaryActionDisabled} aria-disabled="true">
            {t.goToCourse} →
          </span>
        )}
      </div>
      <div className={s.actions}>
        <TeacherLink className={s.secondaryAction} />
      </div>
    </div>
  );
}
