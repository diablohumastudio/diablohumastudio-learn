import dynamic from 'next/dynamic';
import Head from 'next/head';
import type { ReactNode } from 'react';
import { quizDict } from '../../i18n/pages/quiz';
import { useT } from '../../i18n/useT';
import LanguageSwitch from '../LanguageSwitch';
import { LEARN_FONT_VARS } from '../learn/fonts';
import s from './QuizLayout.module.css';

// Firebase only runs in the browser; the header shows the user without SSR.
const UserMenu = dynamic(() => import('./UserMenu'), { ssr: false });

export default function QuizLayout({ children }: { children: ReactNode }) {
  const t = useT(quizDict);

  return (
    <div className={`${s.shell} ${LEARN_FONT_VARS}`}>
      <Head>
        <title>{t.pageTitle}</title>
        {/* Unlisted section: reachable only by direct link. */}
        <meta name="robots" content="noindex, nofollow" />
        <meta name="theme-color" content="#14161a" />
      </Head>
      <header className={s.header}>
        <span className={s.led} />
        <span className={s.brand}>{t.brand}</span>
        <span className={s.spacer} />
        <UserMenu />
        <LanguageSwitch className={s.languageSwitch} />
      </header>
      <main className={s.main}>{children}</main>
    </div>
  );
}
