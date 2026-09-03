# INCINE: Adding Courses, Classes and Slides

The `/incine` section serves class presentations. It is unlisted (`noindex, nofollow`, never linked from the site) and reachable only by direct URL.

## How it is wired

| Piece | Files | Role |
|---|---|---|
| Registry | `src/data/incine.ts` | Single source of truth: courses → classes → presentation component |
| Presentations | `src/presentations/<course-slug>/<class-slug>.tsx` | One React component per class, built with `Deck`/`Slide` |
| Deck engine | `src/components/incine/Deck.tsx` + `Deck.module.css` | Slide state, keyboard navigation, playhead/counter, `?s=` URL sync |
| Section layout | `src/components/incine/IncineLayout.tsx` | Header with course/class dropdowns and the fullscreen button |
| Routes | `src/pages/incine/index.tsx` and `src/pages/incine/[curso]/[clase].tsx` | `/incine` redirects to the latest class; the dynamic route renders the selected one |

URLs look like `/incine/<course-slug>/<class-slug>` (e.g. `/incine/wwise-unreal/wwise-inside-out`). The current slide is kept in the `?s=<n>` query param, so browser back/forward walk through visited slides and a link can point to an exact slide.

## Adding a class (presentation) to an existing course

1. Create `src/presentations/<course-slug>/<class-slug>.tsx`:

```tsx
import Deck, { Slide } from '../../components/incine/Deck';
import s from '../../components/incine/Deck.module.css';

export default function MyNewClass() {
  return (
    <Deck name="Class title" context="Optional · context · shown in the footer">
      <Slide z="1" label="intro">
        <div className={s.eyebrow}>Small amber kicker</div>
        <h2>Slide title</h2>
        <p className={s.lede}>Main paragraph.</p>
      </Slide>
      {/* more <Slide>s */}
    </Deck>
  );
}
```

2. Register it in `src/data/incine.ts`, appending to the course's `classes` array:

```ts
{
  slug: 'my-new-class',
  title: 'My New Class',
  component: dynamic(() => import('../presentations/wwise-unreal/my-new-class')),
},
```

That is all — the class dropdown and the route are generated from the registry.

Notes:

- Slugs are kebab-case and become the URL segment; the file name must match the slug.
- **Append new classes at the end of the array**: `/incine` redirects to the *last* class of the first course, which is treated as the most recent one.

## Adding a course

1. Create the folder `src/presentations/<course-slug>/`.
2. Add an entry to `INCINE_COURSES` in `src/data/incine.ts` with `slug`, `title` and a `classes` array (at least one class).

The course dropdown is generated from `INCINE_COURSES`; switching course navigates to that course's latest class.

## Writing slides

`Slide` props:

- `z` — the big amber character in the left rail (a zoom level, number or symbol).
- `label` — the small vertical text in the rail, also shown uppercase in the footer.
- `backgroundImage` (optional) — URL of a full-bleed background image for the slide, automatically darkened with a gradient so text stays readable (used for cover slides). Put slide images under `public/assets/presentations/<course-slug>/` and reference them as `/assets/presentations/<course-slug>/<file>`.

Content goes inside `Slide` as JSX. Plain `h1`, `h2`, `strong`, `code`, `figure`/`figcaption` and `svg text` are already styled by `Deck.module.css`; for the rest import the module (`import s from '../../components/incine/Deck.module.css'`):

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

Gotchas:

- JSX collapses whitespace and newlines in text, so multi-line `<pre>` content must use string expressions such as `{'\nline two'}`. See `src/presentations/wwise-unreal/wwise-inside-out.tsx` for working examples.
- Inline SVGs use JSX attribute names (`strokeWidth`, `strokeOpacity`, `textAnchor`, `fontSize`, `fontWeight`, `letterSpacing`, `markerEnd`, `strokeDasharray`…).
- Do not set `font-family` on SVG text — the stylesheet handles it (mono by default, `s.svgSans` for body font).
- Use theme tokens (`var(--amber)`, `var(--panel)`, `var(--line)`…) from `src/components/incine/theme.module.css` in any new module CSS instead of hard-coding hex values. Inside SVG attributes, hex values matching the theme are fine (that is what the existing slides do).

## Navigation reference

- Keyboard: `←` `→` / space / PageUp / PageDown to move, Home / End to jump to first/last slide.
- The header's ⛶ button toggles fullscreen (Esc exits).
- Browser back/forward move through the slides you visited, including across presentations.
