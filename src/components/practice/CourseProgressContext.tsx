import dynamic from 'next/dynamic';
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { LearnCourse } from '../../data/learn';
import type { DayProgress } from '../../data/practice';

export type ClassAnswers = {
  /** Every answer the student gave to the questions of the class, and how many were right. */
  answered: number;
  correct: number;
  /** Active questions of the class: without any there is nothing to practice. */
  questionCount: number;
};

export type CourseProgressData = {
  /** Days of this course only. */
  days: DayProgress[];
  answersByClass: Record<string, ClassAnswers>;
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
