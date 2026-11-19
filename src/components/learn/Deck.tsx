import { useRouter } from 'next/router';
import { Children, createContext, isValidElement, useContext, useEffect, useRef, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { classPath, findClass, findCourse, neighborClass, querySlug } from '../../data/learn';
import { learnDict } from '../../i18n/learn';
import { useT } from '../../i18n/useT';
import { LEARN_FONT_VARS } from './fonts';
import { lastTurnSeconds, turnDelayVariables } from './narration';
import type { DeckNarration, StepNarration } from './narration';
import s from './Deck.module.css';

type SlideProps = {
  z: string;
  /* An array of labels makes a stepped slide: → walks one step per label
     before leaving the slide, and the rail/footer show the current label.
     Content reads the step with useSlideStep(). */
  label: string | string[];
  /* The id of the slide, or one per step: the keys of the deck dictionary's
     `labels`. The deck looks the narration of each step up by it. */
  stepId?: string | string[];
  backgroundImage?: string;
  /* Shown in the notes panel (N key). One text per slide, the same for every
     step; blank lines separate paragraphs. */
  notes?: string;
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

function stepIdAt(slide: ReactElement<SlideProps> | undefined, step: number): string | undefined {
  const stepId: string | string[] | undefined = slide?.props.stepId;
  return Array.isArray(stepId) ? stepId[Math.min(step, stepId.length - 1)] : stepId;
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
  /* The narration of the deck in the current language. With it, every step
     sounds when it starts and the footer shows the voice controls. */
  narration?: DeckNarration;
  children: ReactNode;
};

const TYPING_TAGS = ['SELECT', 'INPUT', 'TEXTAREA'];
const NOTES_OPEN_STORAGE_KEY = 'learn-notes-open';
const VOICE_ON_STORAGE_KEY = 'learn-voice-on';
/* While the class plays by itself: how long a step without voice stays, how long
   the last turn of a step is left on screen when the voice ends on it, and the
   breath between two steps. */
const SILENT_STEP_MS = 2000;
const SECONDS_TO_WATCH_LAST_TURN = 2;
const PAUSE_BETWEEN_STEPS_MS = 500;

function readStoredFlag(storageKey: string, fallback: boolean): boolean {
  try {
    const stored: string | null = window.localStorage.getItem(storageKey);
    return stored === null ? fallback : stored === '1';
  } catch {
    return fallback;
  }
}

function storeFlag(storageKey: string, value: boolean) {
  try {
    window.localStorage.setItem(storageKey, value ? '1' : '0');
  } catch {
    /* private mode or blocked storage: the choice just does not persist */
  }
}

function msToWatchLastTurn(stepNarration: StepNarration, audioSeconds: number): number {
  const secondsAfterVoice: number = lastTurnSeconds(stepNarration.turnSeconds) + SECONDS_TO_WATCH_LAST_TURN - audioSeconds;
  return Math.max(0, secondsAfterVoice) * 1000;
}

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

export default function Deck({ name, context, narration, children }: DeckProps) {
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
  const [notesOpen, setNotesOpen] = useState(false);
  const [voiceOn, setVoiceOn] = useState(false);
  /* The browser refuses to play sound before the first click or key press on the page. */
  const [voiceBlocked, setVoiceBlocked] = useState(false);
  const [playingClass, setPlayingClass] = useState(false);
  const [stepRestarts, setStepRestarts] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  /* The timer that advances the class reads this when it fires, after the render that started it. */
  const playingClassRef = useRef(false);

  const activeSlide: ReactElement<SlideProps> | undefined = slides[currentIndex];
  const activeStepId: string | undefined = stepIdAt(activeSlide, currentStep);
  const stepNarration: StepNarration | undefined = activeStepId ? narration?.[activeStepId] : undefined;
  const audioUrl: string | undefined = stepNarration?.audioUrl;
  const isLastStepOfDeck: boolean = currentIndex === total - 1 && currentStep === steps - 1;
  const followingSlide: ReactElement<SlideProps> | undefined = currentStep < steps - 1 ? activeSlide : slides[currentIndex + 1];
  const followingStepId: string | undefined = stepIdAt(followingSlide, currentStep < steps - 1 ? currentStep + 1 : 0);
  const followingAudioUrl: string | undefined = followingStepId ? narration?.[followingStepId]?.audioUrl : undefined;

  function toggleNotes() {
    setNotesOpen((open) => {
      storeFlag(NOTES_OPEN_STORAGE_KEY, !open);
      return !open;
    });
  }

  function setClassPlaying(playing: boolean) {
    playingClassRef.current = playing;
    setPlayingClass(playing);
  }

  /* Remounts the slide, so the turns of the step enter again from the start of its voice. */
  function restartStep() {
    setStepRestarts((count) => count + 1);
  }

  function toggleVoice() {
    if (voiceOn && voiceBlocked) {
      restartStep();
      return;
    }
    storeFlag(VOICE_ON_STORAGE_KEY, !voiceOn);
    setVoiceOn(!voiceOn);
    if (voiceOn) {
      setClassPlaying(false);
    } else {
      restartStep();
    }
  }

  function toggleClassPlaying() {
    if (playingClass) {
      setClassPlaying(false);
      audioRef.current?.pause();
      return;
    }
    storeFlag(VOICE_ON_STORAGE_KEY, true);
    setVoiceOn(true);
    setClassPlaying(true);
    restartStep();
  }

  useEffect(() => {
    setNotesOpen(readStoredFlag(NOTES_OPEN_STORAGE_KEY, false));
    setVoiceOn(readStoredFlag(VOICE_ON_STORAGE_KEY, true));
  }, []);

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

  /* Moving by hand stops the class playing by itself; the step reached still sounds. */
  function moveByHand(move: () => void) {
    setClassPlaying(false);
    move();
  }

  useEffect(() => {
    if (!narration || !voiceOn) return undefined;
    const audio: HTMLAudioElement = audioRef.current ?? new Audio();
    let advanceTimer: number | undefined;
    let stepLeft: boolean = false;
    audioRef.current = audio;

    function advanceIfPlayingClass(delayMs: number) {
      if (!playingClassRef.current) return;
      advanceTimer = window.setTimeout(() => {
        if (isLastStepOfDeck) {
          setClassPlaying(false);
        } else {
          goNext();
        }
      }, delayMs);
    }

    if (!audioUrl || !stepNarration) {
      advanceIfPlayingClass(SILENT_STEP_MS);
      return () => window.clearTimeout(advanceTimer);
    }
    audio.src = audioUrl;
    audio.onended = () => advanceIfPlayingClass(msToWatchLastTurn(stepNarration, audio.duration) + PAUSE_BETWEEN_STEPS_MS);
    audio
      .play()
      .then(() => {
        if (!stepLeft) setVoiceBlocked(false);
      })
      .catch((error: Error) => {
        /* AbortError: this step was left before its audio started. */
        if (stepLeft || error.name === 'AbortError') return;
        setVoiceBlocked(true);
        setClassPlaying(false);
      });
    return () => {
      stepLeft = true;
      window.clearTimeout(advanceTimer);
      audio.onended = null;
      audio.pause();
    };
    /* Runs once per step shown (or restarted); the functions it calls are those of that render. */
  }, [voiceOn, audioUrl, currentIndex, currentStep, stepRestarts]);

  /* The voice of the following step is fetched ahead, so it starts with its turns. */
  useEffect(() => {
    if (!voiceOn || !followingAudioUrl) return;
    const preloadedAudio: HTMLAudioElement = new Audio();
    preloadedAudio.preload = 'auto';
    preloadedAudio.src = followingAudioUrl;
  }, [voiceOn, followingAudioUrl]);

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
        moveByHand(goNext);
      } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        moveByHand(goPrevious);
      } else if (event.key === 'Home') {
        event.preventDefault();
        moveByHand(() => goTo(0));
      } else if (event.key === 'End') {
        event.preventDefault();
        moveByHand(() => goTo(total - 1, lastStepOf(total - 1)));
      } else if (event.key === 'n' || event.key === 'N') {
        event.preventDefault();
        toggleNotes();
      } else if (narration && (event.key === 'v' || event.key === 'V')) {
        event.preventDefault();
        toggleVoice();
      } else if (narration && (event.key === 'p' || event.key === 'P')) {
        event.preventDefault();
        toggleClassPlaying();
      } else if (narration && (event.key === 'r' || event.key === 'R')) {
        event.preventDefault();
        restartStep();
      }
    }
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });

  if (total === 0 || !activeSlide) return null;

  const voiceSounding: boolean = voiceOn && !voiceBlocked && Boolean(audioUrl);
  const notesParagraphs = (activeSlide.props.notes ?? '').split(/\n\s*\n/).filter((paragraph) => paragraph.trim() !== '');

  return (
    <div className={`${s.deck} ${LEARN_FONT_VARS}`}>
      <div className={s.body}>
        <div className={s.stage}>
          {/* Keyed by slide only: a step change updates the slide in place, so
              the entrance animation and the diagram's static pieces stay put.
              Restarting a step remounts it, to replay its turns with its voice. */}
          <div
            key={`${currentIndex}-${stepRestarts}`}
            className={s.slideHost}
            style={voiceSounding && stepNarration ? turnDelayVariables(stepNarration.turnSeconds) : undefined}
          >
            <SlideSectionContext.Provider value={section}>
              <SlideStepContext.Provider value={currentStep}>{activeSlide}</SlideStepContext.Provider>
            </SlideSectionContext.Provider>
          </div>
        </div>
        {notesOpen ? (
          <aside className={s.notes} aria-label={t.notes}>
            {stepNarration ? (
              <div className={s.notesNarration}>
                <div className={s.notesTitle}>{t.narration}</div>
                <p>{stepNarration.text}</p>
              </div>
            ) : null}
            <div className={s.notesTitle}>{t.notes}</div>
            {notesParagraphs.length > 0 ? (
              notesParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
            ) : (
              <p className={s.notesEmpty}>{t.noNotes}</p>
            )}
          </aside>
        ) : null}
      </div>
      <footer className={s.bar}>
        <div className={s.navbtns}>
          <button type="button" onClick={() => moveByHand(goPrevious)} aria-label={t.previousSlide}>
            ←
          </button>
          <button type="button" onClick={() => moveByHand(goNext)} aria-label={t.nextSlide}>
            →
          </button>
          <button type="button" onClick={toggleNotes} aria-pressed={notesOpen} className={s.notesBtn}>
            {t.notes}
          </button>
          {narration ? (
            <>
              <button
                type="button"
                onClick={toggleVoice}
                aria-pressed={voiceOn}
                title={voiceOn && voiceBlocked ? t.voiceBlocked : t.voiceHint}
                className={`${s.notesBtn} ${voiceOn && voiceBlocked ? s.voiceBlocked : ''}`}
              >
                {t.voice}
              </button>
              <button
                type="button"
                onClick={toggleClassPlaying}
                aria-pressed={playingClass}
                aria-label={playingClass ? t.pauseClass : t.playClass}
                title={playingClass ? t.pauseClass : t.playClass}
                className={s.playBtn}
              >
                {playingClass ? '❚❚' : '▶'}
              </button>
              <button type="button" onClick={restartStep} aria-label={t.repeatStep} title={t.repeatStep}>
                ↻
              </button>
            </>
          ) : null}
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
