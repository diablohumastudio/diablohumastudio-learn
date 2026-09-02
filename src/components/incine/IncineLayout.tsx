import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { INCINE_COURSES, findCourse, latestClass, querySlug } from '../../data/incine';
import { INCINE_FONT_VARS } from './fonts';
import s from './IncineLayout.module.css';

export function IncineMissing() {
  return (
    <div className={s.missing}>
      <p>Clase no encontrada.</p>
      <Link href="/incine">Ir a la última clase</Link>
    </div>
  );
}

export default function IncineLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const activeCourse = findCourse(querySlug(router.query.curso)) ?? INCINE_COURSES[0];
  const activeClassSlug = querySlug(router.query.clase) ?? '';

  useEffect(() => {
    const syncFullscreenState = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', syncFullscreenState);
    return () => document.removeEventListener('fullscreenchange', syncFullscreenState);
  }, []);

  function changeCourse(slug: string) {
    const course = findCourse(slug);
    if (!course || course.classes.length === 0) return;
    router.push(`/incine/${course.slug}/${latestClass(course).slug}`);
  }

  function changeClass(slug: string) {
    router.push(`/incine/${activeCourse.slug}/${slug}`);
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      return;
    }
    document.documentElement.requestFullscreen();
  }

  return (
    <div className={`${s.shell} ${INCINE_FONT_VARS}`}>
      <Head>
        <title>INCINE – DiabloHumaStudio</title>
        {/* Unlisted section: reachable only by direct link. */}
        <meta name="robots" content="noindex, nofollow" />
        <meta name="theme-color" content="#14161a" />
      </Head>
      <header className={s.header}>
        <span className={s.led} />
        <span className={s.brand}>INCINE</span>
        <label className={s.selectGroup}>
          <span className={s.selectLabel}>Curso</span>
          <select
            className={s.select}
            value={activeCourse.slug}
            onChange={(event) => {
              changeCourse(event.target.value);
              event.target.blur();
            }}
          >
            {INCINE_COURSES.map((course) => (
              <option key={course.slug} value={course.slug}>
                {course.title}
              </option>
            ))}
          </select>
        </label>
        <label className={s.selectGroup}>
          <span className={s.selectLabel}>Clase</span>
          <select
            className={s.select}
            value={activeClassSlug}
            onChange={(event) => {
              changeClass(event.target.value);
              event.target.blur();
            }}
          >
            {activeCourse.classes.map((incineClass) => (
              <option key={incineClass.slug} value={incineClass.slug}>
                {incineClass.title}
              </option>
            ))}
          </select>
        </label>
        <span className={s.spacer} />
        <button
          type="button"
          className={s.fullscreenBtn}
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          title={isFullscreen ? 'Salir de pantalla completa (Esc)' : 'Pantalla completa'}
        >
          ⛶
        </button>
      </header>
      <main className={s.main}>{children}</main>
    </div>
  );
}
