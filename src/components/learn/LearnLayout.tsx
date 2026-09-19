import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import {
  LEARN_BASE_PATH,
  LEARN_COURSES,
  classPath,
  findClass,
  findCourse,
  groupClassesBySection,
  latestClass,
  practicePlayPath,
  querySlug,
} from '../../data/learn';
import type { LearnClass } from '../../data/learn';
import { learnDict } from '../../i18n/learn';
import { useLocale, useT } from '../../i18n/useT';
import { LEARN_FONT_VARS } from './fonts';
import LearnHeader from './LearnHeader';
import h from './LearnHeader.module.css';
import s from './LearnLayout.module.css';
import { toggleFullscreen } from './useFullscreen';

const FULLSCREEN_SHORTCUT_KEY: string = 'f';

export function LearnMissing() {
  const t = useT(learnDict);
  return (
    <div className={s.missing}>
      <p>{t.classNotFound}</p>
      <Link href={LEARN_BASE_PATH}>{t.goToMenu}</Link>
    </div>
  );
}

export default function LearnLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const t = useT(learnDict);
  const locale = useLocale();

  const activeCourse = findCourse(querySlug(router.query.curso)) ?? LEARN_COURSES[0];
  const activeClassSlug = querySlug(router.query.clase) ?? '';
  const activeClass = findClass(activeCourse, activeClassSlug);

  // Full screen lives in the account menu; while presenting, F is the one-key way in and out.
  useEffect(() => {
    const toggleOnShortcut = (event: KeyboardEvent) => {
      const isTyping = event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement;
      if (isTyping || event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key.toLowerCase() !== FULLSCREEN_SHORTCUT_KEY) return;
      event.preventDefault();
      toggleFullscreen();
    };
    window.addEventListener('keydown', toggleOnShortcut);
    return () => window.removeEventListener('keydown', toggleOnShortcut);
  }, []);

  function changeCourse(slug: string) {
    const course = findCourse(slug);
    if (!course || course.classes.length === 0) return;
    router.push(classPath(course, latestClass(course)));
  }

  function changeClass(slug: string) {
    const target = findClass(activeCourse, slug);
    if (!target) return;
    router.push(classPath(activeCourse, target));
  }

  function renderClassOption(learnClass: LearnClass) {
    return (
      <option key={learnClass.slug} value={learnClass.slug}>
        {learnClass.title[locale]}
      </option>
    );
  }

  return (
    <div className={`${s.shell} ${LEARN_FONT_VARS}`}>
      <Head>
        <title>{t.pageTitle}</title>
        {/* Unlisted section: reachable only by direct link. */}
        <meta name="robots" content="noindex, nofollow" />
        <meta name="theme-color" content="#14161a" />
      </Head>
      <LearnHeader
        center={
          <>
            <label className={h.selectGroup}>
              <span className={h.selectLabel}>{t.courseLabel}</span>
              <select
                className={h.select}
                value={activeCourse.slug}
                onChange={(event) => {
                  changeCourse(event.target.value);
                  event.target.blur();
                }}
              >
                {LEARN_COURSES.map((course) => (
                  <option key={course.slug} value={course.slug}>
                    {course.title}
                  </option>
                ))}
              </select>
            </label>
            <label className={h.selectGroup}>
              <span className={h.selectLabel}>{t.classLabel}</span>
              <select
                className={h.select}
                value={activeClassSlug}
                onChange={(event) => {
                  changeClass(event.target.value);
                  event.target.blur();
                }}
              >
                {groupClassesBySection(activeCourse).map((group) =>
                  group.section ? (
                    <optgroup key={group.section} label={group.section}>
                      {group.classes.map(renderClassOption)}
                    </optgroup>
                  ) : (
                    group.classes.map(renderClassOption)
                  )
                )}
              </select>
            </label>
            {activeClass && (
              <Link
                href={practicePlayPath({ courseSlug: activeCourse.slug, classSlug: activeClass.slug })}
                className={s.practiceLink}
                title={t.practiceThisClass}
              >
                {t.practice}
              </Link>
            )}
          </>
        }
      />
      <main className={s.main}>{children}</main>
    </div>
  );
}
