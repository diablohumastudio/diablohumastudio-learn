import { useEffect, useState } from 'react';
import type { LearnCourse } from '../../data/learn';
import { questionsInScope } from '../../data/practice';
import type { DayProgress, Homework, PracticeQuestion } from '../../data/practice';
import { isFirebaseConfigured } from '../../lib/firebase';
import { useAuthUser } from '../learn/useAuthUser';
import type { ClassAnswers, CourseProgressData } from './CourseProgressContext';
import { fetchCourseHomeworks } from './homeworks';
import { fetchStudentDays, fetchStudentQuestions } from './progress';
import type { QuestionStats } from './progress';
import { useQuestionBank } from './questions';

type CourseProgressLoaderProps = {
  course: LearnCourse;
  onLoaded: (progress: CourseProgressData | null) => void;
};

type StudentRecords = {
  questionStats: QuestionStats[];
  days: DayProgress[];
  homeworks: Homework[];
};

/* The rules refuse `homeworks` until firebase/firestore.rules is republished with that block.
   The daily homework must load anyway, so a failure here only means "no homeworks". */
function fetchHomeworksOrNone(courseSlug: string): Promise<Homework[]> {
  return fetchCourseHomeworks(courseSlug).catch((error): Homework[] => {
    console.warn('Could not load the homeworks', error);
    return [];
  });
}

function answersOfClass(
  questions: readonly PracticeQuestion[],
  course: LearnCourse,
  classSlug: string,
  statsById: ReadonlyMap<string, QuestionStats>
): ClassAnswers {
  // Retired questions still count: their answers were given in this class.
  const classQuestions = questionsInScope(questions, { courseSlug: course.slug, classSlug });
  const classStats = classQuestions.map((question) => statsById.get(question.id));
  return {
    answered: classStats.reduce((sum, stats) => sum + (stats?.attempts ?? 0), 0),
    correct: classStats.reduce((sum, stats) => sum + (stats?.correct ?? 0), 0),
    questionCount: classQuestions.filter((question) => !question.retired).length,
  };
}

function toCourseProgress(
  course: LearnCourse,
  questions: readonly PracticeQuestion[],
  records: StudentRecords
): CourseProgressData {
  const statsById = new Map(records.questionStats.map((stats) => [stats.questionId, stats]));
  const answersByClass: Record<string, ClassAnswers> = {};
  for (const learnClass of course.classes) {
    answersByClass[learnClass.slug] = answersOfClass(questions, course, learnClass.slug, statsById);
  }
  return {
    // A homework's day carries no course, so this keeps the daily homework only.
    days: records.days.filter((day) => day.courseSlug === course.slug),
    answersByClass,
    homeworks: records.homeworks,
    homeworkDays: records.days.filter((day) => day.homeworkId !== undefined),
  };
}

function SignedInLoader({ uid, course, onLoaded }: CourseProgressLoaderProps & { uid: string }) {
  const bank = useQuestionBank();
  const [records, setRecords] = useState<StudentRecords | null>(null);

  useEffect(() => {
    let isCurrent = true;
    Promise.all([fetchStudentQuestions(uid), fetchStudentDays(uid), fetchHomeworksOrNone(course.slug)])
      .then(([questionStats, days, homeworks]) => {
        if (isCurrent) setRecords({ questionStats, days, homeworks });
      })
      .catch((error) => console.error('Could not load the practice progress', error));
    return () => {
      isCurrent = false;
    };
  }, [uid, course.slug]);

  useEffect(() => {
    if (bank.status !== 'ready' || !records) return;
    onLoaded(toCourseProgress(course, bank.questions, records));
  }, [bank, records, course, onLoaded]);

  return null;
}

/** Renders nothing: it reports the signed-in student's progress in a course to the context. */
export default function CourseProgressLoader({ course, onLoaded }: CourseProgressLoaderProps) {
  const auth = useAuthUser();

  useEffect(() => {
    if (auth.status === 'signedOut') onLoaded(null);
  }, [auth.status, onLoaded]);

  if (!isFirebaseConfigured() || auth.status !== 'signedIn') return null;
  return <SignedInLoader uid={auth.user.uid} course={course} onLoaded={onLoaded} />;
}
