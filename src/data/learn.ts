import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import type { Dictionary } from '../i18n/useT';

/** Every route of the site is built from these constants and the path helpers below. */
export const COURSES_PATH: string = '/courses';
export const PRACTICE_PLAY_PATH: string = '/practice/play';
export const TEACHER_PATH: string = '/teacher';
export const STUDENTS_PRACTICE_INFO_PATH: string = `${TEACHER_PATH}/students-practice-info`;
export const QUESTIONS_EDITOR_PATH: string = `${TEACHER_PATH}/questions`;
export const TEACHER_EXAM_PATH: string = `${TEACHER_PATH}/exam`;
export const TEACHER_HOMEWORKS_PATH: string = `${TEACHER_PATH}/homeworks`;
/** One deliverable of the teacher's by id; there is no list here: they are listed with the
    homeworks or the exams, by role (docs/deliverables.md). */
export const TEACHER_DELIVERABLE_PATH: string = `${TEACHER_PATH}/deliverable`;
/** The list of students to review; one student's page hangs under it by uid. */
export const TEACHER_STUDENTS_PATH: string = `${TEACHER_PATH}/student`;
/** Who is enrolled in each course and who is asking for access (docs/courses.md). */
export const TEACHER_ENROLLMENT_PATH: string = `${TEACHER_PATH}/enrollment`;
/** In place of an id under the two paths above: the form of an exam or homework not saved yet. */
export const NEW_ITEM_SEGMENT: string = 'new';
export const TEACHER_EXAM_NEW_PATH: string = `${TEACHER_EXAM_PATH}/${NEW_ITEM_SEGMENT}`;
export const TEACHER_HOMEWORK_NEW_PATH: string = `${TEACHER_HOMEWORKS_PATH}/${NEW_ITEM_SEGMENT}`;
/** The query parameter that tells a new deliverable's form which role it is for. */
export const DELIVERABLE_ROLE_PARAM: string = 'role';
export const SIGN_IN_PATH: string = '/sign-in';
const COURSE_PATH_PREFIX: string = '/course';

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

/** What a question is about: a class or a reading of a course. Its slug is the question's `topic`. */
export type LearnTopic = {
  slug: string;
  title: Dictionary<string>;
};

/** A theory reading of a course: a topic with a title only, without deck, page or link. */
export type LearnReading = LearnTopic;

export type LearnCourse = {
  slug: string;
  title: string;
  classes: LearnClass[];
  /** Their slugs share the questions' `topic` with the classes: no slug may repeat across both. */
  readings: LearnReading[];
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
        slug: 'datos-y-programas',
        title: { es: 'Datos y programas', en: 'Data and programs' },
        section: 'Intro',
        component: dynamic(() => import('../presentations/wwise-unreal/datos-y-programas')),
        slideLabels: () =>
          import('../presentations/wwise-unreal/datos-y-programas.dict').then((deck) => labelsOf(deck.datosYProgramasDict)),
      },
      {
        slug: 'datos-programas-y-servidores',
        title: { es: 'Servidores', en: 'Servers' },
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
      {
        slug: 'work-units-y-vcs',
        title: { es: 'Work Units y control de versiones', en: 'Work Units and version control' },
        section: 'Intro',
        component: dynamic(() => import('../presentations/wwise-unreal/work-units-y-vcs')),
        slideLabels: () =>
          import('../presentations/wwise-unreal/work-units-y-vcs.dict').then((deck) => labelsOf(deck.workUnitsDict)),
      },
    ],
    readings: [
      { slug: 'lectura-git', title: { es: 'Git', en: 'Git' } },
      { slug: 'lectura-work-units', title: { es: 'Work Units', en: 'Work Units' } },
      { slug: 'lectura-game-syncs', title: { es: 'Game Syncs', en: 'Game Syncs' } },
    ],
  },
];

/** One course or one topic of it. Practice always has a course; only an exam may cover everything. */
export type PracticeScope = {
  courseSlug?: string;
  /** The slug of a class or of a reading: it keeps the name of the `class` query parameter. */
  classSlug?: string;
};

export function coursePath(course: LearnCourse): string {
  return `${COURSE_PATH_PREFIX}/${course.slug}`;
}

/** Exams belong to a course, like practice: the list lives under it, never at the top level. */
export function courseExamsPath(course: LearnCourse): string {
  return `${coursePath(course)}/exams`;
}

/** Every homework of the student in a course, specific and deliverable, open and finished, as rows. */
export function courseHomeworksPath(course: LearnCourse): string {
  return `${coursePath(course)}/homeworks`;
}

/** One specific homework of the student, with its meter and its days: what its row opens. */
export function homeworkPath(course: LearnCourse, homeworkId: string): string {
  return `${courseHomeworksPath(course)}/${homeworkId}`;
}

/** The signed-in student's own history in a course: grade by month, day by day and by question. */
export function courseHistoryPath(course: LearnCourse): string {
  return `${coursePath(course)}/history`;
}

/** The signed-in student's own question proposals for the course's bank, and the form to send one. */
export function courseProposalsPath(course: LearnCourse): string {
  return `${coursePath(course)}/proposals`;
}

export function classPath(course: LearnCourse, learnClass: LearnClass): string {
  return `${coursePath(course)}/class/${learnClass.slug}`;
}

export function findCourse(slug: string | undefined): LearnCourse | undefined {
  return LEARN_COURSES.find((course) => course.slug === slug);
}

export function findClass(course: LearnCourse, slug: string | undefined): LearnClass | undefined {
  return course.classes.find((learnClass) => learnClass.slug === slug);
}

/** Everything a question of the course can be about: its classes in teaching order, then its readings. */
export function courseTopics(course: LearnCourse): LearnTopic[] {
  return [...course.classes, ...course.readings];
}

export function findTopic(course: LearnCourse, slug: string | undefined): LearnTopic | undefined {
  return courseTopics(course).find((topic) => topic.slug === slug);
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
  const topic = findTopic(course, classSlug);
  return topic ? { courseSlug: course.slug, classSlug: topic.slug } : { courseSlug: course.slug };
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

/** Playing a specific homework: its answers count for it and not for the course's daily homework.
    `roundId` names the round to play; a round without id (a homework older than the rounds) adds
    nothing, and the link is then the homework's own. */
export function homeworkPlayPath(courseSlug: string, homeworkId: string, roundId?: string): string {
  const params = new URLSearchParams({ course: courseSlug, homework: homeworkId });
  if (roundId) params.set('round', roundId);
  return `${PRACTICE_PLAY_PATH}?${params.toString()}`;
}

/** The page a student takes an exam on: the link the teacher shares. */
/** The teacher's page of one exam: its draft form, or the live view once it is opened. */
export function teacherExamPath(examId: string): string {
  return `${TEACHER_EXAM_PATH}/${examId}`;
}

/** The replay of one student's attempt, by the uid the attempt is stored under. */
export function teacherAttemptPath(examId: string, uid: string): string {
  return `${teacherExamPath(examId)}/${uid}`;
}

/** Everything of one student on one page: daily homework, specific homeworks and exams. */
export function teacherStudentPath(uid: string): string {
  return `${TEACHER_STUDENTS_PATH}/${uid}`;
}

export function teacherHomeworkPath(homeworkId: string): string {
  return `${TEACHER_HOMEWORKS_PATH}/${homeworkId}`;
}

export function examPath(course: LearnCourse, examId: string): string {
  return `${courseExamsPath(course)}/${examId}`;
}

/** The page a student hands a deliverable in on; its course is in the URL, like an exam's. */
export function deliverablePath(course: LearnCourse, deliverableId: string): string {
  return `${coursePath(course)}/deliverable/${deliverableId}`;
}

/** The teacher's page of one deliverable: its draft form, or the live view once it is opened. */
export function teacherDeliverablePath(deliverableId: string): string {
  return `${TEACHER_DELIVERABLE_PATH}/${deliverableId}`;
}

/** The form of a deliverable not saved yet, for the list (homeworks or exams) it was asked from. */
export function teacherDeliverableNewPath(role: string): string {
  return `${TEACHER_DELIVERABLE_PATH}/${NEW_ITEM_SEGMENT}?${DELIVERABLE_ROLE_PARAM}=${role}`;
}

/** One student's submission, by the uid it is stored under. */
export function teacherSubmissionPath(deliverableId: string, uid: string): string {
  return `${teacherDeliverablePath(deliverableId)}/${uid}`;
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
