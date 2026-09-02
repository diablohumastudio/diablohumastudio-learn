import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

export type IncineClass = {
  slug: string;
  title: string;
  component: ComponentType;
};

export type IncineCourse = {
  slug: string;
  title: string;
  classes: IncineClass[];
};

export const INCINE_COURSES: IncineCourse[] = [
  {
    slug: 'wwise-unreal',
    title: 'Wwise + Unreal',
    classes: [
      {
        slug: 'wwise-inside-out',
        title: 'Wwise Inside Out',
        component: dynamic(() => import('../presentations/wwise-unreal/wwise-inside-out')),
      },
    ],
  },
];

export function findCourse(slug: string | undefined): IncineCourse | undefined {
  return INCINE_COURSES.find((course) => course.slug === slug);
}

export function findClass(course: IncineCourse, slug: string | undefined): IncineClass | undefined {
  return course.classes.find((incineClass) => incineClass.slug === slug);
}

export function latestClass(course: IncineCourse): IncineClass {
  return course.classes[course.classes.length - 1];
}

export function querySlug(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
