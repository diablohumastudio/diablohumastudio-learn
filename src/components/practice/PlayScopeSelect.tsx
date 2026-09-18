import { useRouter } from 'next/router';
import { practicePlayPath } from '../../data/learn';
import { practiceDict } from '../../i18n/pages/practice';
import { useT } from '../../i18n/useT';
import h from '../learn/LearnHeader.module.css';
import PracticeScopeSelect from './PracticeScopeSelect';

/** Header control of the play screen: switches what is being practiced without leaving it. */
export default function PlayScopeSelect() {
  const t = useT(practiceDict);
  const router = useRouter();

  // The scope comes from the query string, which a static page only knows once the router is ready.
  if (!router.isReady) return null;

  return (
    <label className={h.selectGroup}>
      <span className={h.selectLabel}>{t.brand}</span>
      <PracticeScopeSelect className={h.select} pathOf={practicePlayPath} />
    </label>
  );
}
