# Quiz: Questions, Progress and Firebase Setup

`/learn/quiz` is an endless multiple-choice quiz for the students of the `/learn` courses. It is unlisted (`noindex, nofollow`, never linked from the site). Questions live in the repo; each student's progress lives in Firebase (Firestore + Firebase Auth, free Spark plan, no server code).

## How it is wired

| Piece | Files | Role |
|---|---|---|
| Question bank | `src/data/quiz/<course-slug>.ts`, concatenated in `src/data/quiz/index.ts` | Bilingual questions with permanent ids |
| Firebase init | `src/lib/firebase.ts` | Lazy client init from `NEXT_PUBLIC_FIREBASE_*`; `isFirebaseConfigured()` |
| Student app | `src/components/quiz/QuizApp.tsx` → `SignIn`, `QuizHome`, `Player` | Sign-in, personal numbers, endless play |
| Persistence | `src/components/quiz/progress.ts` | All Firestore reads and writes |
| Teacher board | `src/components/quiz/TeacherBoard.tsx` | Every student's numbers and per-question table |
| Layout | `src/components/quiz/QuizLayout.tsx` | Learn theme and fonts, language switch, user menu |
| Routes | `src/pages/learn/quiz/index.tsx`, `src/pages/learn/quiz/teacher.tsx` | Both load their app with `next/dynamic` and `ssr: false` |
| Rules | `firebase/firestore.rules` | Source of truth for the Firestore security rules |
| Texts | `src/i18n/pages/quiz.ts` | UI strings in both languages |

Play is endless: the bank is shuffled into a cycle so a student sees every question once before any repeats, then it reshuffles. A *session* is a visit with at least one answer. Every answer is saved as it happens.

## Adding questions

Append to the course file (e.g. `src/data/quiz/wwise-unreal.ts`):

```ts
{
  id: 'wu-014',                                  // permanent, never reused or renumbered
  topic: 'el-editor-wwise',                      // class slug from src/data/learn.ts (optional)
  prompt: { es: '¿…?', en: '…?' },
  choices: [                                     // 2 to 5
    { es: 'Correcta', en: 'Correct' },
    { es: 'Otra', en: 'Other' },
  ],
  correctIndex: 0,                               // index into `choices` before shuffling
  explanation: { es: 'Por qué.', en: 'Why.' },   // optional, shown after answering
},
```

Rules of thumb:

- Ids are how stats are keyed. Changing an id orphans every student's history for that question; deleting a question keeps its stats, which the teacher board shows as "Question no longer in the bank".
- `es` is the source language, like the presentations. Product names stay in English.
- Choices are shuffled per display, so it does not matter where the correct one sits.
- A new course gets its own file and is spread into `QUIZ_QUESTIONS` in `src/data/quiz/index.ts`.

## Firestore data model

```
students/{uid}
  displayName, email, createdAt, lastPlayedAt
  sessionsPlayed, totalAnswered, totalCorrect        counters, updated with increment()

students/{uid}/questions/{questionId}
  attempts, correct, lastCorrect, lastAnsweredAt

students/{uid}/sessions/{sessionId}
  startedAt, lastAnswerAt, answered, correct         written with the first answer of a visit

teachers/{uid}                                       created by hand; any field
```

Each answer is one batched write touching the student doc, the question doc and the session doc. A student can only read and write their own subtree; an account whose uid exists in `teachers` can read every student.

## Firebase console setup (once)

1. Create a project at console.firebase.google.com. Analytics can stay off.
2. Project settings → Your apps → add a Web app. Copy the config into `.env.local` (git-ignored, one `KEY=value` per line) and into the Vercel project's environment variables:
   `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`. Restart the dev server after editing `.env.local`.
3. Build → Authentication → Sign-in method: enable **Google** and **Email/Password**. Settings → Authorized domains: add `diablohumastudio.com` (and the `*.vercel.app` preview domain if you test previews). `localhost` is already there.
4. Build → Firestore Database → Create database, production mode, nearest region.
5. Firestore → Rules: paste the contents of `firebase/firestore.rules` and publish. Do the same whenever that file changes.
6. Make yourself a teacher: sign in once at `/learn/quiz`, copy your UID from Authentication → Users, then in Firestore create the document `teachers/<your uid>` with any field (e.g. `role: "teacher"`). `/learn/quiz/teacher` now works for that account; everyone else sees "not registered as a teacher".

The web config values are not secrets: Firebase expects them in the browser, and the rules are what protect the data.

## Verifying changes

- `npx tsc --noEmit` for any edit; `npm run build` when routes or dependencies change.
- Open `http://localhost:3000/learn/quiz` and `http://localhost:3000/es/learn/quiz` for the student flow, `http://localhost:3000/learn/quiz/teacher` for the board (once with a teacher account, once with a student account, which must be denied).
- Without `.env.local` the pages render a "Firebase is not configured" notice instead of the app.
