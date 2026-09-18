# Practice: Questions, Progress and Firebase Setup

`/learn/practice` is an endless multiple-choice practice for the students of the `/learn` courses, and `/learn/teacher` holds the teacher tools. It is unlisted (`noindex, nofollow`, never linked from the site). Questions and each student's progress both live in Firebase (Firestore + Firebase Auth, free Spark plan, no server code), so editing questions never needs a deploy.

## How it is wired

| Piece | Files | Role |
|---|---|---|
| Question model | `src/data/practice/types.ts`, `src/data/practice/index.ts` | Types, choice drawing, id numbering, class titles and `questionsInScope()` from the Learn registry |
| Question bank | `src/components/practice/questions.ts` | Firestore reads/writes of `questions/{id}`, validation, `useQuestionBank()` |
| Question editor | `src/components/practice/QuestionEditor.tsx` | Teacher-only list, form and JSON import at `/learn/teacher/questions` |
| Firebase init | `src/lib/firebase.ts` | Lazy client init from `NEXT_PUBLIC_FIREBASE_*`; `isFirebaseConfigured()` |
| Student app | `src/components/practice/PracticeApp.tsx` → `PracticeHome`, `Player` | Personal numbers and scope dropdown (`/learn/practice`), endless play (`/learn/practice/play`) |
| Persistence | `src/components/practice/progress.ts` | All Firestore reads and writes of student progress |
| Teacher board | `src/components/practice/TeacherBoard.tsx` | Every student's numbers and per-question table at `/learn/teacher/students-practice-info` |
| Teacher hub | `src/components/learn/TeacherHub.tsx` | `/learn/teacher`: links to the board and the editor, teachers only |
| Account | `src/components/learn/useAuthUser.ts`, `useTeacherStatus.ts`, `AccountMenu.tsx`, `SignIn.tsx`, `SignInGate.tsx`, `SignInRedirect.tsx` | Shared by the whole `/learn` section (see `docs/learn-courses-and-slides.md`) |
| Layout | `src/components/learn/LearnPageLayout.tsx` | Learn theme and fonts plus the section header |
| Routes | `src/pages/learn/practice/index.tsx`, `practice/play.tsx`, `teacher/index.tsx`, `teacher/students-practice-info.tsx`, `teacher/questions.tsx` | All load their app with `next/dynamic` and `ssr: false` |
| Rules | `firebase/firestore.rules` | Source of truth for the Firestore security rules |
| Texts | `src/i18n/pages/practice.ts` | UI strings in both languages |

The practice **scope** lives in the query string: `/learn/practice` is every course, `?course=<slug>` one course and `?course=<slug>&class=<slug>` one class. The dropdown (`PracticeScopeSelect`) changes it, on the practice home with question counts and in the header while playing, so a student can switch class without going back; the menus and the class header link to it, and **Play** is a link to `/learn/practice/play` with the same query, so the browser's back button returns from playing to the numbers. The whole bank is loaded once and filtered in the browser (`questionsInScope`): at this size the reads are free and the dropdown gets its counts without extra queries.

A page that needs an account never shows the form inline: it renders `SignInRedirect`, which sends a guest to `/learn/sign-in?next=<this page>`, the same URL the header's Sign in link uses, and signing in returns them.

Play is endless: the questions in scope are shuffled into a cycle so a student sees every question once before any repeats, then it reshuffles. Every display of a question draws **one random correct answer and three random wrong ones** from its pools and shuffles them, so the same question looks different each time. A *session* is a visit with at least one answer. Every answer is saved as it happens.

## Question model

```
id            permanent, never reused or renumbered (e.g. 'wu-wo-014')
topic         class slug from src/data/learn.ts (optional)
prompt        { es, en }
correct       [{ es, en }, …]   at least 1; one is shown per display
incorrect     [{ es, en }, …]   at least 3; three are shown per display
explanation   { es, en }        optional, shown after answering
retired       boolean           kept so old stats still resolve, never asked
```

Rules of thumb:

- Ids are how stats are keyed. A new question gets the next number for its class automatically: `wu-wo-` for `wwise-unreal` / `wwise-objects`, from the initials of the course and class slugs; `q-` when it has no class. The first questions predate the class part (`wu-001`…) and keep their ids. The prefix is only a label: a question moved to another class keeps its id. Never reuse an id.
- Do not delete questions: **retire** them. Deleting one leaves its stats showing as "Question no longer in the bank".
- `es` is the source language, like the presentations. Product names stay in English.
- The more wrong answers a question has, the more different it looks each time. Add many.
- With several correct answers, write the explanation so it covers all of them.

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

teachers/{uid}                                       created by hand; any field
```

Each answer is one batched write touching the student doc, the question doc and the session doc. Any signed-in user can read the question bank; only teachers can write it. A student can only read and write their own subtree; an account whose uid exists in `teachers` can read every student.

## Firebase console setup (once)

1. Create a project at console.firebase.google.com. Analytics can stay off.
2. Project settings → Your apps → add a Web app. Copy the config into `.env.local` (git-ignored, one `KEY=value` per line) and into the Vercel project's environment variables:
   `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`. Restart the dev server after editing `.env.local`.
3. Build → Authentication → Sign-in method: enable **Google** and **Email/Password**. Settings → Authorized domains: add `diablohumastudio.com` (and the `*.vercel.app` preview domain if you test previews). `localhost` is already there.
4. Build → Firestore Database → Create database, production mode, nearest region.
5. Firestore → Rules: paste the contents of `firebase/firestore.rules` and publish. Do the same whenever that file changes.
6. Make yourself a teacher: sign in once at `/learn/practice`, copy your UID from Authentication → Users, then in Firestore create the document `teachers/<your uid>` with any field (e.g. `role: "teacher"`). `/learn/teacher` and its pages now work for that account, which also gets the Teacher links in the header and the menus; everyone else sees "not registered as a teacher".
7. Load the first questions: open `/learn/teacher/questions`, click **Import JSON** and paste an array in the format above.

The web config values are not secrets: Firebase expects them in the browser, and the rules are what protect the data.

## Verifying changes

- `npx tsc --noEmit` for any edit; `npm run build` when routes or dependencies change.
- Open `http://localhost:3000/learn/practice` and `http://localhost:3000/es/learn/practice` for the student flow, `http://localhost:3000/learn/teacher/students-practice-info` for the board and `http://localhost:3000/learn/teacher/questions` for the editor (once with a teacher account, once with a student account, which must be denied).
- Without `.env.local` the pages render a "Firebase is not configured" notice instead of the app.
