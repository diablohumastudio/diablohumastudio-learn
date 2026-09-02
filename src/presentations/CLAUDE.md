# Presentations — Instructions

Each class presentation is one React component built with `Deck` / `Slide`, registered in `src/data/incine.ts` and served under `/incine`. The mechanics (how to add a course, a class or a slide, which CSS classes exist, the `Slide` props) are in [docs/incine-courses-and-slides.md](../../docs/incine-courses-and-slides.md).

## Per-course style rules

Style is **per course, not global**. Each course folder has a single file named `reglas-de-estilo.md` (e.g. `wwise-unreal/reglas-de-estilo.md`) — read it before writing or editing any deck in that course, and follow it over any general instinct about how slides should look. When one presentation needs to deviate, its overrides go in that same file, in a per-presentation section at the end — never in a separate file.

When a course has no such file and its slides need a consistent look, propose creating one rather than inventing conventions per slide.

## Checking a slide change

Slides are content, not behavior. After a typecheck passes, the way to judge them is to **look at the page** — layout, spacing and whether a diagram reads well cannot be verified from a terminal. Say which URL to open (including `?s=<n>` for a specific slide) and let the review happen there.

Do not write scripted output checks for slide content; they add noise without catching what actually matters.
