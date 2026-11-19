# Learn: Adding Courses, Classes and Slides

The platform serves class presentations. It is unlisted (`noindex, nofollow`, never linked from the marketing site) and reachable only by direct URL.

## How it is wired

| Piece | Files | Role |
|---|---|---|
| Registry | `src/data/learn.ts` | Single source of truth: courses → classes → presentation component, and courses → readings |
| Presentations | `src/presentations/<course-slug>/<class-slug>.tsx` | One React component per class, built with `Deck`/`Slide` |
| Deck engine | `src/components/learn/Deck.tsx` + `Deck.module.css` | Slide state, keyboard navigation, playhead/counter, `?s=` URL sync |
| Narration | `src/components/learn/narration.ts`, `narration/` | The voice of a deck: reads each step's text and timings for `Deck`; `narration/scripts/generate-narration.js` generates the audio (see Narration below) |
| Deck layout | `src/components/learn/LearnLayout.tsx` | Full-height shell for the decks; puts the course/class dropdowns and the Practice link in the header; `F` toggles full screen |
| Page layout | `src/components/learn/LearnPageLayout.tsx` | Scrolling column for the menus, practice, teacher and sign-in pages |
| Header | `src/components/learn/LearnHeader.tsx`, `AccountMenu.tsx`, `ConfigDialog.tsx`, `TeacherLink.tsx`, `useFullscreen.ts` | Shared by both layouts: `LEARN` links to `/courses`; the account name (or Guest user) opens a menu with Teacher (teachers only), language, full screen, Config (language, practice time per question and text size, from 4px smaller to 4px larger, applied to the pages but not to the decks) and sign in / sign out |
| Menus | `src/components/learn/CourseList.tsx`, `ClassList.tsx` | `/courses` is a course dropdown with a Go to course link; `/course/<course-slug>` shows four cards closed to their title, Daily practice, Homeworks, Exams and Class presentations, the last one with a row per class with its slides link and its practice button and, under the classes, a Readings group with a row per reading and its practice button (`CollapsibleCard`; see [practice.md](practice.md) and [courses.md](courses.md)) |
| Routes | `src/pages/index.tsx` (redirects to `/courses`), `src/pages/courses.tsx`, `src/pages/course/[curso]/index.tsx` and `src/pages/course/[curso]/class/[clase].tsx` | `/courses` is the course menu; `/course/<course-slug>` is the class menu of a course; the dynamic route renders the selected class |

URLs look like `/course/<course-slug>/class/<class-slug>` (e.g. `/course/wwise-unreal/class/el-editor-wwise`). The current slide is kept in the `?s=<n>` query param (and the current step of a stepped slide in `&p=<n>`), so browser back/forward walk through visited slides and steps, and a link can point to an exact slide or step.

Practice, sign-in and the teacher tools are top-level routes (`/practice/play`, `/sign-in`, `/teacher`, see [practice.md](practice.md)); courses live under `/course/<slug>` and classes under `/course/<slug>/class/<slug>`, so no course or class slug can collide with a static route (the exams of a course are `/course/<slug>/exams`, see [exam.md](exam.md), and a student's own history `/course/<slug>/history`, see [practice.md](practice.md)). Navigation is always a `next/link` styled as a button, never a `<button>` with `router.push`, so the destination shows in the browser.

Every internal route is built with the registry's constants and helpers (`COURSES_PATH`, `coursePath`, `classPath`, `courseExamsPath`, `examPath`, `practicePlayPath`, `TEACHER_PATH`…); never write a route literal in a component. Until 2026-10 the platform lived under `/learn` on the marketing site: that site now redirects `/learn/*` and `/incine/*` here, and `next.config.js` maps the old shapes (`/learn/...`, `/wwise-unreal/...`, `/quiz/...`) to the current routes.

## Adding a class (presentation) to an existing course

1. Create the dictionary `src/presentations/<course-slug>/<class-slug>.dict.tsx` with every text of the deck in both languages. Type it explicitly (titles carry markup) and write `es` first, since the content is authored in Spanish:

```tsx
import type { ReactNode } from 'react';
import s from '../../components/learn/Deck.module.css';

type MyNewClassTexts = {
  name: string;
  context: string;
  labels: { intro: string };
  intro: { eyebrow: string; title: ReactNode; lede: string };
};

const es: MyNewClassTexts = {
  name: 'Título de la clase',
  context: 'Contexto · opcional · va en el footer',
  labels: { intro: 'intro' },
  intro: { eyebrow: 'Kicker en ámbar', title: <>Título del <span className={s.accent}>slide</span></>, lede: 'Párrafo principal.' },
};

const en: MyNewClassTexts = {
  name: 'Class title',
  context: 'Optional · context · shown in the footer',
  labels: { intro: 'intro' },
  intro: { eyebrow: 'Small amber kicker', title: <>Slide <span className={s.accent}>title</span></>, lede: 'Main paragraph.' },
};

export const myNewClassDict = { es, en };
```

2. Create `src/presentations/<course-slug>/<class-slug>.tsx`, reading the dictionary with `useT`:

```tsx
import Deck, { Slide } from '../../components/learn/Deck';
import s from '../../components/learn/Deck.module.css';
import { useT } from '../../i18n/useT';
import { myNewClassDict } from './my-new-class.dict';

export default function MyNewClass() {
  const t = useT(myNewClassDict);
  return (
    <Deck name={t.name} context={t.context}>
      <Slide z="1" label={t.labels.intro}>
        <div className={s.eyebrow}>{t.intro.eyebrow}</div>
        <h2>{t.intro.title}</h2>
        <p className={s.lede}>{t.intro.lede}</p>
      </Slide>
      {/* more <Slide>s */}
    </Deck>
  );
}
```

3. Register it in `src/data/learn.ts`, appending to the course's `classes` array (the title is per language too):

```ts
{
  slug: 'my-new-class',
  title: { es: 'Mi clase nueva', en: 'My New Class' },
  component: dynamic(() => import('../presentations/wwise-unreal/my-new-class')),
  slideLabels: () => import('../presentations/wwise-unreal/my-new-class.dict').then((deck) => labelsOf(deck.myNewClassDict)),
},
```

`slideLabels` hands the deck dictionary's `labels` to the teacher tools: **every key of `labels` is the id of a slide** (a stepped slide has one key per step). Questions are tagged with those ids, and exams select by them (see [practice.md](practice.md)), so give every slide its label through `t.labels.<key>` and **never rename a key once questions point at it**; changing the text of a label is free.

That is all — the class menu, the class dropdown, the practice scopes and the route are generated from the registry.

Notes:

- Slugs are kebab-case and become the URL segment; the file name must match the slug.
- **Append new classes at the end of the array**: the array order is the teaching order shown in the class menu, and `←` on a class's first slide and `→` on its last slide step into the neighbouring class.
- Optional `section: 'Intro'` groups the class with its neighbours: consecutive classes sharing a `section` become an `<optgroup>` in the class dropdown, and the section name is shown at the top of every slide's left rail. Classes without a section render as today. Keep sectioned classes contiguous in the array — the grouping is by adjacency, so a gap starts a second group with the same name.

## Adding a reading

A **reading** is a theory text the students get outside the platform (a PDF, a handout). The registry only knows its name, so that questions can be about it: a reading has no deck, no page and no link. Classes and readings together are the **topics** of a course (`courseTopics`, `findTopic`), and a question's `topic` is the slug of one of them (see [practice.md](practice.md)).

Append an entry to the course's `readings` array in `src/data/learn.ts`:

```ts
readings: [
  { slug: 'lectura-git', title: { es: 'Git', en: 'Git' } },
],
```

That is all: the question editor's Topic dropdown, the question picker (a Readings group in its filter), the practice scope dropdown and the course page (a Readings group under the classes, a row per reading with its practice button and no number or link) are generated from the registry. The class numbering, the class dropdown of the decks and the ← → neighbours never count readings.

Notes:

- **A reading's slug must not repeat any class or reading slug, of any course**: the slug is how a question finds its course. The prefix `lectura-` keeps the readings apart from the classes.
- **Never rename a slug once questions point at it**: they would belong to no course and never be practiced. The title is free to change.
- The slug's initials number the reading's questions, like a class's: `wu-lg-001` for `wwise-unreal` / `lectura-git`. Check that the initials do not repeat those of another topic of the course.

## Adding a course

1. Create the folder `src/presentations/<course-slug>/`.
2. Add an entry to `LEARN_COURSES` in `src/data/learn.ts` with `slug`, `title`, a `classes` array (at least one class) and a `readings` array (empty when the course has none).

The course menu and the course dropdown are generated from `LEARN_COURSES`; switching course in the dropdown navigates to that course's latest class.

## Writing slides

`Slide` props:

- `z` — the big amber character in the left rail (a zoom level, number or symbol).
- `label` — the small vertical text in the rail, also shown uppercase in the footer. An array of labels makes a **stepped slide** (see below), one step per label.
- `backgroundImage` (optional) — URL of a full-bleed background image for the slide, automatically darkened with a gradient so text stays readable (used for cover slides). Put slide images under `public/assets/presentations/<course-slug>/` and reference them as `/assets/presentations/<course-slug>/<file>`.
- `notes` (optional) — text for the notes panel: what the slide cannot say in its own texts (the analogy behind a diagram, the longer explanation). One string per slide, from the dictionary; blank lines separate paragraphs, and a stepped slide has the same notes on every step. The panel opens to the right of the slide with `N` or the `notes` button in the footer, stays open across slides and classes (remembered in `localStorage`) and is visible to anyone who opens it.

Content goes inside `Slide` as JSX. Plain `h1`, `h2`, `strong`, `code`, `figure`/`figcaption` and `svg text` are already styled by `Deck.module.css`; for the rest import the module (`import s from '../../components/learn/Deck.module.css'`):

| Class | Use |
|---|---|
| `s.eyebrow` | Small uppercase amber kicker above the title |
| `s.lede` | Main paragraph (18px, ink) |
| `s.note` | Secondary paragraph (15px, muted) |
| `s.accent` / `s.teal` | Amber / teal colored `span` |
| `s.cols` | Column layout: `<div className={s.cols}><div>…</div><div>…</div></div>` |
| `s.block` | `<pre>` code block; inside it use `s.k` (teal keyword), `s.a` (amber id), `s.c` (muted comment) |
| `s.tight` | Bulleted `<ul>` with amber markers |
| `s.plain` | Data table (first column mono + amber); use `<thead>`/`<tbody>` |
| `s.svgSans` | On an SVG `<text>` to use the body font (SVG text defaults to mono) |
| `s.morphOut` / `s.morphIn` / `s.morphGlide` / `s.morphGlideOut` / `s.morphPulse` | On SVG `<g>` wrappers (or HTML elements), replay a transition from the previous slide's diagram when the slide mounts (draw the final state; stagger steps with inline `animation-delay`; `morphGlide` reads its start `transform` from `--morph-from`; `morphGlideOut` slides to `--morph-to` while fading out, for the previous diagram leaving; `morphPulse` scales briefly for emphasis) |
| `s.h2TwoLines` | On an `h2` whose text changes by step (or must line up with a neighbour slide): keeps the height of two lines so the layout never shifts |
| `s.oculto` | Keeps the layout slot of an element a later step will show (`visibility: hidden`) |

Stepped slides (one slide built up in several steps, like fragments in other slide tools):

- Pass `label` as an array: `<Slide z="6" label={[t.labels.arranque, t.labels.pide, t.labels.busca]}>`. `→` walks the steps before leaving the slide and `←` walks them back (coming from the next slide lands on the last step). The rail and footer show the current step's label, and the counter reads e.g. `09 / 09 · 2/3`.
- Content reads the current step (0-based) with `useSlideStep()` from `Deck`, inside a component rendered within the `Slide`: `const step = useSlideStep();` then draw the state for that step.
- The slide stays mounted between steps, so only the elements a step adds are mounted: put `s.morphIn` (or the other morph classes) on the group the new step adds, and it animates once when the step is reached. Elements from earlier steps stay static. Opening a step directly (`?s=9&p=3`) draws the final state and animates only the last piece.
- Prefer a stepped slide over a run of `z="="` slides whenever the steps share the same title and diagram; `=` slides remain for a diagram that morphs into a different idea.

Texts and languages:

- Every visible text of a deck lives in its `.dict.tsx`: `h1`/`h2` (as JSX, with the amber `span`), eyebrows, `figcaption`, the SVG `aria-label`, every `<text>`, the `Slide` labels and the `Deck` name and context. The SVG `<text>` nodes are JSX, so `{t.key}` goes inside them like anywhere else. Functions that draw labels (the `Rotulos*` pattern) receive their texts object as a prop; geometry helpers take no texts.
- Keep the two languages about the same length (±15 % characters) so labels stay inside their boxes; absorb a difference with `textAnchor` (`middle`/`end`) before moving coordinates. When a phrase must change length by more, check the slide in both `/course/...` and `/es/course/...`.
- Product names (Wwise views, editors, layouts, file names such as `juego.exe`) stay in English in both dictionaries.

Gotchas:

- JSX collapses whitespace and newlines in text, so multi-line `<pre>` content must use string expressions for the line breaks:

  ```tsx
  <pre className={s.block}>
    <span className={s.k}>func</span> _ready():{'\n'}
    {'  '}<span className={s.c}># one line per string expression</span>
  </pre>
  ```
- Inline SVGs use JSX attribute names (`strokeWidth`, `strokeOpacity`, `textAnchor`, `fontSize`, `fontWeight`, `letterSpacing`, `markerEnd`, `strokeDasharray`…).
- Do not set `font-family` on SVG text — the stylesheet handles it (mono by default, `s.svgSans` for body font).
- Use theme tokens (`var(--amber)`, `var(--panel)`, `var(--line)`…) from `src/components/learn/theme.module.css` in any new module CSS instead of hard-coding hex values. Inside SVG attributes, hex values matching the theme are fine (that is what the existing slides do).

## Narration

A deck can speak: every step has a text, a voice file and the moment each of its animations enters. A deck without narration behaves as before.

| Piece | File | Role |
|---|---|---|
| Text | `src/presentations/<course>/<class>.narracion.json` | `{ es: { <stepId>: text }, en: { … } }`. The source of what is said and read. A mark `[n]` in the text is the point where turn `n` of the step enters |
| Voices | `narration/voices.json` | ElevenLabs model and voice per language, and the macOS `say` voices used as a free draft |
| Generator | `narration/scripts/generate-narration.js` | Writes one mp3 per step, the per-letter alignment and the timings file |
| Audio | `public/assets/presentations/<course>/narracion/<class>/<lang>/<stepId>.mp3` | Generated |
| Alignment | `narration/alignments/<course>/<class>/<lang>/<stepId>.json` | Generated: the time of every letter, kept so that moving a mark costs nothing |
| Timings | `src/presentations/<course>/<class>.narracion-tiempos.json` | Generated: per step, its duration and the second of each mark. The only generated file the deck imports |

Wiring a deck:

- Give every `Slide` its `stepId`: the key of its label in the dictionary's `labels`, or an array with one key per step (`stepId={['ideas', 'datos']}`).
- Build the narration of the current language with `buildNarration(texts[locale], timings[locale], audioBase)` and pass it to `<Deck narration={…}>`.
- Delay every animation of a step by its turn: `animationDelay: var(--turn-<n>, <silent delay>)`. While a step sounds, `Deck` sets `--turn-<n>` on the slide to the second of mark `[n]`; without voice the fallback applies, so the deck keeps its own pace. `datos-y-programas.tsx` does it with its `turno(n)` helper.

What the viewer gets:

- With the voice on (the `voice` button or `V`; on by default, remembered in `localStorage`), a step sounds every time it starts, also when reached with the arrows.
- `▶` (or `P`) plays the class from the current step: when a step's voice ends, the deck moves to the next one. Moving by hand stops it; the step reached still sounds.
- `↻` (or `R`) repeats the current step: voice and animations.
- The notes panel shows the text of the current step above the notes.
- A browser does not play sound before the first click or key press on a page: after opening a deck by its URL or reloading it, the voice button shows a dashed border until then.

Generating the voice, from the repo root:

```sh
node narration/scripts/generate-narration.js <course> <class> [--lang es|en] [--only step1,step2] [--provider elevenlabs|say|web] [--dry-run]
node narration/scripts/generate-narration.js <course> <class> [--lang es|en] --web-script
```

- ElevenLabs (`ELEVENLABS_API_KEY` in `.env.local`) bills per character, not per request, so one file per step costs the same as one file for the class. Only the steps whose spoken text, voice or model changed are requested; `--dry-run` tells the cost without calling.
- Moving a `[n]` mark does not change the spoken text: run the generator again and the timings are recomputed from the saved alignment, at no cost.
- `--provider say` uses the macOS system voice (needs `ffmpeg`): free, for trying the steps and the marks before paying for the final voice. Its marks are approximate.
- A free ElevenLabs account cannot use voices of the Voice Library through the API (error 402), only the premade ones. `--provider web` is the way around it: the audio is made by hand on the ElevenLabs website and the generator only cuts it into steps, at no cost.
  - `--web-script` writes the text to paste there, `narration/para-elevenlabs/<class>/<lang>-<n>.txt`, in parts, with `<break time="2s" />` between steps. It never rewrites an existing script, because the audio is cut with it.
  - Generate each part with the model Eleven Multilingual v2, which honours the break tag, and save it next to its text as `<lang>-<n>.mp3`. Those files are not in Git (`.gitignore`): they stay in the history of the ElevenLabs account, to download again if a part has to be cut again.
  - The steps are split at those long pauses. A part that comes without them is split at the sentence pauses that best fit the length of each step, and the generator says so: listen to that part.
  - The website gives no time per letter, so the marks are estimated: the spoken time is shared among the letters, and each pause of the audio is anchored to the nearest punctuation mark. A mark that sits at a comma or a full stop lands on its pause; one in the middle of a phrase can be off by a few tenths of a second.
  - If the narration of a step changes after recording, the generator stops and names the step: the audio of that part has to be made again.
- Two marks are never closer than 0.6 s, so two animations do not enter at once.

## Navigation reference

- `V` turns the voice of a narrated deck on or off, `P` plays or pauses the class and `R` repeats the current step.
- Keyboard: `←` `→` / space / PageUp / PageDown to move (through the steps of a stepped slide first), Home / End to jump to first/last slide.
- `F` toggles full screen while a deck is open (Esc exits); the account menu has the same action.
- `N` toggles the notes panel (also the `notes` button in the footer).
- Browser back/forward move through the slides you visited, including across presentations.
