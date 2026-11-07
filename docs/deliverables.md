# Deliverables: Homeworks and Exams Handed In as Text or Links

A **deliverable** is a homework or an exam the student hands in as something other than multiple choice: answers written on the platform, a link to a repository on GitLab or GitHub, or a link to a document (a PDF of handwritten work uploaded to Google Drive, for instance). The teacher creates it, opens it for a course, and reviews each submission with a score and a comment; the student writes until the close and sees the review when it exists. Grading is **on demand**: the teacher reads the submissions on the platform, or exports them with a script, grades them with the AI in a session, and the scores go back with another script (automating this is a future item in [TODO.md](../TODO.md)). Spanish: *Entrega*, *Deber de entrega*, *Lección de entrega*.

## Roles and kinds

- **Role**: where a deliverable is listed and graded. `homework` sits with the specific homeworks (`/teacher/homeworks`, the course page's homework cards, the "Deliverable homeworks" section of the student's history and of the teacher's student page); `exam` sits with the exams (`/teacher/exam`, `/course/<course>/exams`, the "Deliverable exams" sections). Both behave the same; the role only decides where it shows and how the teacher counts it.
- **Kind**: what the student hands in. `text`: one or more questions, each answered in a field that refuses pasting and dropping and records how it was typed; an optional character limit per question. `repo`: a link to a repository or a branch on gitlab.com or github.com (since class 10 the course work lives in branches of the shared `PF_HS2` repository, so a branch link is the normal case). `docLink`: any https link, meant for a file the student uploaded to the course's Google Drive folder.

## What the teacher and the student see

1. The teacher presses **New deliverable homework** or **New deliverable exam** in the matching list. The role is the list's and is not a field of the form; it asks for the title, the course and the kind, the **students** it is for (everyone enrolled in the course, the default, or a tick per enrolled student, found by name or email; see [courses.md](courses.md)), an optional link to the guide (a PDF in Drive), optional instructions shown above the form, the questions (text kind), the maximum score and, for an exam, the minutes it stays open; for a homework, the date and time it closes. **Save draft** keeps it unseen by students.
2. **Open** publishes it to the students it is for. An exam closes `durationMinutes` after that moment; a homework closes at the chosen date and time. While it is open the teacher can **change the close**, **close now**, and still change who it is for (to add someone late, for instance).
3. The student finds a card on the course page (and, for the exam role, a row in the course's exams list) and opens `/course/<course>/deliverable/<id>`: the title, the instructions, a button to the guide, the time left and the form. Text answers are kept in the browser and **saved by themselves every minute** while they change, and with the **Save** button; a link is saved when it is valid. The page says when the last save happened and warns before leaving with unsaved changes.
4. At the close the fields lock. Whatever was saved last is the submission. A save that reaches the server after the close and its one-minute grace (`SAVE_GRACE_MS`, the same as the exams' `SUBMIT_GRACE_MS`) is accepted and shown as **late** by that many seconds, to the student and to the teacher, exactly like an exam submission.
5. The teacher's page lists one row per student the deliverable is for (every member of the course, or the ones ticked), with "Nothing saved" for whoever has not saved, and for each submission its save time, lateness, score and, for text, a `check` mark when the typing signals show pasting, dropping or jumps. A row with a submission opens it as saved, its typing signals and the review form (score out of the maximum, comment). The student sees score and comment on the deliverable's page, on the course card and in the history as soon as they are saved.

## Typing signals (text kind)

Pasting and dropping are refused by the fields, which is friction and not security: anyone can type a copied text, have a tool type it, or inject it through the developer tools. The teacher said that retyping is acceptable (it means the student read the text) and that what must not happen is plain copy and paste, so what is recorded is how the text got there (`src/components/deliverable/typingSignals.ts`):

- **Paste attempts** and **drop attempts**: each refused event.
- **Jumps**: an input event that adds `JUMP_CHARS` (20) or more characters at once, with the moment and the question. Injected text and bots that type by blocks show here; autocorrect rarely reaches the threshold.
- **Peak speed**: the fastest ten-second window, in characters per minute. Auto-typers show an inhuman, flat speed.
- **Timeline**: every `SAMPLE_INTERVAL_MS` (10 s) while the page is visible, the total characters so far, up to `MAX_SAMPLES` (2000). The teacher's page draws it, with the jumps as red dots: a human curve has pauses and a slope; a pasted text is a step.
- **Focus losses**, **time typing** (ten-second windows with a keystroke) and **time on the page** since the first keystroke, over every visit.

None of it is a verdict. The page tells students it records "advanced typing telemetry" and that attempts are reported, which is the deterrent the teacher asked for; what the teacher does with a flagged submission is up to them. The form only exists with JavaScript (the app is loaded with `ssr: false` and writes through the Firebase SDK), so turning it off shows the notice and sends nothing; the signals travel with every save, so a reload or a second visit carries on the same record (the draft kept in `localStorage`, `deliverableStorage.ts`, holds them too).

## How it is wired

| Piece | Files | Role |
|---|---|---|
| Model | `src/data/deliverable/types.ts` | Types, collection names, grace, autosave and signal constants, lateness and URL validation; no Firebase types |
| Browser data | `src/components/deliverable/deliverables.ts` | Firestore reads and writes: deliverables, submissions, reviews |
| Draft in the browser | `src/components/deliverable/deliverableStorage.ts` | `localStorage` record of what is not confirmed saved |
| Typing signals | `src/components/deliverable/typingSignals.ts`, `TypingSignalsView.tsx` | The recorder hook and the teacher's view with the timeline |
| Teacher | `DeliverableManager.tsx` | Draft form, opened view with the submissions table, one submission with its review form |
| Teacher lists | `DeliverableSection.tsx` | The "Deliverable homeworks" / "Deliverable exams" section with its New button, under the multiple option list of `HomeworkManager` and `ExamManager` |
| Student | `DeliverableApp.tsx` | The deliverable's page: form, autosave, close, late note, review; enrolled students only |
| Course page | `CourseDeliverables.tsx` | One card per opened deliverable of the course that is for the student, until a week after its close; rendered by `CourseAccess` for members only |
| Exams list | `src/components/exam/ExamList.tsx` | Adds the opened deliverable exams of the course |
| History and review | `StudentDeliverables.tsx`, `src/components/exam/StudentExams.tsx`, `StudentHistory.tsx`, `StudentReview.tsx` | The five sections of the student's history and of the teacher's student page: daily practice, multiple option exams, multiple option specific homeworks, deliverable exams, deliverable homeworks |
| Routes | `src/pages/course/[curso]/deliverable/[deliverableId].tsx`, `teacher/deliverable/[deliverableId]/index.tsx`, `[uid].tsx` | `next/dynamic` + `ssr: false`; the student page carries the `<noscript>` notice |
| Scripts | `deliverables/scripts/export-submissions.js`, `import-reviews.js` | On-demand grading, below |
| Rules | `firebase/firestore.rules` | Who reads and writes what |
| Texts | `src/i18n/pages/deliverable.ts` | UI strings in both languages |

Routes come from `src/data/learn.ts`: `deliverablePath(course, id)`, `teacherDeliverablePath(id)`, `teacherDeliverableNewPath(role)` (`/teacher/deliverable/new?role=exam`) and `teacherSubmissionPath(id, uid)`. There is no list page under `/teacher/deliverable`: the lists are the homework and exam pages.

## Firestore data model

```
deliverables/{id}
  title, courseSlug, role 'homework' | 'exam', kind 'text' | 'repo' | 'docLink'
  guideUrl, instructions, questions[{ id, text, maxChars | null }], maxScore
  assignedUids[], forEveryone   who it is for: every member of the course when the list is empty;
                                forEveryone is stored beside the list so a query can ask for it
  durationMinutes            exam role: Open sets closesAt this far ahead
  deadline                   homework role: the close Open will set (Timestamp or null)
  status 'draft' | 'opened', createdAt, openedAt, closesAt

deliverables/{id}/submissions/{uid}
  displayName, email, answers { questionId: text }, url, typing { … } | null
  firstSavedAt, savedAt      both the server's clock; savedAt decides lateness

deliverables/{id}/reviews/{uid}
  score | null, maxScore, comment, reviewedAt, reviewedBy (teacher uid, or the script's --by)
```

Rules in short: teachers read and write every deliverable from the browser (there is no API route: opening and closing are plain writes, so the close is the teacher's clock). A student reads only the opened deliverables of a course they are enrolled in that are for them (`forEveryone`, or their uid in `assignedUids`), and only their own submission and review. Because a list query must prove the rule, `subscribeStudentDeliverables` runs two queries per course, `status == 'opened' && courseSlug == X && forEveryone == true` and the same with `assignedUids array-contains uid`, and merges them; if Firestore ever asks for a composite index for one of them, the error in the console carries the link to create it. A student may create or update their submission while the deliverable is opened and is for them, and the rules demand `savedAt == request.time` (the `serverTimestamp()` sentinel) and an unchanged `firstSavedAt`: a device clock set back cannot hide a late save. Reviews are written by teachers only. Deleting a deliverable leaves its submissions and reviews orphaned in their subcollections, unseen.

Known limits: a student who has the page open when a draft is opened does not see it appear (the rules refused the listener while it was a draft); a reload does. The countdown runs on the device clock; the rules, not the page, decide what counts as late.

## Grading on demand

Reading and grading on the platform is enough for a short deliverable. For a longer one, or to grade with the AI in a session:

1. `node deliverables/scripts/export-submissions.js <id> [--out <folder>] [--clone]` writes `entrega.md` (the deliverable), one `<student>.md` per submission (answers or link, save time, lateness, typing signals) and `reviews.json`, a template with one object per student to fill with `score` and `comment`. The default folder is `deliverables/exports/<date>_<title>/`, ignored by git because it holds student work; for the course's records pass `--out` with a folder outside the repo, such as `Estudiantes/<period>/Actividades/<deliverable>/`. With `--clone` on a `repo` deliverable, every link is cloned (branch links included, with `GIT_LFS_SKIP_SMUDGE=1`) into `repos/<student>/`, and `<student>.commits.md` holds the whole log with stats and, per commit, the diff of the text files (`.wwu`, `.ini`, `.md`…): what "did they follow the guide commit by commit" is answered from.
2. Grade: fill `score` and `comment` in `reviews.json`, with the rubric of the teacher's guide at hand.
3. `node deliverables/scripts/import-reviews.js <id> <folder>/reviews.json --by <teacher uid> [--dry-run]` writes the reviews. Objects with no score and no comment are skipped; a score out of range stops the import. `--dry-run` only prints.

Both scripts use the service account of `.env.local` (`FIREBASE_SERVICE_ACCOUNT`, see [exam.md](exam.md)), so they bypass the rules: check the JSON before importing.

## Setup (once)

1. Firestore → Rules: paste `firebase/firestore.rules` and publish. Until then the teacher's lists show "could not be loaded" for the deliverable sections and the course page simply shows no deliverable cards.
2. Push with `[deploy]`: the new routes only exist on a deployment that includes them.

## Verifying changes

- `npx tsc --noEmit` for any edit; `npm run build` when routes change.
- Teacher: `http://localhost:3000/teacher/homeworks` → New deliverable homework, text kind with two questions and a close later today, Save draft, Open. A second one for two ticked students only: a third, enrolled student must not see its card, and the teacher's table must list the two with "Nothing saved". `http://localhost:3000/teacher/exam` → New deliverable exam, repo kind, a few minutes, Open: it must appear under `/course/wwise-unreal/exams` for a student.
- Student (another account, another browser): `http://localhost:3000/course/wwise-unreal` shows the cards; open the text one, try to paste (refused, counted), type, wait a minute (saved by itself), reload (the draft and the signals survive), change the close from the teacher's page to now: the fields lock within seconds, and a save made after the grace shows as late on both sides. The repo one must refuse a bitbucket.org link and accept a GitLab branch link.
- Teacher: the submissions table, a submission with its signals and timeline, Save review; the student sees the score on the card, on the page and in `http://localhost:3000/course/wwise-unreal/history`, whose five sections must also show the multiple option exams and homeworks. `http://localhost:3000/teacher/student/<uid>` has the same five sections.
- Scripts: `node deliverables/scripts/export-submissions.js <id>` then `node deliverables/scripts/import-reviews.js <id> deliverables/exports/<folder>/reviews.json --by <uid> --dry-run`.
