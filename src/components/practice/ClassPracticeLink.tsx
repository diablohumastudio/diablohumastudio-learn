import Link from 'next/link';
import { practicePlayPath } from '../../data/learn';
import type { LearnCourse, LearnTopic } from '../../data/learn';
import { practiceDict } from '../../i18n/pages/practice';
import { useT } from '../../i18n/useT';
import s from './ClassPracticeLink.module.css';
import { useCourseProgress } from './CourseProgressContext';

type ClassPracticeLinkProps = {
  course: LearnCourse;
  /** The class or the reading of the row. */
  topic: LearnTopic;
};

/** The practice button of a class or reading row; signed-in students see their answers on that
    topic inside it. */
export default function ClassPracticeLink({ course, topic }: ClassPracticeLinkProps) {
  const t = useT(practiceDict);
  const topicAnswers = useCourseProgress()?.answersByTopic[topic.slug];

  // Known to have no questions: nothing to practice. Guests get the link and sign in on the way.
  if (topicAnswers && topicAnswers.questionCount === 0) return null;

  return (
    <Link
      href={practicePlayPath({ courseSlug: course.slug, classSlug: topic.slug })}
      className={s.link}
      title={topicAnswers ? t.topicAnswersHint : undefined}
    >
      {topicAnswers && (
        <span className={s.count}>
          ✓ {topicAnswers.correct} / {topicAnswers.answered}
        </span>
      )}
      <span className={s.label}>{t.practiceClass} ▸</span>
    </Link>
  );
}
