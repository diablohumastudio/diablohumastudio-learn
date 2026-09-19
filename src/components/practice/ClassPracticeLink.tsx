import Link from 'next/link';
import { practicePlayPath } from '../../data/learn';
import type { LearnClass, LearnCourse } from '../../data/learn';
import { practiceDict } from '../../i18n/pages/practice';
import { useT } from '../../i18n/useT';
import s from './ClassPracticeLink.module.css';
import { useCourseProgress } from './CourseProgressContext';

type ClassPracticeLinkProps = {
  course: LearnCourse;
  learnClass: LearnClass;
};

/** The practice button of a class row; signed-in students see their answers of the class inside it. */
export default function ClassPracticeLink({ course, learnClass }: ClassPracticeLinkProps) {
  const t = useT(practiceDict);
  const classAnswers = useCourseProgress()?.answersByClass[learnClass.slug];

  // Known to have no questions: nothing to practice. Guests get the link and sign in on the way.
  if (classAnswers && classAnswers.questionCount === 0) return null;

  return (
    <Link
      href={practicePlayPath({ courseSlug: course.slug, classSlug: learnClass.slug })}
      className={s.link}
      title={classAnswers ? t.classAnswersHint : undefined}
    >
      {classAnswers && (
        <span className={s.count}>
          ✓ {classAnswers.correct} / {classAnswers.answered}
        </span>
      )}
      <span className={s.label}>{t.practiceClass} ▸</span>
    </Link>
  );
}
