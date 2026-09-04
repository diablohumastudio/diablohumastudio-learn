import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  LEARN_BASE_PATH,
  LEARN_COURSES,
  classPath,
  findClass,
  findCourse,
  groupClassesBySection,
  latestClass,
  querySlug,
} from '../../data/learn';
import type { LearnClass } from '../../data/learn';
import { learnDict } from '../../i18n/learn';
import { useLocale, useT } from '../../i18n/useT';
import LanguageSwitch from '../LanguageSwitch';
import { LEARN_FONT_VARS } from './fonts';
import s from './LearnLayout.module.css';

export function LearnMissing() {
  const t = useT(learnDict);
  return (
    <div className={s.missing}>
      <p>{t.classNotFound}</p>
      <Link href={LEARN_BASE_PATH}>{t.goToLatest}</Link>
    </div>
  );
}

export default function LearnLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const t = useT(learnDict);
  const locale = useLocale();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const activeCourse = findCourse(querySlug(router.query.curso)) ?? LEARN_COURSES[0];
  const activeClassSlug = querySlug(router.query.clase) ?? '';

  useEffect(() => {
    const syncFullscreenState = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', syncFullscreenState);
    return () => document.removeEventListener('fullscreenchange', syncFullscreenState);
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

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      return;
    }
    document.documentElement.requestFullscreen();
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
      <header className={s.header}>
        <span className={s.led} />
        <span className={s.brand}>LEARN</span>
        <label className={s.selectGroup}>
          <span className={s.selectLabel}>{t.courseLabel}</span>
          <select
            className={s.select}
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
        <label className={s.selectGroup}>
          <span className={s.selectLabel}>{t.classLabel}</span>
          <select
            className={s.select}
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
        <span className={s.spacer} />
        <LanguageSwitch className={s.languageSwitch} />
        <button
          type="button"
          className={s.fullscreenBtn}
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? t.exitFullscreen : t.fullscreen}
          title={isFullscreen ? t.exitFullscreenHint : t.fullscreen}
        >
          ⛶
        </button>
      </header>
      <main className={s.main}>{children}</main>
    </div>
  );
}
