import type { ExamAnswers, ExamOption, ExamQuestion } from '../../data/exam/types';
import { examDict } from '../../i18n/pages/exam';
import { useLocale, useT } from '../../i18n/useT';
import s from './AttemptReplay.module.css';

type AttemptReplayProps = {
  questions: ExamQuestion[];
  answers: ExamAnswers;
  /** Question id → correct option id. */
  correctOptionIds: Record<string, string>;
};

/** The attempt exactly as the student saw it: same questions, same option order, their picks. */
export default function AttemptReplay({ questions, answers, correctOptionIds }: AttemptReplayProps) {
  const t = useT(examDict);
  const locale = useLocale();

  function optionClassName(question: ExamQuestion, option: ExamOption): string {
    if (option.id === correctOptionIds[question.id]) return `${s.option} ${s.optionCorrect}`;
    if (option.id === answers[question.id]) return `${s.option} ${s.optionWrong}`;
    return s.option;
  }

  return (
    <ol className={s.list}>
      {questions.map((question, index) => (
        <li key={question.id} className={s.card}>
          <div className={s.meta}>
            <span className={s.number}>{index + 1}</span>
            <span className={s.id}>{question.id}</span>
            {!(question.id in answers) && <span className={s.unanswered}>{t.notAnswered}</span>}
          </div>
          <p className={s.prompt}>{question.prompt[locale]}</p>
          <ul className={s.options}>
            {question.options.map((option) => (
              <li key={option.id} className={optionClassName(question, option)}>
                <span>{option.text[locale]}</span>
                <span className={s.tags}>
                  {option.id === answers[question.id] && <span className={s.tag}>{t.yourAnswer}</span>}
                  {option.id === correctOptionIds[question.id] && <span className={s.tag}>{t.correctAnswer}</span>}
                </span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
