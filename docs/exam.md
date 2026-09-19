# Exams: Timed Tests, Server Grading and Setup

`/learn/exam/<id>` is where students take a real, timed test and `/learn/<course>/exams` lists the opened exams of a course; `/learn/teacher/exam` is where a teacher creates, opens and reviews them. Like the rest of `/learn` it is unlisted. **An exam always belongs to one course** (the whole course or one class of it), like practice: the list is reached from the Exams button of the course page's homework card, there is no list under `/learn` (`/learn/exam` redirects there), and the exam room's back links go to the exam's course. It reuses the practice question bank (`docs/practice.md`), but unlike practice **the browser is never trusted**: opening, drawing questions, receiving answers and grading all run on the server (Next API routes on Vercel using the Firebase admin SDK).

## What the teacher and the student see

1. The teacher creates a **draft**: title, scope (all, one course or one class), questions per student and minutes.
2. **Open exam** starts one shared clock for everybody. It closes by itself when the time is up; **Close early** moves the end to now. Only one exam can run at a time.
3. A student presses **Start** and gets a random draw of questions with shuffled options, frozen into their attempt. A late arrival gets the time that is left.
4. All questions are on one page. Clicking an option only selects it; nothing is final until **Submit** is confirmed (it warns about unanswered questions). At zero the page submits by itself.
5. After submitting the student sees "Submitted". The **result is released automatically when the clock ends**: score plus a replay of the attempt with the right and wrong options marked.
6. The teacher watches who started and who submitted (with score) live, and can replay any attempt exactly as the student saw it, which is what settles a complaint.

## How it is wired

| Piece | Files | Role |
|---|---|---|
| Model | `src/data/exam/types.ts` | Types shared by browser and server (all times in ms), collection names, the submit grace |
| Admin SDK | `src/lib/firebaseAdmin.ts` | Server-only init from `FIREBASE_SERVICE_ACCOUNT` |
| Route helpers | `src/lib/examApi.ts` | `examApiRoute()`: POST only, verifies the caller's Firebase ID token, error codes; `requireTeacher()` |
| API routes | `src/pages/api/exam/open.ts`, `close.ts`, `start.ts`, `submit.ts` | See below |
| Bank parsing | `src/data/practice/parse.ts` | Same validation in the browser and on the server (no Firebase, no Learn registry) |
| Browser data | `src/components/exam/exams.ts` | Firestore reads, draft writes, `callExamApi()` with the ID token |
| Answer storage | `src/components/exam/examStorage.ts` | Answers in `localStorage` until the server confirms |
| Student | `src/components/exam/ExamList.tsx`, `ExamApp.tsx`, `ExamTaker.tsx` | List, exam room (start, resume, submit and retry, result), the one-page taker |
| Teacher | `src/components/exam/ExamManager.tsx` | Drafts, open, close early, live attempts, replay |
| Shared | `AttemptReplay.tsx`, `ConfirmPanel.tsx`, `format.ts` | Replay of an attempt, inline confirmation, countdown and error texts |
| Routes | `src/pages/learn/[curso]/exams.tsx`, `exam/[examId].tsx`, `teacher/exam.tsx` | `next/dynamic` + `ssr: false` like practice; a static `exams.tsx` wins over `[clase]`, so a class can never be slugged `exams` |
| Rules | `firebase/firestore.rules` | What browsers may read; they write drafts only |
| Texts | `src/i18n/pages/exam.ts` | UI strings in both languages |

No course may ever use the slug `exam`: the static route wins over `/learn/[curso]`.

### API routes

All are `POST /api/exam/<action>` with `Authorization: Bearer <Firebase ID token>` and `{ examId }` in the body. Errors come back as `{ error: <code> }` (`ExamApiErrorCode`).

| Route | Who | What |
|---|---|---|
| `open` | teacher | Reads the bank, keeps the active questions of the scope, builds the **paper** (per question: one random correct answer and three random wrong ones, the same four for every student) with the answer key, sets `closesAt = now + minutes`, writes the practice lock. Answers without an id get one and are saved back to the bank. Refuses when another exam is running or the scope is empty. |
| `close` | teacher | Moves `closesAt` (exam and lock) to now. |
| `start` | student | In a transaction: returns the existing attempt, or draws `min(maxQuestions, paper size)` random questions, shuffles their options and saves the attempt. Never includes which option is correct. Returns `closesAtMs` and `serverNowMs`. Idempotent, so a reload gets the same draw. |
| `submit` | student | In a transaction: keeps only answers to the attempt's questions with options that were shown, grades against the paper, writes the attempt and the grade. A second call changes nothing. |

### Clock

The end is fixed when the teacher opens the exam and does not depend on when each student starts. `start` returns the server's current time; the browser keeps the difference with its own clock (taken at the middle of the round trip) and counts down from that, so a wrong or changed device clock does not move the end. The countdown is only display and auto-submit: a student who freezes it gains nothing, because **the server stamps the arrival with its own clock**. Answers arriving up to `SUBMIT_GRACE_MS` (1 minute) after the end are on time; later ones are **accepted but flagged** `late` with `lateBySeconds`, for the teacher to judge (a real wifi drop is not punished; going offline to gain time is visible).

### Answers stay in the browser until confirmed

Each selection is written to `localStorage` (`exam:<examId>:<uid>`). Submit marks it pending and sends; on failure the page retries every 5 seconds and again whenever the exam page is reopened, and the record is only cleared when the server answers OK. The record existing also means "the exam was taken on this device": that is what lets the page send it by itself after the clock ends. A device without the record never submits on its own, so opening the exam on a second device cannot overwrite real answers with an empty submit.

## Firestore data model

```
exams/{examId}
  title, courseSlug, classSlug, topics[], maxQuestions, durationMinutes
  status            'draft' | 'opened'   ("finished" is just closesAt in the past)
  createdAt, openedAt, closesAt, paperSize

exams/{examId}/private/paper            server only
  questions[]: id, prompt, options[{ id, text }], correctOptionId

exams/{examId}/attempts/{uid}           written by the API only
  displayName, email, status 'started' | 'submitted'
  questions[]: id, prompt, options[{ id, text }]    in the order shown, texts included
  answers: { questionId: optionId }
  startedAt, submittedAt, late, lateBySeconds

exams/{examId}/grades/{uid}             written by the API only
  score, total, correctOptionIds: { questionId: optionId }

settings/examLock                       written by the API only
  examId, closesAt
```

`topics` is the list of class slugs the scope covers (null for the whole bank). The browser resolves it when saving the draft (`scopeTopics()` in `src/data/learn.ts`) because the server does not load the Learn registry, which would pull every presentation into the API bundle.

The attempt stores the **texts** next to the ids, so a replay stays exact after the bank is edited. Option ids come from the bank (`id` on every entry of `correct[]` / `incorrect[]`): opaque, assigned by the editor on save or by `open`, kept when the text is edited. A JSON import that leaves them out gets new ones.

Rules in short: teachers read everything except `private`; a student reads opened exams, their own attempt and, **once `closesAt` has passed**, their own grade, which is how the result releases itself without any scheduler. Browsers can only create, edit and delete drafts.

## Practice is paused during an exam (on purpose)

The practice bank is downloaded by the browser with the correct answers in it, and an exam draws from the same bank. So while `settings/examLock.closesAt` is in the future the rules refuse `questions` to **every account that is not a teacher**, not only to the students taking the exam: Firebase cannot tell an examinee from a second account opened in another tab. Practice shows "paused while an exam is running" and works again after a reload once the clock ends.

Known limits: a student who loaded practice before the exam opened keeps what their browser already has, and students have seen the questions while practising (the same as having studied them). The way to remove the pause is an exam-only question bank that practice never serves; it does not exist yet.

## Setup (once)

1. Firebase console → Project settings → Service accounts → **Generate new private key**. It downloads a JSON file. It is a secret with full access to the project: never commit it.
2. Put the whole JSON **on one line** in `FIREBASE_SERVICE_ACCOUNT`, in `.env.local` (then restart the dev server) and in the Vercel project's environment variables (then redeploy). One way to flatten it: `node -e "console.log(JSON.stringify(require('./key.json')))"`.
3. Firestore → Rules: paste `firebase/firestore.rules` and publish.
4. The API routes only exist on a deployment that includes them, so push with `[deploy]`.

Without the variable the routes answer `serverNotConfigured` and the pages show that message.

## Verifying changes

- `npx tsc --noEmit` for any edit; `npm run build` when routes or dependencies change.
- Teacher: `http://localhost:3000/learn/teacher/exam` → create a draft, open it. Student (another account, another browser): `http://localhost:3000/learn/wwise-unreal/exams` → start, answer, reload mid-exam (answers and draw must survive), submit. Check "Submitted", then the result after the clock ends, and the replay on the teacher side.
- While it runs, `http://localhost:3000/learn/practice` with the student account must show the pause notice.
- Turn the network off before submitting: the page must show the retry message and send once the network is back.
