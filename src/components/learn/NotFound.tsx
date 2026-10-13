import Link from 'next/link';
import { COURSES_PATH } from '../../data/learn';
import { learnDict } from '../../i18n/learn';
import { useT } from '../../i18n/useT';
import s from './LearnMenu.module.css';

export default function NotFound() {
  const t = useT(learnDict);
  return (
    <div className={s.missing}>
      <p>{t.pageNotFound}</p>
      <Link href={COURSES_PATH}>{t.goToMenu}</Link>
    </div>
  );
}
