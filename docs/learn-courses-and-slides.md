# Learn: Adding Courses, Classes and Slides

The `/learn` section serves class presentations. It is unlisted (`noindex, nofollow`, never linked from the site) and reachable only by direct URL.

## How it is wired

| Piece | Files | Role |
|---|---|---|
| Registry | `src/data/learn.ts` | Single source of truth: courses → classes → presentation component |
| Presentations | `src/presentations/<course-slug>/<class-slug>.tsx` | One React component per class, built with `Deck`/`Slide` |
| Deck engine | `src/components/learn/Deck.tsx` + `Deck.module.css` | Slide state, keyboard navigation, playhead/counter, `?s=` URL sync |
| Section layout | `src/components/learn/LearnLayout.tsx` | Header with course/class dropdowns and the fullscreen button |
| Routes | `src/pages/learn/index.tsx`, `src/pages/learn/[curso]/index.tsx` and `src/pages/learn/[curso]/[clase].tsx` | `/learn` redirects to the latest class; `/learn/<course-slug>` redirects to the course's first class (slide 1); the dynamic route renders the selected one |

URLs look like `/learn/<course-slug>/<class-slug>` (e.g. `/learn/wwise-unreal/el-editor-wwise`). The current slide is kept in the `?s=<n>` query param (and the current step of a stepped slide in `&p=<n>`), so browser back/forward walk through visited slides and steps, and a link can point to an exact slide or step.

The `/learn` prefix lives in one place, `LEARN_BASE_PATH` in the registry, and every internal route is built with `classPath(course, class)`. To move the section (another path, or later a subdomain via a host-conditioned rewrite), change the constant and rename `src/pages/learn/`. Links already shared under the old `/incine` prefix are kept alive by a permanent redirect in `next.config.js`.

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
},
```

That is all — the class dropdown and the route are generated from the registry.

Notes:

- Slugs are kebab-case and become the URL segment; the file name must match the slug.
- **Append new classes at the end of the array**: `/learn` redirects to the *last* class of the first course, which is treated as the most recent one. The array order is also the teaching order: `←` on a class's first slide and `→` on its last slide step into the neighbouring class.
- Optional `section: 'Intro'` groups the class with its neighbours: consecutive classes sharing a `section` become an `<optgroup>` in the class dropdown, and the section name is shown at the top of every slide's left rail. Classes without a section render as today. Keep sectioned classes contiguous in the array — the grouping is by adjacency, so a gap starts a second group with the same name.

## Adding a course

1. Create the folder `src/presentations/<course-slug>/`.
2. Add an entry to `LEARN_COURSES` in `src/data/learn.ts` with `slug`, `title` and a `classes` array (at least one class).

The course dropdown is generated from `LEARN_COURSES`; switching course navigates to that course's latest class.

## Writing slides

`Slide` props:

- `z` — the big amber character in the left rail (a zoom level, number or symbol).
- `label` — the small vertical text in the rail, also shown uppercase in the footer. An array of labels makes a **stepped slide** (see below), one step per label.
- `backgroundImage` (optional) — URL of a full-bleed background image for the slide, automatically darkened with a gradient so text stays readable (used for cover slides). Put slide images under `public/assets/presentations/<course-slug>/` and reference them as `/assets/presentations/<course-slug>/<file>`.

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
| `s.morphOut` / `s.morphIn` / `s.morphGlide` / `s.morphPulse` | On SVG `<g>` wrappers, replay a transition from the previous slide's diagram when the slide mounts (draw the final state; stagger steps with inline `animation-delay`; `morphGlide` reads its start `transform` from `--morph-from`; `morphPulse` scales briefly for emphasis) |

Stepped slides (one slide built up in several steps, like fragments in other slide tools):

- Pass `label` as an array: `<Slide z="6" label={[t.labels.arranque, t.labels.pide, t.labels.busca]}>`. `→` walks the steps before leaving the slide and `←` walks them back (coming from the next slide lands on the last step). The rail and footer show the current step's label, and the counter reads e.g. `09 / 09 · 2/3`.
- Content reads the current step (0-based) with `useSlideStep()` from `Deck`, inside a component rendered within the `Slide`: `const step = useSlideStep();` then draw the state for that step.
- The slide stays mounted between steps, so only the elements a step adds are mounted: put `s.morphIn` (or the other morph classes) on the group the new step adds, and it animates once when the step is reached. Elements from earlier steps stay static. Opening a step directly (`?s=9&p=3`) draws the final state and animates only the last piece.
- Prefer a stepped slide over a run of `z="="` slides whenever the steps share the same title and diagram; `=` slides remain for a diagram that morphs into a different idea.

Texts and languages:

- Every visible text of a deck lives in its `.dict.tsx`: `h1`/`h2` (as JSX, with the amber `span`), eyebrows, `figcaption`, the SVG `aria-label`, every `<text>`, the `Slide` labels and the `Deck` name and context. The SVG `<text>` nodes are JSX, so `{t.key}` goes inside them like anywhere else. Functions that draw labels (the `Rotulos*` pattern) receive their texts object as a prop; geometry helpers take no texts.
- Keep the two languages about the same length (±15 % characters) so labels stay inside their boxes; absorb a difference with `textAnchor` (`middle`/`end`) before moving coordinates. When a phrase must change length by more, check the slide in both `/learn/...` and `/es/learn/...`.
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

## Navigation reference

- Keyboard: `←` `→` / space / PageUp / PageDown to move (through the steps of a stepped slide first), Home / End to jump to first/last slide.
- The header's ⛶ button toggles fullscreen (Esc exits).
- Browser back/forward move through the slides you visited, including across presentations.
