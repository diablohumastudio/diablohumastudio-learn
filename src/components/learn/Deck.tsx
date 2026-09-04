import { useRouter } from 'next/router';
import { Children, createContext, isValidElement, useContext, useEffect } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { classPath, findClass, findCourse, neighborClass, querySlug } from '../../data/learn';
import { learnDict } from '../../i18n/learn';
import { useT } from '../../i18n/useT';
import { LEARN_FONT_VARS } from './fonts';
import s from './Deck.module.css';

type SlideProps = {
  z: string;
  /* An array of labels makes a stepped slide: → walks one step per label
     before leaving the slide, and the rail/footer show the current label.
     Content reads the step with useSlideStep(). */
  label: string | string[];
  backgroundImage?: string;
  children: ReactNode;
};

/* The class section (e.g. "Intro") comes from the registry, not from the deck
   author, so Deck resolves it once and every Slide reads it for its rail. */
const SlideSectionContext = createContext<string | undefined>(undefined);

/* Current step (0-based) of the active slide; 0 for slides without steps. */
const SlideStepContext = createContext(0);

export function useSlideStep(): number {
  return useContext(SlideStepContext);
}

function labelAt(label: string | string[], step: number): string {
  return Array.isArray(label) ? label[Math.min(step, label.length - 1)] : label;
}

function stepCount(slide: ReactElement<SlideProps> | undefined): number {
  if (!slide) return 1;
  return Array.isArray(slide.props.label) ? Math.max(slide.props.label.length, 1) : 1;
}

export function Slide({ z, label, backgroundImage, children }: SlideProps) {
  const section = useContext(SlideSectionContext);
  const step = useSlideStep();
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
        <span className={s.zl}>{labelAt(label, step)}</span>
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

function queryParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function clampIndex(requested: number, count: number): number {
  const rounded = Number.isFinite(requested) ? Math.round(requested) - 1 : 0;
  return Math.min(Math.max(rounded, 0), Math.max(count - 1, 0));
}

export default function Deck({ name, context, children }: DeckProps) {
  const router = useRouter();
  const t = useT(learnDict);
  const slides = Children.toArray(children).filter(isValidElement) as ReactElement<SlideProps>[];
  const total = slides.length;
  const course = findCourse(querySlug(router.query.curso));
  const section = course ? findClass(course, querySlug(router.query.clase))?.section : undefined;

  const rawSlideParam = queryParam(router.query.s);
  // '?s=last' lands on the final slide (at its last step) without the sender
  // knowing the count (used when stepping back into the previous class).
  const requestedSlide = rawSlideParam === 'last' ? total : Number(rawSlideParam ?? '1');
  const currentIndex = clampIndex(requestedSlide, total);
  const steps = stepCount(slides[currentIndex]);
  const currentStep = clampIndex(Number(queryParam(router.query.p) ?? '1'), steps);

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

  function goTo(index: number, step = 0) {
    if (index < 0) {
      goToNeighborClass(-1);
      return;
    }
    if (index > total - 1) {
      goToNeighborClass(1);
      return;
    }
    if (index === currentIndex && step === currentStep) return;
    const query = { ...router.query };
    if (index === 0) {
      delete query.s;
    } else {
      query.s = String(index + 1);
    }
    if (step === 0) {
      delete query.p;
    } else {
      query.p = String(step + 1);
    }
    // Shallow push: every slide and step becomes a history entry, so browser
    // back/forward walk them (and cross back to the previous class).
    router.push({ pathname: router.pathname, query }, undefined, { shallow: true });
  }

  function lastStepOf(index: number): number {
    return stepCount(slides[index]) - 1;
  }

  function goNext() {
    if (currentStep < steps - 1) {
      goTo(currentIndex, currentStep + 1);
    } else {
      goTo(currentIndex + 1);
    }
  }

  function goPrevious() {
    if (currentStep > 0) {
      goTo(currentIndex, currentStep - 1);
    } else {
      goTo(currentIndex - 1, currentIndex > 0 ? lastStepOf(currentIndex - 1) : 0);
    }
  }

  useEffect(() => {
    if (rawSlideParam !== 'last' || total === 0) return;
    const query = { ...router.query };
    const lastStep = lastStepOf(total - 1);
    if (total === 1) {
      delete query.s;
    } else {
      query.s = String(total);
    }
    if (lastStep === 0) {
      delete query.p;
    } else {
      query.p = String(lastStep + 1);
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
        goNext();
      } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        goPrevious();
      } else if (event.key === 'Home') {
        event.preventDefault();
        goTo(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        goTo(total - 1, lastStepOf(total - 1));
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
        {/* Keyed by slide only: a step change updates the slide in place, so
            the entrance animation and the diagram's static pieces stay put. */}
        <div key={currentIndex} className={s.slideHost}>
          <SlideSectionContext.Provider value={section}>
            <SlideStepContext.Provider value={currentStep}>{activeSlide}</SlideStepContext.Provider>
          </SlideSectionContext.Provider>
        </div>
      </div>
      <footer className={s.bar}>
        <div className={s.navbtns}>
          <button type="button" onClick={goPrevious} aria-label={t.previousSlide}>
            ←
          </button>
          <button type="button" onClick={goNext} aria-label={t.nextSlide}>
            →
          </button>
        </div>
        <span className={s.deckName}>{name}</span>
        {context ? <span className={s.deckContext}>{context}</span> : null}
        <div className={s.playhead}>
          <i style={{ width: `${total > 1 ? (currentIndex / (total - 1)) * 100 : 100}%` }} />
        </div>
        <span className={s.tc}>{labelAt(activeSlide.props.label, currentStep)}</span>
        <span className={s.counter}>
          {pad2(currentIndex + 1)} / {pad2(total)}
          {steps > 1 ? ` · ${currentStep + 1}/${steps}` : ''}
        </span>
        <span className={s.hint}>{t.keysHint}</span>
      </footer>
    </div>
  );
}
