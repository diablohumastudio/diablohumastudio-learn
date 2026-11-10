import dynamic from 'next/dynamic';
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { LearnCourse } from '../../data/learn';
import type { DayProgress, Homework } from '../../data/practice';
import type { QuestionStats } from './progress';

export type TopicAnswers = {
  /** Every answer the student gave to the questions of the class or reading, and how many were right. */
  answered: number;
  correct: number;
  /** Active questions of the topic: without any there is nothing to practice. */
  questionCount: number;
};

export type CourseProgressData = {
  /** Days of this course's daily homework only. */
  days: DayProgress[];
  /** Keyed by the slug of each class and each reading of the course. */
  answersByTopic: Record<string, TopicAnswers>;
  /** The specific homeworks of this course, whatever their dates. */
  homeworks: Homework[];
  /** The student's days of every specific homework: each card picks its own by `homeworkId`. */
  homeworkDays: DayProgress[];
  /** The student's attempts per question, every course included; the history page filters them. */
  questionStats: QuestionStats[];
  /** The teacher lets this student propose questions for the course's bank (docs/courses.md). */
  canProposeQuestions: boolean;
};

// Firebase is browser-only and heavy: the loader renders nothing and fills the context, so
// the course page itself still renders on the server and guests never download Firebase UI.
const CourseProgressLoader = dynamic(() => import('./CourseProgressLoader'), { ssr: false });

const CourseProgressContext = createContext<CourseProgressData | null>(null);

/** Null for guests, while loading, and while an exam pauses practice. */
export function useCourseProgress(): CourseProgressData | null {
  return useContext(CourseProgressContext);
}

export function CourseProgressProvider({ course, children }: { course: LearnCourse; children: ReactNode }) {
  const [progress, setProgress] = useState<CourseProgressData | null>(null);

  return (
    <CourseProgressContext.Provider value={progress}>
      <CourseProgressLoader key={course.slug} course={course} onLoaded={setProgress} />
      {children}
    </CourseProgressContext.Provider>
  );
}
