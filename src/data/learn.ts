import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import type { Dictionary } from '../i18n/useT';

/** URL prefix of the section; every route the section builds goes through `classPath`. */
export const LEARN_BASE_PATH: string = '/learn';

export type LearnClass = {
  slug: string;
  title: Dictionary<string>;
  component: ComponentType;
  /** Optional grouping shown in the class dropdown and the slide rail (e.g. 'Intro'). */
  section?: string;
};

export type LearnClassGroup = {
  section?: string;
  classes: LearnClass[];
};

export type LearnCourse = {
  slug: string;
  title: string;
  classes: LearnClass[];
};

export const LEARN_COURSES: LearnCourse[] = [
  {
    slug: 'wwise-unreal',
    title: 'Wwise + Unreal',
    classes: [
      {
        slug: 'datos-programas-y-servidores',
        title: { es: 'Datos, programas y servidores', en: 'Data, programs and servers' },
        section: 'Intro',
        component: dynamic(() => import('../presentations/wwise-unreal/datos-programas-y-servidores')),
      },
      {
        slug: 'que-es-un-motor-de-audio',
        title: { es: '¿Qué es un motor de audio?', en: 'What is an audio engine?' },
        section: 'Intro',
        component: dynamic(() => import('../presentations/wwise-unreal/que-es-un-motor-de-audio')),
      },
      {
        slug: 'wwise-por-adentro',
        title: { es: 'Wwise por adentro', en: 'Wwise from the inside' },
        section: 'Intro',
        component: dynamic(() => import('../presentations/wwise-unreal/wwise-por-adentro')),
      },
      {
        slug: 'el-editor-wwise',
        title: { es: 'El editor Wwise', en: 'The Wwise editor' },
        section: 'Intro',
        component: dynamic(() => import('../presentations/wwise-unreal/el-editor-wwise')),
      },
    ],
  },
];

export function classPath(course: LearnCourse, learnClass: LearnClass): string {
  return `${LEARN_BASE_PATH}/${course.slug}/${learnClass.slug}`;
}

export function findCourse(slug: string | undefined): LearnCourse | undefined {
  return LEARN_COURSES.find((course) => course.slug === slug);
}

export function findClass(course: LearnCourse, slug: string | undefined): LearnClass | undefined {
  return course.classes.find((learnClass) => learnClass.slug === slug);
}

/** Consecutive classes sharing a section form one group; unsectioned classes stand alone. */
export function groupClassesBySection(course: LearnCourse): LearnClassGroup[] {
  const groups: LearnClassGroup[] = [];
  for (const learnClass of course.classes) {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.section !== undefined && lastGroup.section === learnClass.section) {
      lastGroup.classes.push(learnClass);
    } else {
      groups.push({ section: learnClass.section, classes: [learnClass] });
    }
  }
  return groups;
}

export function neighborClass(
  course: LearnCourse,
  classSlug: string | undefined,
  offset: number
): LearnClass | undefined {
  const index = course.classes.findIndex((learnClass) => learnClass.slug === classSlug);
  return index === -1 ? undefined : course.classes[index + offset];
}

export function latestClass(course: LearnCourse): LearnClass {
  return course.classes[course.classes.length - 1];
}

export function querySlug(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
