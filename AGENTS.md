# diablohumastudio-learn — Project Instructions

Teaching platform of DiabloHumaStudio, served at `learn.diablohumastudio.com`: class presentations, daily practice, specific homeworks and server-graded exams. Next.js 14 (Pages Router) + TypeScript, plain CSS (CSS Modules), Firebase (Firestore + Auth) for data. The marketing site is a separate repo (`diablohumastudio-site-nextjs`); it only redirects its old `/learn/...` links here.

## Commands

- `npm run dev` — dev server
- `npm run build` — production build + type check
- `npm run start` — serve the production build

## Routes

| URL | Page |
|---|---|
| `/` | redirects to `/courses` |
| `/courses` | course menu |
| `/course/<course>` | class menu of a course, homework cards |
| `/course/<course>/class/<class>` | slide deck (`?s=<n>` slide, `&p=<n>` step) |
| `/course/<course>/exams`, `/course/<course>/exams/<id>` | exam list of a course, exam room |
| `/practice/play?course=<slug>[&class=<slug>]` | timed practice |
| `/sign-in`, `/teacher/*` | account, teacher tools |

Every route is built from the constants and helpers in `src/data/learn.ts` (`COURSES_PATH`, `coursePath`, `classPath`, `examPath`…). Never write a route literal in a component.

## Verifying changes

- **A dev server may already be running on port 3000.** Never kill a process on a port you did not start, and never run a server on 3000. If you need to serve the site yourself, use port 3005 (`npx next dev -p 3005`) and stop only that process when you are done.
- **`npx tsc --noEmit` is the default check** (~4s): it catches type and JSX errors and does not touch `.next/`.
- **`npm run build` writes to `.next/`, which a running dev server shares**, so it can disrupt it. There is no test suite, so the build is still the only full check (types + lint + every route compiling): run it for route, config or dependency changes and before pushing — not for editing the contents of a slide.
- Anything visual (layout, spacing, whether a slide reads well) is verified by opening the page, not from the terminal. Say which URL to open.

## Commits

- Never commit unless explicitly asked. One commit per change item (split multiple items into multiple commits).
- Header: `<type>(<scope>): <summary>`
  - type: feat | fix | refactor | test | docs | chore
  - scope: capitalized area (e.g. Learn, Slides, Practice, Exam, Teacher, Deps, Config)
  - summary: imperative, no trailing period
- Body: for non-trivial changes, a short prose paragraph (wrapped ~76 columns) explaining what was done and why.
- End the message with the `Co-Authored-By: Claude ...` trailer.

## Deploying

- The site auto-deploys from `main` on Vercel (project `diablohumastudio-learn`), but `vercel.json` skips the build unless the pushed commit's message contains `[deploy]`. Deployments are per push, so the marker goes on the last commit of the batch (e.g. `feat(Slides): ... [deploy]`). Pushes without it cost nothing on Vercel.
- The Firebase keys live in the Vercel project's environment variables and in the git-ignored `.env.local` (see [docs/practice.md](docs/practice.md) and [docs/exam.md](docs/exam.md)). `firebase/firestore.rules` is published by pasting it into the Firebase console.

## Importing questions

- Before preparing or importing a question file, remind the user of the open item in [TODO.md](TODO.md) about answer ids ("Importador: conservar los ids de las respuestas al reemplazar"): replacing a question from a file without answer ids gives its answers new ids, which breaks the link with exam attempts already saved. Drop this note once that item is ticked.

## Required reading

- [docs/css-and-nextjs-conventions.md](docs/css-and-nextjs-conventions.md) — CSS and Next.js conventions. Read before adding any page, component or styles. Key rule: never add styles to `src/styles/globals.css`; use CSS Modules.
- [docs/learn-courses-and-slides.md](docs/learn-courses-and-slides.md) — how to add courses, classes and slides. The per-course style rules are in `src/presentations/<course>/reglas-de-estilo.md`.
- [docs/practice.md](docs/practice.md) — practice, daily and specific homeworks, the question bank and the teacher tools; Firebase setup.
- [docs/exam.md](docs/exam.md) — timed, server-graded exams at `/course/<course>/exams/<id>`: API routes, data model, rules and setup. Read before touching exams, the question bank's answer ids or `firebase/firestore.rules`. Key rule: the correct option never reaches a student's browser; opening, drawing, receiving answers and grading stay on the server.
- [docs/i18n-handoff.md](docs/i18n-handoff.md) — the i18n decisions (written when the platform was `/learn` of the marketing site).
