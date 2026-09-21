import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import type { Dictionary } from '../i18n/useT';

/** URL prefix of the section; every route the section builds goes through `classPath`. */
export const LEARN_BASE_PATH: string = '/learn';

/** The `labels` of a deck dictionary: one key per slide (a stepped slide has one per step). */
export type SlideLabels = Record<string, string | readonly string[]>;

export type ClassSlide = {
  /** Key of the deck dictionary's `labels`: stable while the slide keeps its label key. */
  id: string;
  title: Dictionary<string>;
};

export type LearnClass = {
  slug: string;
  title: Dictionary<string>;
  component: ComponentType;
  /** Loads the deck dictionary's labels, which name every slide: questions and exams
      point at slides with those keys. Lazy, so only the teacher tools download the dictionaries. */
  slideLabels: () => Promise<Dictionary<SlideLabels>>;
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

function labelsOf(deckDict: Dictionary<{ labels: SlideLabels }>): Dictionary<SlideLabels> {
  return { en: deckDict.en.labels, es: deckDict.es.labels };
}

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
        slideLabels: () =>
          import('../presentations/wwise-unreal/datos-programas-y-servidores.dict').then((deck) => labelsOf(deck.datosDict)),
      },
      {
        slug: 'que-es-un-motor-de-audio',
        title: { es: '¿Qué es un motor de audio?', en: 'What is an audio engine?' },
        section: 'Intro',
        component: dynamic(() => import('../presentations/wwise-unreal/que-es-un-motor-de-audio')),
        slideLabels: () =>
          import('../presentations/wwise-unreal/que-es-un-motor-de-audio.dict').then((deck) => labelsOf(deck.motorDict)),
      },
      {
        slug: 'wwise-por-adentro',
        title: { es: 'Wwise por adentro', en: 'Wwise from the inside' },
        section: 'Intro',
        component: dynamic(() => import('../presentations/wwise-unreal/wwise-por-adentro')),
        slideLabels: () =>
          import('../presentations/wwise-unreal/wwise-por-adentro.dict').then((deck) => labelsOf(deck.wwisePorAdentroDict)),
      },
      {
        slug: 'el-editor-wwise',
        title: { es: 'El editor Wwise', en: 'The Wwise editor' },
        section: 'Intro',
        component: dynamic(() => import('../presentations/wwise-unreal/el-editor-wwise')),
        slideLabels: () =>
          import('../presentations/wwise-unreal/el-editor-wwise.dict').then((deck) => labelsOf(deck.editorDict)),
      },
      {
        slug: 'wwise-objects',
        title: { es: 'Wwise Objects', en: 'Wwise Objects' },
        section: 'Intro',
        component: dynamic(() => import('../presentations/wwise-unreal/wwise-objects')),
        slideLabels: () =>
          import('../presentations/wwise-unreal/wwise-objects.dict').then((deck) => labelsOf(deck.wwiseObjectsDict)),
      },
    ],
  },
];

export const PRACTICE_PLAY_PATH: string = `${LEARN_BASE_PATH}/practice/play`;
export const TEACHER_PATH: string = `${LEARN_BASE_PATH}/teacher`;
export const STUDENTS_PRACTICE_INFO_PATH: string = `${TEACHER_PATH}/students-practice-info`;
export const QUESTIONS_EDITOR_PATH: string = `${TEACHER_PATH}/questions`;
const EXAM_PATH: string = `${LEARN_BASE_PATH}/exam`;
export const TEACHER_EXAM_PATH: string = `${TEACHER_PATH}/exam`;
export const SIGN_IN_PATH: string = `${LEARN_BASE_PATH}/sign-in`;

/** One course or one class of it. Practice always has a course; only an exam may cover everything. */
export type PracticeScope = {
  courseSlug?: string;
  classSlug?: string;
};

export function coursePath(course: LearnCourse): string {
  return `${LEARN_BASE_PATH}/${course.slug}`;
}

/** Exams belong to a course, like practice: the list lives under it, never under /learn. */
export function courseExamsPath(course: LearnCourse): string {
  return `${LEARN_BASE_PATH}/${course.slug}/exams`;
}

export function classPath(course: LearnCourse, learnClass: LearnClass): string {
  return `${LEARN_BASE_PATH}/${course.slug}/${learnClass.slug}`;
}

export function findCourse(slug: string | undefined): LearnCourse | undefined {
  return LEARN_COURSES.find((course) => course.slug === slug);
}

export function findClass(course: LearnCourse, slug: string | undefined): LearnClass | undefined {
  return course.classes.find((learnClass) => learnClass.slug === slug);
}

function labelText(label: string | readonly string[]): string {
  return typeof label === 'string' ? label : label[0];
}

/** The slides of a class in deck order, named by their label in each language. */
export async function classSlides(learnClass: LearnClass): Promise<ClassSlide[]> {
  const labels = await learnClass.slideLabels();
  return Object.keys(labels.es).map((id) => ({
    id,
    title: { en: labelText(labels.en[id]), es: labelText(labels.es[id]) },
  }));
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

/** Drops anything the registry does not know, so a stale link falls back to a wider scope. */
export function practiceScope(courseSlug: string | undefined, classSlug: string | undefined): PracticeScope {
  const course = findCourse(courseSlug);
  if (!course) return {};
  const learnClass = findClass(course, classSlug);
  return learnClass ? { courseSlug: course.slug, classSlug: learnClass.slug } : { courseSlug: course.slug };
}

function scopeQuery(scope: PracticeScope): string {
  const params = new URLSearchParams();
  if (scope.courseSlug) params.set('course', scope.courseSlug);
  if (scope.courseSlug && scope.classSlug) params.set('class', scope.classSlug);
  const query = params.toString();
  return query ? `?${query}` : '';
}

export function practicePlayPath(scope: PracticeScope): string {
  return `${PRACTICE_PLAY_PATH}${scopeQuery(scope)}`;
}

/** The page a student takes an exam on: the link the teacher shares. */
export function examPath(examId: string): string {
  return `${EXAM_PATH}/${examId}`;
}

export function neighborClass(
  course: LearnCourse,
  classSlug: string | undefined,
  offset: number
): LearnClass | undefined {
  const index = course.classes.findIndex((learnClass) => learnClass.slug === classSlug);
  return index === -1 ? undefined : course.classes[index + offset];
}

export function firstClass(course: LearnCourse): LearnClass {
  return course.classes[0];
}

export function latestClass(course: LearnCourse): LearnClass {
  return course.classes[course.classes.length - 1];
}

export function querySlug(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
