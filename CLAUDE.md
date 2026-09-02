# diablohumastudio-site-nextjs — Project Instructions

Marketing and teaching site for DiabloHumaStudio. Next.js 14 (Pages Router) + TypeScript, plain CSS (no framework).

## Commands

- `npm run dev` — dev server
- `npm run build` — production build + type check
- `npm run start` — serve the production build

## Commits

- Never commit unless explicitly asked. One commit per change item (split multiple items into multiple commits).
- Header: `<type>(<scope>): <summary>`
  - type: feat | fix | refactor | test | docs | chore
  - scope: capitalized site area (e.g. Portfolio, Videos, Courses, NvC, Incine, Layout, Deps)
  - summary: imperative, no trailing period
- Body: for non-trivial changes, a short prose paragraph (wrapped ~76 columns) explaining what was done and why.
- End the message with the `Co-Authored-By: Claude ...` trailer.

## Required reading

- [docs/css-and-nextjs-conventions.md](docs/css-and-nextjs-conventions.md) — CSS and Next.js conventions. Read before adding any page, component or styles. Key rule: never add styles to `src/styles/globals.css`; use CSS Modules.
- [docs/incine-courses-and-slides.md](docs/incine-courses-and-slides.md) — how to add courses, classes and slides to the unlisted `/incine` presentations section.
