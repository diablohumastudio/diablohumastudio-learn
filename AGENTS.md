# diablohumastudio-learn — Project Instructions

Teaching platform of DiabloHumaStudio, served at `learn.diablohumastudio.com`: class presentations, daily practice, specific homeworks, server-graded exams and deliverables (homeworks and exams handed in as text or links), for the students enrolled in each course. Next.js 14 (Pages Router) + TypeScript, plain CSS (CSS Modules), Firebase (Firestore + Auth) for data. The marketing site is a separate repo (`diablohumastudio-site-nextjs`); it only redirects its old `/learn/...` links here.

## Commands

- `npm run dev` — dev server
- `npm run build` — production build + type check
- `npm run start` — serve the production build

## Routes

| URL | Page |
|---|---|
| `/` | redirects to `/courses` |
| `/courses` | course menu |
| `/course/<course>` | class menu of a course; four cards closed to their title: Daily practice, Homeworks and Exams (what is open right now) and Class presentations with the class rows; for a student who is not enrolled, the card to request access |
| `/course/<course>/class/<class>` | slide deck (`?s=<n>` slide, `&p=<n>` step) |
| `/course/<course>/exams`, `/course/<course>/exams/<id>` | exam list of a course, exam room |
| `/course/<course>/homeworks`, `/course/<course>/homeworks/<id>` | the homeworks of the signed-in student in the course as rows, like the exams list: the specific ones with their days, then the deliverable ones; one specific homework with its meter, its days and the Practice button |
| `/course/<course>/history` | the signed-in student's own history in the course, in five sections: daily practice, multiple option exams, multiple option specific homeworks, deliverable exams, deliverable homeworks |
| `/course/<course>/deliverable/<id>` | where a student hands a deliverable in: text written on the platform, or a link |
| `/practice/play?course=<slug>[&class=<slug>]` | timed practice |
| `/sign-in`, `/teacher/*` | account, teacher tools |
| `/teacher/exam`, `/teacher/exam/<id>`, `/teacher/exam/<id>/<uid>` | exam list (multiple option and deliverable exams, each with its New button); one exam by id (`new` for a draft not saved yet); the replay of one student's attempt |
| `/teacher/homeworks`, `/teacher/homeworks/<id>` | homework list (multiple option and deliverable homeworks, each with its New button); one homework by id (`new` for one not saved yet) |
| `/teacher/deliverable/<id>`, `/teacher/deliverable/<id>/<uid>` | one deliverable by id (`new?role=homework` or `new?role=exam` for one not saved yet; no list here); one student's submission with its review |
| `/teacher/student`, `/teacher/student/<uid>` | list of students to review (the enrolled ones); one student's page, the same five sections as the student's history |
| `/teacher/enrollment` | who is enrolled in each course, who is asking for access; enroll, remove, enroll all registered accounts |

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
- [docs/deliverables.md](docs/deliverables.md) — deliverables: homeworks and exams handed in as text written on the platform (no pasting, typing signals recorded) or as a link to a repository or a document; roles, kinds, data model, rules, the export and import scripts for grading on demand. Read before touching the homework or exam lists, the student history, the review page or `firebase/firestore.rules`.
- [docs/data-model.md](docs/data-model.md) — the map of every table: the Firestore collections and subcollections, Firebase Auth and the course registry in code, with keys, fields, who writes and reads each one, and every field that points at another table. Read before adding a collection or a field, or when asking what a document's reference means.
- [docs/courses.md](docs/courses.md) — course membership: enrollment, access requests, the Enrollment page, what the membership gates and why every student query names its course. Read before adding anything a student reads per course or touching `firebase/firestore.rules`.
- [docs/i18n-handoff.md](docs/i18n-handoff.md) — the i18n decisions (written when the platform was `/learn` of the marketing site).
