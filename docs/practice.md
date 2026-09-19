# Practice: Questions, Homework and Firebase Setup

`/learn/practice/play` is an endless, timed multiple-choice practice for the students of the `/learn` courses, counted as daily homework, and `/learn/teacher` holds the teacher tools. It is unlisted (`noindex, nofollow`, never linked from the site). Questions and each student's progress both live in Firebase (Firestore + Firebase Auth, free Spark plan, no server code), so editing questions never needs a deploy.

## How it is wired

| Piece | Files | Role |
|---|---|---|
| Question model | `src/data/practice/types.ts`, `src/data/practice/index.ts` | Types, choice drawing, id numbering, class titles and `questionsInScope()` from the Learn registry |
| Homework model | `src/data/practice/homework.ts` | The goals (`DAILY_QUESTIONS_GOAL`, `RUN_LENGTH`, `RUN_CORRECT_GOAL`), day keys, the run and `isDayDone()` |
| Question bank | `src/components/practice/questions.ts` | Firestore reads/writes of `questions/{id}`, validation, `useQuestionBank()` |
| Question editor | `src/components/practice/QuestionEditor.tsx` | Teacher-only list, form and JSON import at `/learn/teacher/questions` |
| Firebase init | `src/lib/firebase.ts` | Lazy client init from `NEXT_PUBLIC_FIREBASE_*`; `isFirebaseConfigured()` |
| Student app | `src/components/practice/PracticeApp.tsx` → `Player`, `HomeworkMeter`, `PlayScopeSelect` | Endless timed play (`/learn/practice/play`) with the day's homework under the card |
| Course page | `src/components/practice/CourseProgressContext.tsx`, `CourseProgressLoader.tsx`, `CourseProgress.tsx`, `ClassPracticeLink.tsx` | Homework card and per-class answer counts on `/learn/<course>`; the loader is the only part that downloads Firebase |
| Settings | `src/components/practice/practiceSettings.ts`, `src/components/learn/ConfigDialog.tsx` | Time per question, per device in `localStorage` |
| Persistence | `src/components/practice/progress.ts` | All Firestore reads and writes of student progress |
| Teacher board | `src/components/practice/TeacherBoard.tsx`, `HomeworkGrid.tsx` | Homework grid, every student's numbers and per-question table at `/learn/teacher/students-practice-info` |
| Teacher hub | `src/components/learn/TeacherHub.tsx` | `/learn/teacher`: links to the board and the editor, teachers only |
| Account | `src/components/learn/useAuthUser.ts`, `useTeacherStatus.ts`, `AccountMenu.tsx`, `SignIn.tsx`, `SignInGate.tsx`, `SignInRedirect.tsx` | Shared by the whole `/learn` section (see `docs/learn-courses-and-slides.md`) |
| Layout | `src/components/learn/LearnPageLayout.tsx` | Learn theme and fonts plus the section header |
| Routes | `src/pages/learn/practice/play.tsx`, `teacher/index.tsx`, `teacher/students-practice-info.tsx`, `teacher/questions.tsx` | All load their app with `next/dynamic` and `ssr: false` |
| Rules | `firebase/firestore.rules` | Source of truth for the Firestore security rules |
| Texts | `src/i18n/pages/practice.ts` | UI strings in both languages |

Practice never mixes courses and has no home of its own: it starts from the course page (`/learn/<course>`), whose homework card practices the whole course and whose class rows each carry a practice button. The **scope** lives in the query string of the play page: `?course=<slug>` is one course and `?course=<slug>&class=<slug>` one class. Without a known course the page goes back to `/learn`, and `/learn/practice` itself redirects there (`next.config.js`). While playing, the header dropdown (`PlayScopeSelect`) switches between the classes of that course; **Stop** is a link back to the course page. The whole bank is loaded once and filtered in the browser (`questionsInScope`): at this size the reads are free.

A page that needs an account never shows the form inline: it renders `SignInRedirect`, which sends a guest to `/learn/sign-in?next=<this page>`, the same URL the header's Sign in link uses, and signing in returns them.

Play is endless: the questions in scope are shuffled into a cycle so a student sees every question once before any repeats, then it reshuffles. Every display of a question draws **one random correct answer and three random wrong ones** from its pools and shuffles them, so the same question looks different each time. A *session* is a visit with at least one answer. Every answer is saved as it happens.

Every question has a **timer**: 45 seconds by default, which each student changes in the account menu → Config, between 2 and 120 seconds (`practiceSettings.ts`). When it runs out the correct answer is revealed and the question is saved as a **wrong answer** (`TIMEOUT_COUNTS_AS_ANSWER`): ignoring it would let a student skip every question they do not know and keep a clean run. The player never advances by itself, so an abandoned tab costs one wrong answer, not one per timer.

## Homework

Homework is counted **per course and per local day** with two numbers, and a day is done when both are met (`isDayDone`):

- **Questions answered**: at least `DAILY_QUESTIONS_GOAL` (30) in the course, whatever classes they came from.
- **Best run**: at least `RUN_CORRECT_GOAL` (7) right within `RUN_LENGTH` (10) questions in a row. The player keeps the results of the last 10 answers of the session (the pips under the card); each time their count of right answers beats the day's record, the record is rewritten. The run starts empty with every session.

The pair is what makes the count honest: clicking at random reaches 30 answers but gets 7 of 10 right about once in 300 tries.

Students see both numbers live under the question while playing ("Today" and the pips of the "Last 10"). On the course page the homework card has two sections split by a line: **Today** (Total and Best 10) and **This week**, the calendar week from Monday to Sunday with a mark per day (filled = done, amber ring = started, dashed = still to come), the days done and the questions answered in the week. The card also holds the course's two buttons, **Practice this course** and **Exams**. Each class row's practice button shows `✓ correct / answered`: every answer the student gave to the questions of that class and how many were right, retired questions included. The teacher board shows a grid of student × day for a course and a date range, each cell `answered · best run`, plus the days done in the range; how that turns into a grade is up to the teacher.

Days use the student's local date, read when the answer is given. Like all progress, the numbers are written by the student's browser, so a student who knows Firestore could forge them; that is accepted for homework (exams are graded by the server, see `docs/exam.md`).

## Question model

```
id            permanent, never reused or renumbered (e.g. 'wu-wo-014')
topic         class slug from src/data/learn.ts (optional)
prompt        { es, en }
correct       [{ id?, es, en }, …]   at least 1; one is shown per display
incorrect     [{ id?, es, en }, …]   at least 3; three are shown per display
explanation   { es, en }        optional, shown after answering
retired       boolean           kept so old stats still resolve, never asked
```

Rules of thumb:

- Ids are how stats are keyed. A new question gets the next number for its class automatically: `wu-wo-` for `wwise-unreal` / `wwise-objects`, from the initials of the course and class slugs; `q-` when it has no class. The first questions predate the class part (`wu-001`…) and keep their ids. The prefix is only a label: a question moved to another class keeps its id. Never reuse an id.
- Do not delete questions: **retire** them. Deleting one leaves its stats showing as "Question no longer in the bank".
- `es` is the source language, like the presentations. Product names stay in English.
- The more wrong answers a question has, the more different it looks each time. Add many.
- With several correct answers, write the explanation so it covers all of them.
- Every answer carries an opaque `id`, which is what an exam attempt records as the option a student picked (`docs/exam.md`). The editor assigns it on save and keeps it when the text changes; practice ignores it.

## Editing questions

Open `/learn/teacher/questions` with a teacher account (see setup step 6). The list shows every question; click one to edit it or use **New question**. The form enforces both languages, at least one correct and three wrong answers, and assigns the id on save.

**Import JSON** takes an array of questions in the model above, each with its own `id`; an existing id is replaced, which is also how you fix many questions at once. Example:

```json
[
  {
    "id": "wu-eew-014",
    "topic": "el-editor-wwise",
    "prompt": { "es": "¿…?", "en": "…?" },
    "correct": [{ "es": "Correcta", "en": "Correct" }],
    "incorrect": [
      { "es": "Otra", "en": "Other" },
      { "es": "Otra más", "en": "Another" },
      { "es": "Y otra", "en": "And another" }
    ],
    "explanation": { "es": "Por qué.", "en": "Why." },
    "retired": false
  }
]
```

Malformed documents in Firestore are skipped with a console warning rather than breaking the practice.

## Firestore data model

```
questions/{questionId}
  topic?, prompt, correct[], incorrect[], explanation?, retired, updatedAt

students/{uid}
  displayName, email, createdAt, lastPlayedAt
  sessionsPlayed, totalAnswered, totalCorrect        counters, updated with increment()

students/{uid}/questions/{questionId}
  attempts, correct, lastCorrect, lastAnsweredAt

students/{uid}/sessions/{sessionId}
  startedAt, lastAnswerAt, answered, correct         written with the first answer of a visit

students/{uid}/days/{courseSlug}_{YYYY-MM-DD}
  courseSlug, day, answered, correct, bestRun, updatedAt   homework of one course on one local day

teachers/{uid}                                       created by hand; any field
```

Each answer is one batched write touching the student doc, the question doc, the session doc and the day doc. Firestore has no `max()` transform, so `bestRun` is written by the player only when the run beats the record it read from the day doc. Any signed-in user can read the question bank, except while an exam is running, when practice is paused for every non-teacher (`docs/exam.md`); only teachers can write it. A student can only read and write their own subtree; an account whose uid exists in `teachers` can read every student.

## Firebase console setup (once)

1. Create a project at console.firebase.google.com. Analytics can stay off.
2. Project settings → Your apps → add a Web app. Copy the config into `.env.local` (git-ignored, one `KEY=value` per line) and into the Vercel project's environment variables:
   `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`. Restart the dev server after editing `.env.local`.
3. Build → Authentication → Sign-in method: enable **Google** and **Email/Password**. Settings → Authorized domains: add `diablohumastudio.com` (and the `*.vercel.app` preview domain if you test previews). `localhost` is already there.
4. Build → Firestore Database → Create database, production mode, nearest region.
5. Firestore → Rules: paste the contents of `firebase/firestore.rules` and publish. Do the same whenever that file changes.
6. Make yourself a teacher: sign in once at `/learn/sign-in`, copy your UID from Authentication → Users, then in Firestore create the document `teachers/<your uid>` with any field (e.g. `role: "teacher"`). `/learn/teacher` and its pages now work for that account, which also gets the Teacher links in the header and the menus; everyone else sees "not registered as a teacher".
7. Load the first questions: open `/learn/teacher/questions`, click **Import JSON** and paste an array in the format above.

The web config values are not secrets: Firebase expects them in the browser, and the rules are what protect the data.

## Verifying changes

- `npx tsc --noEmit` for any edit; `npm run build` when routes or dependencies change.
- Open `http://localhost:3000/learn/wwise-unreal` (homework card, class rows) and `http://localhost:3000/learn/practice/play?course=wwise-unreal` (timer, pips), also under `/es`, for the student flow, `http://localhost:3000/learn/teacher/students-practice-info` for the board and `http://localhost:3000/learn/teacher/questions` for the editor (once with a teacher account, once with a student account, which must be denied).
- Without `.env.local` the pages render a "Firebase is not configured" notice instead of the app.
