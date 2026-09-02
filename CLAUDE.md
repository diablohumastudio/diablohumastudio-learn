# diablohumastudio-site-nextjs — Project Instructions

Marketing and teaching site for DiabloHumaStudio. Next.js 14 (Pages Router) + TypeScript, plain CSS (no framework).

## Commands

- `npm run dev` — dev server
- `npm run build` — production build + type check
- `npm run start` — serve the production build

## Verifying changes

- **A dev server is usually already running on port 3000.** Never kill a process on a port you did not start, and never run a server on 3000. If you need to serve the site yourself, use port 3005 (`npx next dev -p 3005`) and stop only that process when you are done.
- **`npx tsc --noEmit` is the default check** (~4s): it catches type and JSX errors and does not touch `.next/`.
- **`npm run build` writes to `.next/`, which the running dev server shares**, so it can disrupt it. There is no test suite, so the build is still the only full check (types + lint + every route compiling): run it for route, config or dependency changes and before pushing — not for editing the contents of a page.
- Anything visual (layout, spacing, whether a design reads well) is verified by opening the page, not from the terminal. Say which URL to open.

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
