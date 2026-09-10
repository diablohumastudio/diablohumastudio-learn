# Quiz: Questions, Progress and Firebase Setup

`/learn/quiz` is an endless multiple-choice quiz for the students of the `/learn` courses. It is unlisted (`noindex, nofollow`, never linked from the site). Questions and each student's progress both live in Firebase (Firestore + Firebase Auth, free Spark plan, no server code), so editing questions never needs a deploy.

## How it is wired

| Piece | Files | Role |
|---|---|---|
| Question model | `src/data/quiz/types.ts`, `src/data/quiz/index.ts` | Types, choice drawing, id numbering, class titles from the Learn registry |
| Question bank | `src/components/quiz/questions.ts` | Firestore reads/writes of `questions/{id}`, validation, `useQuestionBank()` |
| Question editor | `src/components/quiz/QuestionEditor.tsx` | Teacher-only list, form and JSON import at `/learn/quiz/questions` |
| Firebase init | `src/lib/firebase.ts` | Lazy client init from `NEXT_PUBLIC_FIREBASE_*`; `isFirebaseConfigured()` |
| Student app | `src/components/quiz/QuizApp.tsx` → `SignIn`, `QuizHome`, `Player` | Sign-in, personal numbers, endless play |
| Persistence | `src/components/quiz/progress.ts` | All Firestore reads and writes of student progress |
| Teacher board | `src/components/quiz/TeacherBoard.tsx` | Every student's numbers and per-question table |
| Layout | `src/components/quiz/QuizLayout.tsx` | Learn theme and fonts, language switch, user menu |
| Routes | `src/pages/learn/quiz/index.tsx`, `teacher.tsx`, `questions.tsx` | All load their app with `next/dynamic` and `ssr: false` |
| Rules | `firebase/firestore.rules` | Source of truth for the Firestore security rules |
| Texts | `src/i18n/pages/quiz.ts` | UI strings in both languages |

Play is endless: the active bank is shuffled into a cycle so a student sees every question once before any repeats, then it reshuffles. Every display of a question draws **one random correct answer and three random wrong ones** from its pools and shuffles them, so the same question looks different each time. A *session* is a visit with at least one answer. Every answer is saved as it happens.

## Question model

```
id            permanent, never reused or renumbered (e.g. 'wu-014')
topic         class slug from src/data/learn.ts (optional)
prompt        { es, en }
correct       [{ es, en }, …]   at least 1; one is shown per display
incorrect     [{ es, en }, …]   at least 3; three are shown per display
explanation   { es, en }        optional, shown after answering
retired       boolean           kept so old stats still resolve, never asked
```

Rules of thumb:

- Ids are how stats are keyed. A new question gets the next number for its course automatically (`wu-` for `wwise-unreal`, from the initials of the course slug; `q-` when it has no class). Never reuse an id.
- Do not delete questions: **retire** them. Deleting one leaves its stats showing as "Question no longer in the bank".
- `es` is the source language, like the presentations. Product names stay in English.
- The more wrong answers a question has, the more different it looks each time. Add many.
- With several correct answers, write the explanation so it covers all of them.

## Editing questions

Open `/learn/quiz/questions` with a teacher account (see setup step 6). The list shows every question; click one to edit it or use **New question**. The form enforces both languages, at least one correct and three wrong answers, and assigns the id on save.

**Import JSON** takes an array of questions in the model above, each with its own `id`; an existing id is replaced, which is also how you fix many questions at once. Example:

```json
[
  {
    "id": "wu-014",
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

Malformed documents in Firestore are skipped with a console warning rather than breaking the quiz.

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
6. Make yourself a teacher: sign in once at `/learn/quiz`, copy your UID from Authentication → Users, then in Firestore create the document `teachers/<your uid>` with any field (e.g. `role: "teacher"`). `/learn/quiz/teacher` and `/learn/quiz/questions` now work for that account; everyone else sees "not registered as a teacher".
7. Load the first questions: open `/learn/quiz/questions`, click **Import JSON** and paste an array in the format above.

The web config values are not secrets: Firebase expects them in the browser, and the rules are what protect the data.

## Verifying changes

- `npx tsc --noEmit` for any edit; `npm run build` when routes or dependencies change.
- Open `http://localhost:3000/learn/quiz` and `http://localhost:3000/es/learn/quiz` for the student flow, `http://localhost:3000/learn/quiz/teacher` for the board and `http://localhost:3000/learn/quiz/questions` for the editor (once with a teacher account, once with a student account, which must be denied).
- Without `.env.local` the pages render a "Firebase is not configured" notice instead of the app.
