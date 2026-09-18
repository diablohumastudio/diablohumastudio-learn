import dynamic from 'next/dynamic';
import Link from 'next/link';
import { LEARN_COURSES, coursePath, practicePath } from '../../data/learn';
import { learnDict } from '../../i18n/learn';
import { useT } from '../../i18n/useT';
import s from './LearnMenu.module.css';
import ui from './ui.module.css';

const TeacherLink = dynamic(() => import('./TeacherLink'), { ssr: false });

export default function CourseList() {
  const t = useT(learnDict);

  return (
    <div className={s.wrap}>
      <div className={s.heading}>
        <span className={ui.eyebrow}>{t.brand}</span>
        <h1 className={ui.title}>{t.coursesTitle}</h1>
      </div>
      <nav className={s.list}>
        {LEARN_COURSES.map((course) => (
          <Link key={course.slug} href={coursePath(course)} className={s.item}>
            {course.title}
            <span className={s.itemArrow}>→</span>
          </Link>
        ))}
      </nav>
      <div className={s.actions}>
        <Link href={practicePath({})} className={s.primaryAction}>
          {t.practiceAllCourses}
        </Link>
        <TeacherLink className={s.secondaryAction} />
      </div>
    </div>
  );
}
