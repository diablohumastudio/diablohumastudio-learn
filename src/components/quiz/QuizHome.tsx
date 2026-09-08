import type { User } from 'firebase/auth';
import { QUIZ_QUESTIONS } from '../../data/quiz';
import { quizDict } from '../../i18n/pages/quiz';
import { useT } from '../../i18n/useT';
import { percentText } from './format';
import type { StudentStats } from './progress';
import s from './QuizHome.module.css';
import ui from './ui.module.css';

type QuizHomeProps = {
  user: User;
  stats: StudentStats | null;
  onPlay: () => void;
};

export default function QuizHome({ user, stats, onPlay }: QuizHomeProps) {
  const t = useT(quizDict);
  const sessionsPlayed = stats?.sessionsPlayed ?? 0;
  const totalAnswered = stats?.totalAnswered ?? 0;
  const totalCorrect = stats?.totalCorrect ?? 0;
  const bankIsEmpty = QUIZ_QUESTIONS.length === 0;

  return (
    <div className={s.wrap}>
      <div className={s.heading}>
        <span className={ui.eyebrow}>{t.brand}</span>
        <h1 className={ui.title}>
          {t.greeting}, {user.displayName || user.email}
        </h1>
      </div>
      <div className={s.card}>
        <div className={ui.stats}>
          <div className={ui.stat}>
            <span className={ui.statValue}>{sessionsPlayed}</span>
            <span className={ui.statLabel}>{t.statSessions}</span>
          </div>
          <div className={ui.stat}>
            <span className={ui.statValue}>{totalAnswered}</span>
            <span className={ui.statLabel}>{t.statAnswered}</span>
          </div>
          <div className={ui.stat}>
            <span className={ui.statValue}>{totalCorrect}</span>
            <span className={ui.statLabel}>{t.statCorrect}</span>
          </div>
          <div className={ui.stat}>
            <span className={ui.statValue}>{percentText(totalCorrect, totalAnswered)}</span>
            <span className={ui.statLabel}>{t.statAccuracy}</span>
          </div>
        </div>
        <div className={s.actions}>
          <span className={ui.mono}>
            {bankIsEmpty ? t.noQuestions : `${QUIZ_QUESTIONS.length} ${t.bankSize}`}
          </span>
          <button type="button" className={s.play} onClick={onPlay} disabled={bankIsEmpty}>
            {t.play} →
          </button>
        </div>
      </div>
    </div>
  );
}
