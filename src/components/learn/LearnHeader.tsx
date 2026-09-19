import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { LEARN_BASE_PATH } from '../../data/learn';
import { learnDict } from '../../i18n/learn';
import { useT } from '../../i18n/useT';
import s from './LearnHeader.module.css';

// Firebase only runs in the browser; the header shows the account menu without SSR.
const AccountMenu = dynamic(() => import('./AccountMenu'), { ssr: false });

type LearnHeaderProps = {
  /** Page-specific controls placed after the brand (e.g. the course and class selects). */
  center?: ReactNode;
};

export default function LearnHeader({ center }: LearnHeaderProps) {
  const t = useT(learnDict);

  return (
    <header className={s.header}>
      <Link href={LEARN_BASE_PATH} className={s.brand}>
        <span className={s.led} />
        {t.brand}
      </Link>
      {center}
      <span className={s.spacer} />
      <AccountMenu />
    </header>
  );
}
