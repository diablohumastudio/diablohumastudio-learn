import type { User } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  LEARN_BASE_PATH,
  coursePath,
  findCourse,
  homeworkPlayPath,
  practicePlayPath,
  practiceScope,
  querySlug,
} from '../../data/learn';
import type { LearnCourse, PracticeScope } from '../../data/learn';
import { dayKey, dayText, findRound, isHomeworkOpen, questionsInScope, questionsWithIds } from '../../data/practice';
import type { Homework, RoundOfHomework } from '../../data/practice';
import { practiceDict } from '../../i18n/pages/practice';
import { useLocale, useT } from '../../i18n/useT';
import { isFirebaseConfigured } from '../../lib/firebase';
import SignInRedirect from '../learn/SignInRedirect';
import ui from '../learn/ui.module.css';
import { useAuthUser } from '../learn/useAuthUser';
import { fetchHomework } from './homeworks';
import Player from './Player';
import { ensureStudentProfile, isPermissionDenied } from './progress';
import { activeQuestions, useQuestionBank } from './questions';

type HomeworkLoad = { status: 'loading' } | { status: 'failed' } | { status: 'loaded'; homework: Homework | null };

type CourseNoticeProps = {
  course: LearnCourse;
  message: string;
};

/** A message in place of the player, with the way back to the course. */
function CourseNotice({ course, message }: CourseNoticeProps) {
  const t = useT(practiceDict);
  return (
    <div className={ui.centered}>
      <p className={ui.mono}>{message}</p>
      <Link href={coursePath(course)} className={ui.btn}>
        ← {t.backToCourse}
      </Link>
    </div>
  );
}

type StudentAreaProps = {
  user: User;
  course: LearnCourse;
  scope: PracticeScope;
  /** Set when a round of a specific homework is played: only its questions, counted apart from the daily homework. */
  playedRound: RoundOfHomework | null;
};

function StudentArea({ user, course, scope, playedRound }: StudentAreaProps) {
  const t = useT(practiceDict);
  const bank = useQuestionBank();

  useEffect(() => {
    ensureStudentProfile(user).catch((error) => console.error('Could not save the student profile', error));
  }, [user]);

  if (bank.status === 'loading') {
    return (
      <div className={ui.centered}>
        <span className={ui.mono}>{t.loading}</span>
      </div>
    );
  }
  // The rules refuse the bank to every non-teacher while an exam runs (firebase/firestore.rules).
  if (bank.status === 'error' && isPermissionDenied(bank.error)) {
    return (
      <div className={ui.centered}>
        <p className={ui.notice}>{t.pausedForExam}</p>
      </div>
    );
  }
  if (bank.status === 'error') {
    console.error('Could not load the questions', bank.error);
    return (
      <div className={ui.centered}>
        <p className={ui.error}>{t.bankLoadError}</p>
      </div>
    );
  }

  const scopedQuestions = playedRound
    ? questionsWithIds(activeQuestions(bank), playedRound.round.questionIds)
    : questionsInScope(activeQuestions(bank), scope);
  if (scopedQuestions.length === 0) {
    return <CourseNotice course={course} message={t.noQuestions} />;
  }
  return (
    <Player
      // Each round is a session of its own: the next one starts with an empty run.
      key={playedRound?.round.id}
      uid={user.uid}
      questions={scopedQuestions}
      courseSlug={course.slug}
      playedRound={playedRound}
      stopHref={coursePath(course)}
    />
  );
}

type HomeworkAreaProps = {
  user: User;
  course: LearnCourse;
  homeworkId: string;
  /** The round the link names, if it names one. */
  roundId: string | undefined;
};

/** Loads the homework the link names and lets one of its rounds be played, only on its days. */
function HomeworkArea({ user, course, homeworkId, roundId }: HomeworkAreaProps) {
  const t = useT(practiceDict);
  const locale = useLocale();
  const [load, setLoad] = useState<HomeworkLoad>({ status: 'loading' });

  useEffect(() => {
    let isCurrent = true;
    fetchHomework(homeworkId)
      .then((homework) => {
        if (isCurrent) setLoad({ status: 'loaded', homework });
      })
      .catch((error) => {
        console.error('Could not load the homework', error);
        if (isCurrent) setLoad({ status: 'failed' });
      });
    return () => {
      isCurrent = false;
    };
  }, [homeworkId]);

  if (load.status === 'loading') {
    return (
      <div className={ui.centered}>
        <span className={ui.mono}>{t.loading}</span>
      </div>
    );
  }
  if (load.status === 'failed') {
    return (
      <div className={ui.centered}>
        <p className={ui.error}>{t.errorGeneric}</p>
      </div>
    );
  }
  const { homework } = load;
  const round = homework ? findRound(homework, roundId) : undefined;
  // A round the teacher removed leaves old links behind: they are as stale as a deleted homework's.
  if (!homework || !round || homework.courseSlug !== course.slug) {
    return <CourseNotice course={course} message={t.homeworkNotFound} />;
  }
  if (!isHomeworkOpen(homework, dayKey(new Date()))) {
    return (
      <CourseNotice
        course={course}
        message={t.homeworkNotOpen
          .replace('{first}', dayText(homework.firstDay, locale))
          .replace('{last}', dayText(homework.lastDay, locale))}
      />
    );
  }
  return (
    <StudentArea user={user} course={course} scope={{ courseSlug: course.slug }} playedRound={{ homework, round }} />
  );
}

export default function PracticeApp() {
  const t = useT(practiceDict);
  const router = useRouter();
  const auth = useAuthUser();
  const scope = practiceScope(querySlug(router.query.course), querySlug(router.query.class));
  const homeworkId = querySlug(router.query.homework);
  const roundId = querySlug(router.query.round);
  const course = findCourse(scope.courseSlug);
  const isCourseMissing = router.isReady && !course;

  // Practice never mixes courses: a link without a known course goes back to the course menu.
  useEffect(() => {
    if (isCourseMissing) router.replace(LEARN_BASE_PATH);
  }, [isCourseMissing, router]);

  if (!isFirebaseConfigured()) {
    return (
      <div className={ui.centered}>
        <p className={ui.error}>{t.notConfigured}</p>
      </div>
    );
  }
  // The scope lives in the query string, which a static page only knows once the router is ready.
  if (auth.status === 'loading' || !course) {
    return (
      <div className={ui.centered}>
        <span className={ui.mono}>{t.loading}</span>
      </div>
    );
  }
  if (auth.status === 'signedOut') {
    return <SignInRedirect />;
  }

  if (homeworkId) {
    return (
      <HomeworkArea
        key={homeworkPlayPath(course.slug, homeworkId)}
        user={auth.user}
        course={course}
        homeworkId={homeworkId}
        roundId={roundId}
      />
    );
  }
  // Keyed by scope so a session never mixes the questions of two scopes.
  return (
    <StudentArea key={practicePlayPath(scope)} user={auth.user} course={course} scope={scope} playedRound={null} />
  );
}
