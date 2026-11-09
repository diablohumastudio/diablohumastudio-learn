import Link from 'next/link';
import { courseHomeworksPath } from '../../data/learn';
import type { LearnCourse } from '../../data/learn';
import { dayKey, startedHomeworks } from '../../data/practice';
import { learnDict } from '../../i18n/learn';
import { useT } from '../../i18n/useT';
import EnrolledOnly from '../course/EnrolledOnly';
import menu from '../learn/LearnMenu.module.css';
import ui from '../learn/ui.module.css';
import { CourseProgressProvider, useCourseProgress } from './CourseProgressContext';
import HomeworkEntry from './HomeworkEntry';

type HomeworkPageProps = {
  course: LearnCourse;
  homeworkId: string;
};

/** One specific homework as the student sees it: its meter, its days and the Practice button, in
    a card of its own. An upcoming homework reads as not found until its first day. */
function HomeworkDetail({ course, homeworkId }: HomeworkPageProps) {
  const t = useT(learnDict);
  const progress = useCourseProgress();
  const today = dayKey(new Date());
  const homework =
    progress === null ? undefined : startedHomeworks(progress.homeworks, today).find((candidate) => candidate.id === homeworkId);

  if (progress === null) {
    return (
      <div className={ui.centered}>
        <span className={ui.mono}>{t.loading}</span>
      </div>
    );
  }

  return (
    <div className={menu.wrap}>
      <Link href={courseHomeworksPath(course)} className={ui.backLink}>
        ← {t.backToHomeworks}
      </Link>
      {homework ? (
        <div className={ui.card}>
          <HomeworkEntry course={course} homework={homework} homeworkDays={progress.homeworkDays} today={today} />
        </div>
      ) : (
        <p className={ui.error}>{t.homeworkNotFound}</p>
      )}
    </div>
  );
}

/** `/course/<course>/homeworks/<id>`: one specific homework of the signed-in student; enrolled students only. */
export default function HomeworkPage({ course, homeworkId }: HomeworkPageProps) {
  return (
    <EnrolledOnly course={course}>
      {() => (
        <CourseProgressProvider course={course}>
          <HomeworkDetail course={course} homeworkId={homeworkId} />
        </CourseProgressProvider>
      )}
    </EnrolledOnly>
  );
}
