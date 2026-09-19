import { useState } from 'react';
import type { ExamAnswers, ExamQuestion } from '../../data/exam/types';
import { examDict } from '../../i18n/pages/exam';
import { useLocale, useT } from '../../i18n/useT';
import ConfirmPanel from './ConfirmPanel';
import s from './ExamTaker.module.css';
import { countdownText } from './format';

const LAST_MINUTE_MS: number = 60_000;

type ExamTakerProps = {
  title: string;
  questions: ExamQuestion[];
  answers: ExamAnswers;
  remainingMs: number;
  onSelect: (questionId: string, optionId: string) => void;
  onSubmit: () => void;
};

/** Every question on one page. Picking an option only selects it: nothing is final until Submit. */
export default function ExamTaker({ title, questions, answers, remainingMs, onSelect, onSubmit }: ExamTakerProps) {
  const t = useT(examDict);
  const locale = useLocale();
  const [confirming, setConfirming] = useState(false);
  const answeredCount = questions.filter((question) => question.id in answers).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className={s.wrap}>
      <div className={s.bar}>
        <span className={s.barTitle}>{title}</span>
        <div className={s.barItem}>
          <span className={s.barLabel}>{t.answered}</span>
          <span className={s.barValue}>
            {answeredCount}/{questions.length}
          </span>
        </div>
        <div className={s.barItem}>
          <span className={s.barLabel}>{t.timeLeft}</span>
          <span className={remainingMs <= LAST_MINUTE_MS ? `${s.barValue} ${s.barValueUrgent}` : s.barValue} role="timer">
            {countdownText(remainingMs)}
          </span>
        </div>
      </div>

      <ol className={s.list}>
        {questions.map((question, index) => (
          <li key={question.id} className={s.card}>
            <span className={s.number}>
              {index + 1} / {questions.length}
            </span>
            <p className={s.prompt}>{question.prompt[locale]}</p>
            <div className={s.options} role="radiogroup" aria-label={question.prompt[locale]}>
              {question.options.map((option) => {
                const selected = answers[question.id] === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    className={selected ? `${s.option} ${s.optionSelected}` : s.option}
                    onClick={() => onSelect(question.id, option.id)}
                  >
                    <span className={s.mark} aria-hidden="true" />
                    {option.text[locale]}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ol>

      {confirming ? (
        <ConfirmPanel
          message={t.confirmSubmit}
          detail={unansweredCount > 0 ? `${t.unansweredWarning} ${unansweredCount}` : undefined}
          confirmLabel={t.confirmSubmitButton}
          onConfirm={onSubmit}
          onCancel={() => setConfirming(false)}
        />
      ) : (
        <button type="button" className={s.submit} onClick={() => setConfirming(true)}>
          {t.submit}
        </button>
      )}
    </div>
  );
}
