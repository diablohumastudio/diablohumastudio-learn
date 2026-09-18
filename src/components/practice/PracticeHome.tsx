import type { User } from 'firebase/auth';
import Link from 'next/link';
import { practicePath, practicePlayPath } from '../../data/learn';
import type { PracticeScope } from '../../data/learn';
import { questionsInScope } from '../../data/practice';
import type { PracticeQuestion } from '../../data/practice';
import { practiceDict } from '../../i18n/pages/practice';
import { useT } from '../../i18n/useT';
import ui from '../learn/ui.module.css';
import { percentText } from './format';
import type { StudentStats } from './progress';
import s from './PracticeHome.module.css';
import PracticeScopeSelect from './PracticeScopeSelect';

type PracticeHomeProps = {
  user: User;
  stats: StudentStats | null;
  questions: PracticeQuestion[];
  scope: PracticeScope;
};

export default function PracticeHome({ user, stats, questions, scope }: PracticeHomeProps) {
  const t = useT(practiceDict);
  const sessionsPlayed = stats?.sessionsPlayed ?? 0;
  const totalAnswered = stats?.totalAnswered ?? 0;
  const totalCorrect = stats?.totalCorrect ?? 0;
  const scopeSize = questionsInScope(questions, scope).length;
  const scopeIsEmpty = scopeSize === 0;

  return (
    <div className={s.wrap}>
      <div className={s.heading}>
        <span className={ui.eyebrow}>{t.brand}</span>
        <h1 className={ui.title}>
          {t.greeting}, {user.displayName || user.email}
        </h1>
      </div>
      <label className={s.scope}>
        <span className={ui.label}>{t.scopeLabel}</span>
        <PracticeScopeSelect className={s.scopeSelect} questions={questions} pathOf={practicePath} />
      </label>
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
          <span className={ui.mono}>{scopeIsEmpty ? t.noQuestions : `${scopeSize} ${t.bankSize}`}</span>
          {scopeIsEmpty ? (
            <span className={s.playDisabled} aria-disabled="true">
              {t.play} →
            </span>
          ) : (
            <Link href={practicePlayPath(scope)} className={s.play}>
              {t.play} →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
