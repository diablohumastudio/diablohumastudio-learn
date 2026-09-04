import { useRouter } from 'next/router';
import { Children, createContext, isValidElement, useContext, useEffect } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { classPath, findClass, findCourse, neighborClass, querySlug } from '../../data/learn';
import { LEARN_FONT_VARS } from './fonts';
import s from './Deck.module.css';

type SlideProps = {
  z: string;
  label: string;
  backgroundImage?: string;
  children: ReactNode;
};

/* The class section (e.g. "Intro") comes from the registry, not from the deck
   author, so Deck resolves it once and every Slide reads it for its rail. */
const SlideSectionContext = createContext<string | undefined>(undefined);

export function Slide({ z, label, backgroundImage, children }: SlideProps) {
  const section = useContext(SlideSectionContext);
  const backgroundStyle = backgroundImage
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(20, 22, 26, 0.45) 0%, rgba(20, 22, 26, 0.85) 100%), url(${backgroundImage})`,
      }
    : undefined;
  return (
    <section className={s.slide} style={backgroundStyle}>
      <div className={s.rail}>
        {section ? <span className={s.railSection}>{section}</span> : null}
        <span className={s.z}>{z}</span>
        <span className={s.zl}>{label}</span>
      </div>
      <div className={s.content}>{children}</div>
    </section>
  );
}

type DeckProps = {
  name: string;
  context?: string;
  children: ReactNode;
};

const TYPING_TAGS = ['SELECT', 'INPUT', 'TEXTAREA'];

function pad2(value: number): string {
  return value < 10 ? `0${value}` : `${value}`;
}

export default function Deck({ name, context, children }: DeckProps) {
  const router = useRouter();
  const slides = Children.toArray(children).filter(isValidElement) as ReactElement<SlideProps>[];
  const total = slides.length;
  const course = findCourse(querySlug(router.query.curso));
  const section = course ? findClass(course, querySlug(router.query.clase))?.section : undefined;

  const rawSlideParam = Array.isArray(router.query.s) ? router.query.s[0] : router.query.s;
  // '?s=last' lands on the final slide without the sender knowing the count
  // (used when stepping back into the previous class).
  const requestedSlide = rawSlideParam === 'last' ? total : Number(rawSlideParam ?? '1');
  const currentIndex = Math.min(
    Math.max(Number.isFinite(requestedSlide) ? Math.round(requestedSlide) - 1 : 0, 0),
    Math.max(total - 1, 0)
  );

  function goToNeighborClass(offset: number) {
    const course = findCourse(querySlug(router.query.curso));
    if (!course) return;
    const target = neighborClass(course, querySlug(router.query.clase), offset);
    if (!target) return;
    router.push({
      pathname: classPath(course, target),
      query: offset < 0 ? { s: 'last' } : undefined,
    });
  }

  function goTo(index: number) {
    if (index < 0) {
      goToNeighborClass(-1);
      return;
    }
    if (index > total - 1) {
      goToNeighborClass(1);
      return;
    }
    if (index === currentIndex) return;
    const query = { ...router.query };
    if (index === 0) {
      delete query.s;
    } else {
      query.s = String(index + 1);
    }
    // Shallow push: every slide becomes a history entry, so browser
    // back/forward walk the slides (and cross back to the previous class).
    router.push({ pathname: router.pathname, query }, undefined, { shallow: true });
  }

  useEffect(() => {
    if (rawSlideParam !== 'last' || total === 0) return;
    const query = { ...router.query };
    if (total === 1) {
      delete query.s;
    } else {
      query.s = String(total);
    }
    router.replace({ pathname: router.pathname, query }, undefined, { shallow: true });
  });

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && TYPING_TAGS.includes(target.tagName)) return;
      if (event.key === 'ArrowRight' || event.key === ' ' || event.key === 'PageDown') {
        event.preventDefault();
        goTo(currentIndex + 1);
      } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        goTo(currentIndex - 1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        goTo(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        goTo(total - 1);
      }
    }
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });

  if (total === 0) return null;

  const activeSlide = slides[currentIndex];

  return (
    <div className={`${s.deck} ${LEARN_FONT_VARS}`}>
      <div className={s.stage}>
        <div key={currentIndex} className={s.slideHost}>
          <SlideSectionContext.Provider value={section}>{activeSlide}</SlideSectionContext.Provider>
        </div>
      </div>
      <footer className={s.bar}>
        <div className={s.navbtns}>
          <button type="button" onClick={() => goTo(currentIndex - 1)} aria-label="Diapositiva anterior">
            ←
          </button>
          <button type="button" onClick={() => goTo(currentIndex + 1)} aria-label="Siguiente diapositiva">
            →
          </button>
        </div>
        <span className={s.deckName}>{name}</span>
        {context ? <span className={s.deckContext}>{context}</span> : null}
        <div className={s.playhead}>
          <i style={{ width: `${total > 1 ? (currentIndex / (total - 1)) * 100 : 100}%` }} />
        </div>
        <span className={s.tc}>{activeSlide.props.label}</span>
        <span className={s.counter}>
          {pad2(currentIndex + 1)} / {pad2(total)}
        </span>
        <span className={s.hint}>← → · espacio</span>
      </footer>
    </div>
  );
}
