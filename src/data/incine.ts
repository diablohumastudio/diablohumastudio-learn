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
      {
        slug: 'que-es-un-motor-de-audio',
        title: '¿Qué es un motor de audio?',
        component: dynamic(() => import('../presentations/wwise-unreal/que-es-un-motor-de-audio')),
      },
      {
        slug: 'donde-viven-los-datos',
        title: '¿Dónde viven los datos?',
        component: dynamic(() => import('../presentations/wwise-unreal/donde-viven-los-datos')),
      },
      {
        slug: 'wwise-por-adentro',
        title: 'Wwise por adentro',
        component: dynamic(() => import('../presentations/wwise-unreal/wwise-por-adentro')),
      },
      {
        slug: 'el-editor-wwise',
        title: 'El editor Wwise',
        component: dynamic(() => import('../presentations/wwise-unreal/el-editor-wwise')),
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

export function neighborClass(
  course: IncineCourse,
  classSlug: string | undefined,
  offset: number
): IncineClass | undefined {
  const index = course.classes.findIndex((incineClass) => incineClass.slug === classSlug);
  return index === -1 ? undefined : course.classes[index + offset];
}

export function latestClass(course: IncineCourse): IncineClass {
  return course.classes[course.classes.length - 1];
}

export function querySlug(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
