import { useEffect, useState } from 'react';
import { drawQuestions, toPaperQuestion, withAnswerIds } from '../../data/exam/paper';
import type { ExamAnswers, ExamQuestion, PaperQuestion } from '../../data/exam/types';
import type { PracticeQuestion } from '../../data/practice';
import { examDict } from '../../i18n/pages/exam';
import { useT } from '../../i18n/useT';
import ui from '../learn/ui.module.css';
import AttemptReplay from './AttemptReplay';
import app from './ExamApp.module.css';
import ExamTaker from './ExamTaker';

const MS_PER_MINUTE: number = 60_000;
const CLOCK_TICK_MS: number = 1000;

type ExamPreviewProps = {
  title: string;
  /** The questions ticked in the draft, as the form holds them now: saved or not. */
  questions: readonly PracticeQuestion[];
  maxQuestions: number;
  durationMinutes: number;
  onClose: () => void;
};

type PreviewRun = {
  paper: PaperQuestion[];
  questions: ExamQuestion[];
  endsAtMs: number;
};

function newRun(questions: readonly PracticeQuestion[], maxQuestions: number, durationMinutes: number): PreviewRun {
  const paper = questions.map((question) => toPaperQuestion(withAnswerIds(question).question));
  return {
    paper,
    questions: drawQuestions(paper, maxQuestions),
    endsAtMs: Date.now() + durationMinutes * MS_PER_MINUTE,
  };
}

/** The exam as one student would get it, built in the browser with the API's own code.
    Nothing is saved: no attempt, no grade, and the draft is not opened. */
export default function ExamPreview({ title, questions, maxQuestions, durationMinutes, onClose }: ExamPreviewProps) {
  const t = useT(examDict);
  const [run, setRun] = useState<PreviewRun>(() => newRun(questions, maxQuestions, durationMinutes));
  const [answers, setAnswers] = useState<ExamAnswers>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const clock = window.setInterval(() => setNowMs(Date.now()), CLOCK_TICK_MS);
    return () => window.clearInterval(clock);
  }, []);

  // The real exam stops taking answers when the clock ends; the preview shows the result then.
  const isOver = isSubmitted || nowMs >= run.endsAtMs;

  function restart() {
    setRun(newRun(questions, maxQuestions, durationMinutes));
    setAnswers({});
    setIsSubmitted(false);
    setNowMs(Date.now());
  }

  if (!isOver) {
    return (
      <div className={app.wrap}>
        <button type="button" className={ui.btnGhost} onClick={onClose}>
          ← {t.previewBack}
        </button>
        <p className={ui.notice}>{t.previewNotice}</p>
        <ExamTaker
          title={title}
          questions={run.questions}
          answers={answers}
          remainingMs={run.endsAtMs - nowMs}
          onSelect={(questionId, optionId) => setAnswers({ ...answers, [questionId]: optionId })}
          onSubmit={() => setIsSubmitted(true)}
        />
      </div>
    );
  }

  const correctOptionIds: Record<string, string> = {};
  for (const question of run.paper) correctOptionIds[question.id] = question.correctOptionId;
  const score = run.questions.filter((question) => answers[question.id] === correctOptionIds[question.id]).length;

  return (
    <div className={app.wrap}>
      <button type="button" className={ui.btnGhost} onClick={onClose}>
        ← {t.previewBack}
      </button>
      <p className={ui.notice}>{t.previewResultNotice}</p>
      <div className={app.card}>
        <span className={ui.eyebrow}>{title}</span>
        <h1 className={ui.title}>{t.resultTitle}</h1>
        <span className={app.score}>
          {score} / {run.questions.length}
        </span>
        <button type="button" className={ui.btn} onClick={restart}>
          {t.previewAgain}
        </button>
      </div>
      <AttemptReplay questions={run.questions} answers={answers} correctOptionIds={correctOptionIds} />
    </div>
  );
}
