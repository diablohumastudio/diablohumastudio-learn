import { useEffect, useState } from 'react';
import type { DayProgress } from '../../data/practice';
import { fetchStudentDays } from './progress';
import type { StudentStats } from './progress';

export type DaysByStudent = Record<string, DayProgress[]>;

/** Every day of every student, loaded once per list of students; null until they arrive. */
export function useStudentDays(students: StudentStats[] | null): DaysByStudent | null {
  const [daysByStudent, setDaysByStudent] = useState<DaysByStudent | null>(null);

  useEffect(() => {
    if (!students) return undefined;
    let isCurrent = true;
    Promise.all(students.map((student) => fetchStudentDays(student.uid)))
      .then((loaded) => {
        if (!isCurrent) return;
        const byStudent: DaysByStudent = {};
        students.forEach((student, index) => {
          byStudent[student.uid] = loaded[index];
        });
        setDaysByStudent(byStudent);
      })
      .catch((error) => console.error('Could not load the homework', error));
    return () => {
      isCurrent = false;
    };
  }, [students]);

  return daysByStudent;
}

/** The first day anybody practiced, or undefined before anybody did. */
export function earliestDayKey(daysByStudent: DaysByStudent | null): string | undefined {
  let earliest: string | undefined;
  for (const days of Object.values(daysByStudent ?? {})) {
    for (const progress of days) {
      if (progress.day && (earliest === undefined || progress.day < earliest)) earliest = progress.day;
    }
  }
  return earliest;
}
