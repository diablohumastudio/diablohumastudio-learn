import { useEffect, useState } from 'react';
import { courseTopics } from '../../data/learn';
import type { LearnCourse } from '../../data/learn';
import { questionsInScope } from '../../data/practice';
import type { DayProgress, Homework, PracticeQuestion } from '../../data/practice';
import { isFirebaseConfigured } from '../../lib/firebase';
import { useMembership } from '../course/useMembership';
import type { CourseProgressData, TopicAnswers } from './CourseProgressContext';
import { fetchStudentHomeworks } from './homeworks';
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
function fetchHomeworksOrNone(courseSlug: string, uid: string): Promise<Homework[]> {
  return fetchStudentHomeworks(courseSlug, uid).catch((error): Homework[] => {
    console.warn('Could not load the homeworks', error);
    return [];
  });
}

function answersOfTopic(
  questions: readonly PracticeQuestion[],
  course: LearnCourse,
  topicSlug: string,
  statsById: ReadonlyMap<string, QuestionStats>
): TopicAnswers {
  // Retired questions still count: their answers were given on this topic.
  const topicQuestions = questionsInScope(questions, { courseSlug: course.slug, classSlug: topicSlug });
  const topicStats = topicQuestions.map((question) => statsById.get(question.id));
  return {
    answered: topicStats.reduce((sum, stats) => sum + (stats?.attempts ?? 0), 0),
    correct: topicStats.reduce((sum, stats) => sum + (stats?.correct ?? 0), 0),
    questionCount: topicQuestions.filter((question) => !question.retired).length,
  };
}

function toCourseProgress(
  course: LearnCourse,
  questions: readonly PracticeQuestion[],
  records: StudentRecords,
  canProposeQuestions: boolean
): CourseProgressData {
  const statsById = new Map(records.questionStats.map((stats) => [stats.questionId, stats]));
  const answersByTopic: Record<string, TopicAnswers> = {};
  for (const topic of courseTopics(course)) {
    answersByTopic[topic.slug] = answersOfTopic(questions, course, topic.slug, statsById);
  }
  return {
    // A homework's day carries no course, so this keeps the daily homework only.
    days: records.days.filter((day) => day.courseSlug === course.slug),
    answersByTopic,
    homeworks: records.homeworks,
    homeworkDays: records.days.filter((day) => day.homeworkId !== undefined),
    questionStats: records.questionStats,
    canProposeQuestions,
  };
}

type SignedInLoaderProps = CourseProgressLoaderProps & {
  uid: string;
  canProposeQuestions: boolean;
};

function SignedInLoader({ uid, course, canProposeQuestions, onLoaded }: SignedInLoaderProps) {
  const bank = useQuestionBank();
  const [records, setRecords] = useState<StudentRecords | null>(null);

  useEffect(() => {
    let isCurrent = true;
    Promise.all([fetchStudentQuestions(uid), fetchStudentDays(uid), fetchHomeworksOrNone(course.slug, uid)])
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
    onLoaded(toCourseProgress(course, bank.questions, records, canProposeQuestions));
  }, [bank, records, course, canProposeQuestions, onLoaded]);

  return null;
}

/** Renders nothing: it reports the signed-in student's progress in a course to the context.
    An account that is not enrolled gets none, like a guest: the course page then shows the
    access card instead of the homework (docs/courses.md). */
export default function CourseProgressLoader({ course, onLoaded }: CourseProgressLoaderProps) {
  const membership = useMembership(course.slug);
  const isMember = membership.status === 'member';

  useEffect(() => {
    if (!isMember) onLoaded(null);
  }, [isMember, onLoaded]);

  if (!isFirebaseConfigured() || !isMember || !membership.user) return null;
  return (
    <SignedInLoader
      uid={membership.user.uid}
      course={course}
      canProposeQuestions={membership.canProposeQuestions}
      onLoaded={onLoaded}
    />
  );
}
