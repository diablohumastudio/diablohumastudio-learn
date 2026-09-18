import dynamic from 'next/dynamic';
import Link from 'next/link';
import { LEARN_BASE_PATH, classPath, groupClassesBySection, practicePath } from '../../data/learn';
import type { LearnCourse } from '../../data/learn';
import { learnDict } from '../../i18n/learn';
import { useLocale, useT } from '../../i18n/useT';
import s from './LearnMenu.module.css';
import ui from './ui.module.css';

const TeacherLink = dynamic(() => import('./TeacherLink'), { ssr: false });

const CLASS_NUMBER_WIDTH: number = 2;

export function CourseMissing() {
  const t = useT(learnDict);
  return (
    <div className={s.missing}>
      <p>{t.courseNotFound}</p>
      <Link href={LEARN_BASE_PATH}>{t.goToMenu}</Link>
    </div>
  );
}

export default function ClassList({ course }: { course: LearnCourse }) {
  const t = useT(learnDict);
  const locale = useLocale();

  return (
    <div className={s.wrap}>
      <Link href={LEARN_BASE_PATH} className={ui.backLink}>
        ← {t.allCourses}
      </Link>
      <div className={s.heading}>
        <span className={ui.eyebrow}>{t.classesEyebrow}</span>
        <h1 className={ui.title}>{course.title}</h1>
      </div>
      {groupClassesBySection(course).map((group) => (
        <div key={group.classes[0].slug} className={s.group}>
          {group.section && <span className={s.groupLabel}>{group.section}</span>}
          <nav className={s.list}>
            {group.classes.map((learnClass) => (
              <Link key={learnClass.slug} href={classPath(course, learnClass)} className={s.item}>
                <span className={s.itemIndex}>
                  {String(course.classes.indexOf(learnClass) + 1).padStart(CLASS_NUMBER_WIDTH, '0')}
                </span>
                {learnClass.title[locale]}
                <span className={s.itemArrow}>→</span>
              </Link>
            ))}
          </nav>
        </div>
      ))}
      <div className={s.actions}>
        <Link href={practicePath({ courseSlug: course.slug })} className={s.primaryAction}>
          {t.practiceThisCourse}
        </Link>
        <TeacherLink className={s.secondaryAction} />
      </div>
    </div>
  );
}
