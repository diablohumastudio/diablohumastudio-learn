# Courses: Enrollment and Access Requests

Signing in creates an **account**, not a place in a course. A course has **members**, the students enrolled in it, and only they practice it, do its homeworks, take its exams, hand in its deliverables and see their history in it. An account that is not enrolled sees the course's classes as a guest does (the slides stay reachable by link, as before: closing them too is a small later change, planned for when a payment gateway arrives) and, in place of the homework cards, a card to **request access**; the teacher accepts the request, or enrolls the account directly, from **Enrollment** in the teacher menu. A payment gateway would enroll by writing the same member document from the server. Spanish: *Inscripciones*, *inscrito*, *solicitar acceso*.

## What the teacher and the student see

1. A student signs in and opens `/course/<course>`. Not enrolled: the card "Access to the course" with **Request access**. After pressing it: "Your request was sent". Practice, the exams list, an exam room, a deliverable and the history of that course answer "Your account is not enrolled in this course" with the way back to the course page, whatever the link used.
2. The teacher opens `/teacher/enrollment`, picks the course and sees **Pending requests** (Accept enrolls the account and closes the request; Reject only closes it, so the student may ask again), **Enrolled students** (with Remove, which keeps their saved work and hides the course from them) and **Enroll a registered account**: a dropdown of every account that signed in at least once and is not enrolled here, and the button **Enroll all registered accounts**, with confirmation. That button is the migration of a course whose every account belongs to it: press it once for `wwise-unreal` and nobody has to ask.
3. Once enrolled, the student's course page shows the daily homework card with their progress and, under it, the **Homeworks** and **Exams** cards: what is open right now, one entry per item split by lines (a specific homework with its meter and days, a running multiple option exam, a deliverable with its saved state), and a button to everything, **Show all homeworks** (`/course/<course>/homeworks`: the open ones, then the finished ones) and **Show all exams** (`/course/<course>/exams`). A finished homework or exam leaves the course page at once; it stays on those pages and in the history.

Teachers are members of every course: `useMembership` says so without reading anything, and the rules let them through everywhere. Teachers are not tied to courses yet; `TODO.md` holds the plan for a teacher menu per course.

## How it is wired

| Piece | Files | Role |
|---|---|---|
| Model | `src/data/course/types.ts` | Collection names, `CourseMember`, `AccessRequest`, `MembershipStatus` |
| Browser data | `src/components/course/members.ts` | Firestore reads and writes: membership and own request (student), members and requests (teacher), enroll, remove, reject, enroll all |
| Membership hook | `src/components/course/useMembership.ts` | `useMembership(courseSlug)`: loading, signed out, member, requested or not a member; a teacher is a member |
| Members hook | `src/components/course/useCourseMembers.ts` | Teacher only: the members of a course, live, and their uids as a set |
| Student | `CourseAccess.tsx`, `CourseAccessCard.tsx`, `NotEnrolledNotice.tsx` | The dynamic part of the course page (the access card, or the two cards below) and the notice the gated pages show |
| Course page cards | `EnrolledCards.tsx`, `HomeworksCard.tsx`, `ExamsCard.tsx`, `EntriesCard.tsx`, `entries.tsx` | The Homeworks and Exams cards of a member: the open specific homeworks (`practice/HomeworkEntry.tsx`), multiple option exams (`exam/ExamEntry.tsx`) and deliverables (`deliverable/DeliverableEntry.tsx`) as entries split by lines, with the Show all button; `practice/HomeworkList.tsx` is the homeworks page it leads to, with the same entries in two cards, open and finished |
| Teacher | `EnrollmentManager.tsx`, `src/pages/teacher/enrollment.tsx` | The Enrollment page |
| Gates | `CourseProgressLoader.tsx`, `PracticeApp.tsx`, `ExamList.tsx`, `ExamApp.tsx`, `DeliverableApp.tsx`, `HomeworkList.tsx`, `StudentHistory.tsx` | Each checks the membership before loading or showing anything |
| Teacher lists | `TeacherBoard.tsx` (`CoursePeriod` with `membersOnly`), `StudentReview.tsx`, `HomeworkManager.tsx` | The board and a homework's progress count the enrolled students of the course; the review lists the accounts enrolled in at least one course |
| Assignment | `src/data/course/assignment.ts`, `src/components/course/assignedQuery.ts`, `StudentPicker.tsx` | Who a homework, an exam or a deliverable is for (below): the two stored fields and their helpers, the two-query read a student's list needs, and the teacher's picker |
| Rules | `firebase/firestore.rules` | `isMember()`, `isAssignedTo()`, the `courses` block, and the reads of homeworks, exams and deliverables |
| Migration | `firebase/scripts/add-assignment-fields.js` | One-off: gives the documents saved before the assignment fields existed their `forEveryone` and `assignedUids` |
| Texts | `src/i18n/pages/course.ts` | UI strings in both languages, the picker's included |

The course page keeps Firebase out of the guest's download, as before: `ClassList` renders `CourseProgress` (buttons for everybody, progress for members) and loads `CourseAccess` with `next/dynamic` and `ssr: false`, like the progress loader; the Homeworks and Exams cards live inside it, so guests never download them either.

## Firestore data model

```
courses/{courseSlug}/members/{uid}
  displayName, email, joinedAt, grantedBy     grantedBy: the teacher's uid, or 'enroll-all'

courses/{courseSlug}/requests/{uid}
  displayName, email, requestedAt
```

The course document itself never exists: Firestore keeps subcollections without a parent, and the courses are the entries of `LEARN_COURSES` in `src/data/learn.ts`.

Rules in short: `isMember(courseSlug)` is `exists(courses/<course>/members/<uid>)`. A student reads only their own member and request documents and creates their own request; teachers read and write both. `homeworks`, `exams` (once opened) and `deliverables` (once opened) are read by the students they are for, `isAssignedTo(resource.data)`: a member of the course who is among the assigned (below); a submission can only be created or updated by someone the deliverable is for ([deliverables.md](deliverables.md)). The question bank stays readable by every signed-in account (its questions are not tied to one course); practice is gated in the page.

## Who a homework, an exam or a deliverable is for

Each of the three is for **everybody enrolled in its course** by default, or for the students the teacher ticks in the form (`StudentPicker`: a tick for everybody, or a searchable list of the enrolled; changing the course starts over with everybody). It is stored as two fields, `assignedUids` (empty for everybody) and `forEveryone` (true exactly when that list is empty), because a student's list query has to ask for one or the other by equality for the rules to check it. `src/data/course/assignment.ts` holds the `Assignment` type and the helpers that read, store and test it (`assignmentOf`, `storedAssignment`, `isAssignedTo`, `assignedAccounts`); `isHomeworkFor`, `isExamFor` and `isDeliverableFor` are the same test with the right name.

What the assignment changes:

- The student's lists and cards show only what is for them; the homework play screen, the exam room and the deliverable page refuse the rest (the rules refuse the read, which the pages show as "does not exist"). For exams, the `start` API route checks it too, since the rules do not cover the API (`requireExaminee` in `src/lib/examApi.ts`; teachers may start any exam).
- The teacher's opened exam lists the assigned students who have not started as "Not started", the opened deliverable lists them as "Nothing saved", and a homework's progress counts the assigned students instead of every member.
- A document saved before the two fields existed is **for everybody**: the rules read `forEveryone` with `true` as the default, and the browser treats a missing list as empty. But a student's list query asks for `forEveryone == true`, which a missing field does not match, so those documents need the fields written once: `node firebase/scripts/add-assignment-fields.js --dry-run` lists them, and without `--dry-run` writes `forEveryone: true, assignedUids: []` on every homework, exam and deliverable that lacks them. Run it once after publishing the rules that name `isAssignedTo`.

**Queries must say the course and the assignment.** A rule that reads `resource.data.courseSlug` can only be checked against a list query that filters `courseSlug` by equality, and one that reads `forEveryone` or `assignedUids` against a query that filters one of them, so every student query names its course and splits in two, `forEveryone == true` and `assignedUids array-contains uid`, merged by `subscribeAssignedTo` or `fetchAssignedTo` (`src/components/course/assignedQuery.ts`): `fetchStudentHomeworks(courseSlug, uid)`, `subscribeStudentExams(courseSlug, uid)` (also `status == 'opened'`) and `subscribeStudentDeliverables(courseSlug, uid)`. A query without the course or without the split is refused by the rules even for an enrolled student. If Firestore ever asks for a composite index for one of these queries, the error in the console carries the link to create it.

## Setup

1. Firestore → Rules: paste `firebase/firestore.rules` and publish. Until then nobody is a member: the course page shows the access card to every student and the teacher's lists are empty.
2. Open `/teacher/enrollment` and press **Enroll all registered accounts** for the current course, or accept the requests as they arrive.

## Verifying changes

- `npx tsc --noEmit` for any edit; `npm run build` when routes change.
- Student account, not enrolled: `http://localhost:3000/course/wwise-unreal` shows the access card; Request access; `/practice/play?course=wwise-unreal`, `/course/wwise-unreal/exams`, `/course/wwise-unreal/homeworks` and `/course/wwise-unreal/history` show the not-enrolled notice.
- Teacher: `http://localhost:3000/teacher/enrollment` lists the request; Accept. The student's course page now shows the daily homework card and the Homeworks and Exams cards (reload). Remove the student: the access card is back.
- Teacher: `http://localhost:3000/teacher/students-practice-info` and `/teacher/student` list only the enrolled accounts.
