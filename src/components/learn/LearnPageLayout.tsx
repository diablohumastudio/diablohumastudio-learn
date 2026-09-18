import Head from 'next/head';
import type { ReactNode } from 'react';
import { learnDict } from '../../i18n/learn';
import { useT } from '../../i18n/useT';
import { LEARN_FONT_VARS } from './fonts';
import LearnHeader from './LearnHeader';
import s from './LearnPageLayout.module.css';

/** Scrolling column for the section's menus, practice and teacher pages; the decks use LearnLayout. */
type LearnPageLayoutProps = {
  /** Page-specific header controls, placed after the brand. */
  headerCenter?: ReactNode;
  children: ReactNode;
};

export default function LearnPageLayout({ headerCenter, children }: LearnPageLayoutProps) {
  const t = useT(learnDict);

  return (
    <div className={`${s.shell} ${LEARN_FONT_VARS}`}>
      <Head>
        <title>{t.pageTitle}</title>
        {/* Unlisted section: reachable only by direct link. */}
        <meta name="robots" content="noindex, nofollow" />
        <meta name="theme-color" content="#14161a" />
      </Head>
      <LearnHeader center={headerCenter} />
      <main className={s.main}>{children}</main>
    </div>
  );
}
