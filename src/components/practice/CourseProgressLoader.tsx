import { useEffect, useState } from 'react';
import type { LearnCourse } from '../../data/learn';
import { questionsInScope } from '../../data/practice';
import type { DayProgress, PracticeQuestion } from '../../data/practice';
import { isFirebaseConfigured } from '../../lib/firebase';
import { useAuthUser } from '../learn/useAuthUser';
import type { ClassAnswers, CourseProgressData } from './CourseProgressContext';
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
};

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
  return { days: records.days.filter((day) => day.courseSlug === course.slug), answersByClass };
}

function SignedInLoader({ uid, course, onLoaded }: CourseProgressLoaderProps & { uid: string }) {
  const bank = useQuestionBank();
  const [records, setRecords] = useState<StudentRecords | null>(null);

  useEffect(() => {
    let isCurrent = true;
    Promise.all([fetchStudentQuestions(uid), fetchStudentDays(uid)])
      .then(([questionStats, days]) => {
        if (isCurrent) setRecords({ questionStats, days });
      })
      .catch((error) => console.error('Could not load the practice progress', error));
    return () => {
      isCurrent = false;
    };
  }, [uid]);

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
