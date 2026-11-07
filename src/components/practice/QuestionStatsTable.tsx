import { questionTopicTitle } from '../../data/practice';
import type { PracticeQuestion } from '../../data/practice';
import { practiceDict } from '../../i18n/pages/practice';
import { useLocale, useT } from '../../i18n/useT';
import ui from '../learn/ui.module.css';
import { percentText } from './format';
import type { QuestionStats } from './progress';
import s from './QuestionStatsTable.module.css';
import { useQuestionBank } from './questions';

type QuestionStatsTableProps = {
  /** One student's attempts per question, most attempted first; null while they load. */
  stats: QuestionStats[] | null;
};

export function byAttemptsDesc(a: QuestionStats, b: QuestionStats): number {
  return b.attempts - a.attempts;
}

function questionsById(bank: ReturnType<typeof useQuestionBank>): Map<string, PracticeQuestion> {
  if (bank.status !== 'ready') return new Map();
  return new Map(bank.questions.map((question) => [question.id, question]));
}

/** Every question one student answered: attempts, right answers, accuracy and the last result. */
export default function QuestionStatsTable({ stats }: QuestionStatsTableProps) {
  const t = useT(practiceDict);
  const locale = useLocale();
  const bank = useQuestionBank();
  const bankById = questionsById(bank);

  return (
    <div className={s.card}>
      {stats === null || bank.status === 'loading' ? (
        <p className={s.empty}>{t.loading}</p>
      ) : stats.length === 0 ? (
        <p className={s.empty}>{t.noAnswersYet}</p>
      ) : (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>{t.colQuestion}</th>
                <th>{t.colTopic}</th>
                <th className={ui.num}>{t.colAttempts}</th>
                <th className={ui.num}>{t.colCorrect}</th>
                <th className={ui.num}>{t.colAccuracy}</th>
                <th>{t.colLastResult}</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((questionStats) => {
                const question = bankById.get(questionStats.questionId);
                return (
                  <tr key={questionStats.questionId}>
                    <td>
                      {question ? question.prompt[locale] : `${t.unknownQuestion} (${questionStats.questionId})`}
                    </td>
                    <td>{question ? questionTopicTitle(question, locale) ?? '' : ''}</td>
                    <td className={ui.num}>{questionStats.attempts}</td>
                    <td className={ui.num}>{questionStats.correct}</td>
                    <td className={ui.num}>{percentText(questionStats.correct, questionStats.attempts)}</td>
                    <td className={questionStats.lastCorrect ? s.right : s.wrong}>
                      {questionStats.lastCorrect ? t.resultRight : t.resultWrong}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
