# Practice: Questions, Homework and Firebase Setup

`/practice/play` is an endless, timed multiple-choice practice for the students of the courses, counted as daily homework, and `/teacher` holds the teacher tools. It is unlisted (`noindex, nofollow`, never linked from the site). Questions and each student's progress both live in Firebase (Firestore + Firebase Auth, free Spark plan, no server code), so editing questions never needs a deploy.

## How it is wired

| Piece | Files | Role |
|---|---|---|
| Question model | `src/data/practice/types.ts`, `src/data/practice/index.ts` | Types, choice drawing, id numbering, class titles and `questionsInScope()` from the Learn registry |
| Homework model | `src/data/practice/homework.ts` | The goals (`DAILY_QUESTIONS_GOAL`, `RUN_LENGTH`, `RUN_CORRECT_GOAL`), day keys, the run and `isDayDone()`; the `Homework` type of a specific homework, its rounds (`HomeworkRound`, `isRoundDone()`, `isHomeworkDayDone()`) and `isHomeworkOpen()` |
| Specific homeworks | `src/components/practice/homeworks.ts`, `HomeworkManager.tsx`, `HomeworkEntry.tsx`, `HomeworkList.tsx`, `HomeworkPage.tsx` | Firestore reads/writes of `homeworks/{id}`, the teacher pages at `/teacher/homeworks` (list) and `/teacher/homeworks/<id>` (one homework; `new` for one not saved yet), one homework as the student sees it (an entry of the course page's Homeworks card, and the whole of `/course/<course>/homeworks/<id>`) and the homeworks page at `/course/<course>/homeworks`, a row per homework like the exams list ([courses.md](courses.md)) |
| Question selection | `src/data/practice/selection.ts`, `src/components/practice/QuestionPicker.tsx` | Which questions an exam draws from: a list of ids, ticked one by one or all at once after filtering by class or slide (`docs/exam.md`) |
| Slides of a class | `src/data/learn.ts` (`slideLabels`, `classSlides`), `src/components/learn/useClassSlides.ts` | Slide ids and titles from the deck dictionaries, loaded only by the teacher tools |
| Question bank | `src/components/practice/questions.ts` | Firestore reads/writes of `questions/{id}`, validation, `useQuestionBank()` |
| Question editor | `src/components/practice/QuestionEditor.tsx`, `ImportReview.tsx`, `src/data/practice/importReview.ts` | Teacher-only list, form and JSON import (file or pasted, reviewed before writing) at `/teacher/questions` |
| Firebase init | `src/lib/firebase.ts` | Lazy client init from `NEXT_PUBLIC_FIREBASE_*`; `isFirebaseConfigured()` |
| Student app | `src/components/practice/PracticeApp.tsx` → `Player`, `HomeworkMeter`, `PlayScopeSelect` | Endless timed play (`/practice/play`) with the day's homework under the card |
| Course page | `src/components/practice/CourseProgressContext.tsx`, `CourseProgressLoader.tsx`, `CourseProgress.tsx`, `ClassPracticeLink.tsx` | The Daily practice card and per-class answer counts on `/course/<course>`; the loader is the only part that downloads Firebase |
| Student history | `src/components/practice/StudentHistory.tsx`, `QuestionStatsTable.tsx` | `/course/<course>/history`: the signed-in student's own lifetime counters, daily homework by month, day by day and per-question table; the same loader as the course page |
| Settings | `src/components/practice/practiceSettings.ts`, `src/components/learn/ConfigDialog.tsx` | Time per question and text size, per device in `localStorage`; the layout sets `--text-delta` from the text size and every text size in the CSS modules is `calc(<base>px + var(--text-delta, 0px))`, headings excepted |
| Persistence | `src/components/practice/progress.ts` | All Firestore reads and writes of student progress |
| Teacher board | `src/components/practice/TeacherBoard.tsx`, `PeriodControls.tsx`, `PeriodSummary.tsx`, `HomeworkGrid.tsx`, `useStudentDays.ts`, `summarySelection.ts`, `tableExport.ts` | Course, month and range; the period summary with its export; the day grid; every student's numbers at `/teacher/students-practice-info`, each name linking to the student's review page |
| Student review | `src/components/practice/StudentReview.tsx` | `/teacher/student` lists the students; `/teacher/student/<uid>` is one student's page: daily homework (the board's `CoursePeriod` with one row), per-question table on demand, specific homeworks with points and days, exams with score and a link to the replay |
| Teacher hub | `src/components/learn/TeacherHub.tsx` | `/teacher`: links to the board, the student review, the editor, the homeworks and the exams, teachers only |
| Account | `src/components/learn/useAuthUser.ts`, `useTeacherStatus.ts`, `AccountMenu.tsx`, `SignIn.tsx`, `SignInGate.tsx`, `SignInRedirect.tsx` | Shared by the whole platform (see `docs/learn-courses-and-slides.md`) |
| Layout | `src/components/learn/LearnPageLayout.tsx` | Learn theme and fonts plus the section header |
| Routes | `src/pages/practice/play.tsx`, `course/[curso]/history.tsx`, `teacher/index.tsx`, `teacher/students-practice-info.tsx`, `teacher/student/index.tsx`, `teacher/student/[uid].tsx` (the same page: `StudentReview` reads the uid from the route), `teacher/questions.tsx`, `teacher/homeworks/index.tsx`, `teacher/homeworks/[homeworkId].tsx` (the same page: `HomeworkManager` reads the id, or `new`, from the route) | All load their app with `next/dynamic` and `ssr: false` |
| Rules | `firebase/firestore.rules` | Source of truth for the Firestore security rules |
| Texts | `src/i18n/pages/practice.ts` | UI strings in both languages |

Practice never mixes courses and has no home of its own: it starts from the course page (`/course/<course>`), whose Daily practice card practices the whole course and whose class rows, in the Class presentations card, each carry a practice button. The **scope** lives in the query string of the play page: `?course=<slug>` is one course and `?course=<slug>&class=<slug>` one class. Without a known course the page goes back to `/courses`, and `/practice` itself redirects there (`next.config.js`). While playing, the header dropdown (`PlayScopeSelect`) switches between the classes of that course; **Stop** is a link back to the course page. The whole bank is loaded once and filtered in the browser (`questionsInScope`): at this size the reads are free.

A page that needs an account never shows the form inline: it renders `SignInRedirect`, which sends a guest to `/sign-in?next=<this page>`, the same URL the header's Sign in link uses, and signing in returns them.

Play is endless: the questions in scope are shuffled into a cycle so a student sees every question once before any repeats, then it reshuffles. Every display of a question draws **one random correct answer and three random wrong ones** from its pools and shuffles them, so the same question looks different each time. A *session* is a visit with at least one answer. Every answer is saved as it happens.

Every question has a **timer**: 45 seconds by default, which each student changes in the account menu → Config, between 2 and 120 seconds (`practiceSettings.ts`). When it runs out the correct answer is revealed and the question is saved as a **wrong answer** (`TIMEOUT_COUNTS_AS_ANSWER`): ignoring it would let a student skip every question they do not know and keep a clean run. The player never advances by itself, so an abandoned tab costs one wrong answer, not one per timer.

## Homework

Homework is counted **per course and per local day** with two numbers, and a day is done when both are met (`isDayDone`):

- **Questions answered**: at least `DAILY_QUESTIONS_GOAL` (30) in the course, whatever classes they came from.
- **Best run**: at least `RUN_CORRECT_GOAL` (7) right within `RUN_LENGTH` (10) questions in a row. The player keeps the results of the last 10 answers of the session (the pips under the card); each time their count of right answers beats the day's record, the record is rewritten. The run starts empty with every session.

The pair is what makes the count honest: clicking at random reaches 30 answers but gets 7 of 10 right about once in 300 tries.

Students see both numbers live under the question while playing ("Today" and the pips of the "Last 10"). On the course page the **Daily practice** card (closed to its title row until the student opens it, like every card there; [courses.md](courses.md)) has three sections split by lines: **Today** (Total and Best 10); **This week**, the calendar week from Monday to Sunday with a mark per day (filled = done, amber ring = started, dashed = still to come), the days done and the questions answered in the week; and **Grade by month**, a dropdown with the months the student practiced in and, for the chosen one, the days done as the teacher counts them (`summarizePeriod`, the month cut at today) with the full and half days, so the student sees the same number the teacher grades. The card also holds the course's buttons, **Practice this course** and, for a signed-in student, **History and statistics**; the specific homeworks and the exams have cards of their own under it ([courses.md](courses.md)). That last one opens `/course/<course>/history`, the student's own numbers and nobody else's (the rules only let an account read its own `students/{uid}` subtree): the lifetime counters, a table with a row per month of the daily homework (days done as the teacher counts them, full and half days, answers, right answers, accuracy), the day-by-day grid of one month, the same the teacher sees with a single row, and the per-question table of this course's questions (`QuestionStatsTable`, shared with the teacher board). It loads what the course page loads, so it costs the same reads. Each class row's practice button shows `✓ correct / answered`: every answer the student gave to the questions of that class and how many were right, retired questions included.

To the teacher a day is worth **1 point** with both numbers met, **½** with one of them and **0** with neither, however much was practiced (`dailyDayScore`); sessions add up, so the numbers are read from the day's totals. A period is graded by the sum of its days (`summarizePeriod`). The teacher board shows the daily homework of one course in two sections, each with a **period** selector of its own (a month with practice, cut at today; **All**, from the first day anybody practiced; or **Custom**, the only choice that shows From and To). The first is one table with a row per student, alphabetical, every column of the period: the points over its days, the full and half days, the answers, right answers and accuracy, and the last day with an answer; **All** makes it the whole history of the course. The name links to the student's review page. The second is the grid of student × day with each cell `answered · best run`: teal for a full day, amber for a half, dim for a day practiced without reaching either. Every day column has the same fixed width, so a short period leaves the card half empty and a long one scrolls sideways under the name and total columns, which stay in view. Each row of the summary has a tick and arrows to move it; **Copy** (to the clipboard, tab-separated, so a paste fills cells), **Download CSV** and **Download TSV** export the ticked students, in the order shown, as two columns, name and days done: what goes into the grade book, whose base and weight the teacher sets there. The ticks default to the students with activity in the range; ticks and order are remembered per course in the browser (`summarySelection.ts`, `localStorage`). The decimal mark follows the UI language, a comma in Spanish, and the Spanish CSV separates with semicolons, as Excel expects in that region; the files start with a UTF-8 BOM so the accents of the names survive (`tableExport.ts`).

Everything on this page is for the students **enrolled** in the course ([courses.md](courses.md)): an account that is not enrolled sees the access card instead of the homework card, and practice, the exams, the deliverables and the history of the course send it back to the course page. The teacher's board counts only the enrolled students of the chosen course, and the student review lists only the accounts enrolled in some course.

The history page and the teacher's student page are laid out in the same **five sections**, each under a big heading: daily practice (everything described above), multiple option exams, multiple option specific homeworks, deliverable exams and deliverable homeworks. The deliverable sections, and the student's own exams table of the history (`src/components/exam/StudentExams.tsx`), are described in [deliverables.md](deliverables.md).

**Reviewing with one student** happens on that student's page, `/teacher/student/<uid>`, reached from **Student review** in the teacher menu (a list of the students) or from a name in the board, so nobody else's numbers are on screen while the student sits beside the teacher; a dropdown in the heading switches to another student without going back. The page stacks everything of that student: the daily homework exactly as the board shows it, summary and grid with their period selectors, for one row; the per-question table, loaded only when **Show questions** is pressed (one read per question answered); every specific homework with the student's points, a click opening its day grid; and every opened exam with the attempt, the score and the lateness, the title linking to the replay at `/teacher/exam/<id>/<uid>`. It reads only that student's documents, the homeworks, the exams and one attempt and one grade per exam.

Days use the student's local date, read when the practice session starts: a session that runs past midnight keeps filling the day it started on, and the player says so (Stop and come back in to count for the new day). Like all progress, the numbers are written by the student's browser, so a student who knows Firestore could forge them; that is accepted for homework (exams are graded by the server, see `docs/exam.md`).

## Specific homeworks

Besides the daily homework, a teacher can set a **specific homework**: questions to practice on given days, for instance to let students recover a grade. The homework list at `/teacher/homeworks` has two sections, each with its own New button: these multiple option homeworks and the deliverable homeworks of [deliverables.md](deliverables.md). A specific homework is created at `/teacher/homeworks/new`, and each one then lives at `/teacher/homeworks/<id>`, with a title, a course, a first and a last day, and one or more **rounds**. Each round has its own questions (the same picker the exams use, without the exam-only bank) and its own **answers per day** (`goal`, 50 by default).

- **Rounds are what keeps a long homework honest.** The best run is asked once per round. A homework of 200 answers in a single round is passed with ten careful answers and 190 random ones; five rounds of 40 ask for the run five times, which is what five separate homeworks of 40 would. In the form, **Duplicate** copies a round with its questions, **Add round** starts an empty one, and a homework keeps at least one. A homework with a single round looks to students the way every homework did before rounds existed.
- **It is counted apart, round by round.** Playing a round (`/practice/play?course=<slug>&homework=<id>&round=<roundId>`) asks only its questions and fills that round's own day (`students/{uid}/days/hw-{id}-{roundId}_{day}`). Those answers do **not** count for the daily homework nor for another round, and normal practice does not count for the specific one, so a student who owes both does both. Lifetime counters, per-question stats and sessions are still updated: they describe the student, not a homework. Each round is a session of its own, so its run starts empty.
- **A round is done** with its `goal` answers and the same best run as the daily homework (`RUN_CORRECT_GOAL` of `RUN_LENGTH`): `isRoundDone()`. **A day is done** when every round is: `isHomeworkDayDone()`. A homework of several days asks for all its rounds again each day. When a round is done the player offers the next one; until the student moves on, the answers keep counting for the round being played.
- **It is open** from its first to its last day, in the student's local date (`isHomeworkOpen()`). The play page refuses it on any other day. A session started on the last day keeps counting for it past midnight, like any session (see Homework).
- **The students it is for see it**: everybody enrolled in the course, or the ones the teacher ticked ([courses.md](courses.md)). While it is open, from its first to its last day, the course page's Homeworks card lists it as an entry with today's meter (a line per round when there are several), a mark per day and the Practice button, which goes to the first round not done yet; once over it leaves the course page and stays as a row of `/course/<course>/homeworks`, whose own page keeps its days done, and in the history. The teacher decides whose homework counts.
- **The teacher's view** is the same grid as the daily homework (student × day, `answered · best run`), on the homework's own page, restricted to its days, with a column per round under each day when there are several, and above it the same period summary: a round is worth 1, ½ or 0 against its own goal (`roundScore`), a day is the mean of its rounds (`homeworkDayScore`), and the export carries name and points.
- **Round ids are permanent.** A round gets its id when it is added, and the students' answers are keyed by it: changing its questions or its goal, or adding and removing other rounds, never moves anybody's answers. Removing a round leaves its days in the students' accounts, unseen. The only round of a homework saved before rounds existed has no id (`LEGACY_ROUND_ID`): its days keep their old name, `hw-{id}_{day}`, and its link has no `round`.
- The questions are ordinary practice questions: they are also asked in normal practice. A homework can be edited until its last day: while it is open the form warns that changing it changes the rules mid-way and Save asks for confirmation; once it is over the form is read-only and dimmed (`homeworkState`). Deleting is always allowed and leaves the students' days in their accounts, unseen.

## Question model

```
id            permanent, never reused or renumbered (e.g. 'wu-wo-014')
topic         class slug from src/data/learn.ts (optional)
slides        [slide id, …] of that class (optional): keys of the deck dictionary's `labels`
prompt        { es, en }
correct       [{ id?, es, en }, …]          at least 1; one is shown per display
incorrect     [{ id?, es, en, level }, …]   at least 3; three are shown per display
explanation   { es, en }        optional, shown after answering
retired       boolean           kept so old stats still resolve, never asked
```

Rules of thumb:

- `level` rates every wrong answer against the correct one: 5 almost correct, 3 plausible, 1 discardable (the scale, its rules and the review cycle are in [questions/README.md](../questions/README.md)). The editor and Import JSON require it on every wrong answer; a bank document without it is still read, so questions saved before levels existed keep working until they are rated. The hard practice mode will draw from it (`TODO.md`).

- Ids are how stats are keyed. A new question gets the next number for its class automatically: `wu-wo-` for `wwise-unreal` / `wwise-objects`, from the initials of the course and class slugs; `q-` when it has no class. The first questions predate the class part (`wu-001`…) and keep their ids. The prefix is only a label: a question moved to another class keeps its id. Never reuse an id.
- Do not delete questions: **retire** them. Deleting one leaves its stats showing as "Question no longer in the bank".
- `es` is the source language, like the presentations. Product names stay in English.
- The more wrong answers a question has, the more different it looks each time. Add many.
- With several correct answers, write the explanation so it covers all of them.
- `slides` says which slides a question is about. Pick them in the editor (the checkboxes appear once a class is chosen) or write them in the JSON, e.g. `"slides": ["flujo", "sonido"]`. Untagged questions still belong to their class; the tag only lets the exam picker filter by slide and tick all its questions at once.
- The **Exam only** checkbox stores the question in the teacher-only bank `examQuestions`: never practiced, only picked into exams (`docs/exam.md`).
- Every answer carries an opaque `id`, which is what an exam attempt records as the option a student picked (`docs/exam.md`). The editor assigns it on save and keeps it when the text changes; practice ignores it.

## Editing questions

Open `/teacher/questions` with a teacher account (see setup step 6). The list shows every question; click one to edit it or use **New question**. The form enforces both languages, at least one correct and three wrong answers, and assigns the id on save.

**Export JSON** downloads the practice bank (and, apart, the exam-only one) in the exact format Import reads, answer ids included, so a file edited outside the site, for instance to tag every question with its slides, goes back in with Import. **Import JSON** takes an array of questions in the model above, from a chosen `.json` file or pasted, and writes nothing by itself: **Review** opens a list of every question with what it would do (`src/data/practice/importReview.ts`). Green, *new*: its id is free. Red, *replaces with changes*: the id exists and the listed fields differ, which is also how you fix many questions at once. Red, *no id*: it gets the next free id of its class, shown in the list. Amber, *identical*: it is in the bank as it is and is not written. Every question has an **Edit** button that changes the import, not the bank, and Import asks for confirmation with the counts whenever something is not new. A file with a wrong answer that has no `level` is refused before the review; a file that only changes levels counts as a change and is written. Answer ids are not compared; a replaced question whose file has no answer ids gets new ones, so do not replace a question an exam already used from a hand-written file. Example:

```json
[
  {
    "id": "wu-eew-014",
    "topic": "el-editor-wwise",
    "prompt": { "es": "¿…?", "en": "…?" },
    "correct": [{ "es": "Correcta", "en": "Correct" }],
    "incorrect": [
      { "es": "Otra", "en": "Other", "level": 5 },
      { "es": "Otra más", "en": "Another", "level": 3 },
      { "es": "Y otra", "en": "And another", "level": 1 }
    ],
    "explanation": { "es": "Por qué.", "en": "Why." },
    "retired": false
  }
]
```

Malformed documents in Firestore are skipped with a console warning rather than breaking the practice.

## Firestore data model

```
questions/{questionId}                               examQuestions/{questionId} has the same fields
  topic?, slides[]?, prompt, correct[], incorrect[], explanation?, retired, updatedAt

students/{uid}
  displayName, email, createdAt, lastPlayedAt
  sessionsPlayed, totalAnswered, totalCorrect        counters, updated with increment()

students/{uid}/questions/{questionId}
  attempts, correct, lastCorrect, lastAnsweredAt

students/{uid}/sessions/{sessionId}
  startedAt, lastAnswerAt, answered, correct         written with the first answer of a visit

students/{uid}/days/{courseSlug}_{YYYY-MM-DD}
  courseSlug, day, answered, correct, bestRun, updatedAt   daily homework of one course on one local day

students/{uid}/days/hw-{homeworkId}-{roundId}_{YYYY-MM-DD}
  homeworkId, roundId, day, answered, correct, bestRun, updatedAt
                                                           one round of a specific homework on one local day (no
                                                           courseSlug, so whatever reads the daily homework by course
                                                           skips it). The round without id: hw-{homeworkId}_{day}, no roundId

homeworks/{homeworkId}
  title, courseSlug, rounds[{ id, questionIds[], goal }], firstDay, lastDay, createdAt
  assignedUids[], forEveryone                              who it is for (courses.md): every member of the
                                                           course when the list is empty; forEveryone is
                                                           stored beside the list so a query can ask for it
                                                           saved before rounds existed: questionIds[] and dailyGoal
                                                           instead of rounds, read as one round without id

teachers/{uid}                                       created by hand; any field
```

Each answer is one batched write touching the student doc, the question doc, the session doc and the day doc (the course's, or the round's when a specific homework is being played). The members of a course read its `homeworks` (the query filters by course, which is what lets the rule be checked); only teachers write it. Firestore has no `max()` transform, so `bestRun` is written by the player only when the run beats the record it read from the day doc, and never before that doc has loaded (it would replace a better run with a worse one). Any signed-in user can read the question bank, except while an exam is running, when practice is paused for every non-teacher (`docs/exam.md`); only teachers can write it. A student can only read and write their own subtree; an account whose uid exists in `teachers` can read every student.

## Firebase console setup (once)

1. Create a project at console.firebase.google.com. Analytics can stay off.
2. Project settings → Your apps → add a Web app. Copy the config into `.env.local` (git-ignored, one `KEY=value` per line) and into the Vercel project's environment variables:
   `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`. Restart the dev server after editing `.env.local`.
3. Build → Authentication → Sign-in method: enable **Google** and **Email/Password**. Settings → Authorized domains: add `learn.diablohumastudio.com` (and the project's `*.vercel.app` domain if you test previews). `localhost` is already there.
4. Build → Firestore Database → Create database, production mode, nearest region.
5. Firestore → Rules: paste the contents of `firebase/firestore.rules` and publish. Do the same whenever that file changes (`examQuestions` needs it: without the rules the Exam only checkbox is refused and the editor shows a notice; `homeworks` needs it too: without the rules the teacher page shows a notice and the course page simply shows no specific homework).
6. Make yourself a teacher: sign in once at `/sign-in`, copy your UID from Authentication → Users, then in Firestore create the document `teachers/<your uid>` with any field (e.g. `role: "teacher"`). `/teacher` and its pages now work for that account, which also gets the Teacher links in the header and the menus; everyone else sees "not registered as a teacher".
7. Load the first questions: open `/teacher/questions`, click **Import JSON** and paste an array in the format above.

The web config values are not secrets: Firebase expects them in the browser, and the rules are what protect the data.

## Verifying changes

- `npx tsc --noEmit` for any edit; `npm run build` when routes or dependencies change.
- Open `http://localhost:3000/course/wwise-unreal` (the four closed cards: Daily practice, Homeworks, Exams, Class presentations with the class rows) and `http://localhost:3000/practice/play?course=wwise-unreal` (timer, pips), also under `/es`, for the student flow, `http://localhost:3000/teacher/students-practice-info` for the board (pick a month, untick an account, move a row, then Copy and paste into a spreadsheet: two columns, name and days done, in that order; the CSV and TSV downloads open with the accents intact), `http://localhost:3000/teacher/homeworks` for the specific homeworks (create one that includes today, then check its entry in the Homeworks card of the course page and that playing it moves its own meter and not the daily one; give it two rounds with a small goal and check that each fills its own line of the entry, that the player offers the next round when one is done and that the grid shows a column per round) and `http://localhost:3000/teacher/questions` for the editor (once with a teacher account, once with a student account, which must be denied).
- Without `.env.local` the pages render a "Firebase is not configured" notice instead of the app.
