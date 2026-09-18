import dynamic from 'next/dynamic';
import Head from 'next/head';
import type { ReactElement } from 'react';
import LearnPageLayout from '../../../components/learn/LearnPageLayout';
import { practiceDict } from '../../../i18n/pages/practice';
import { useT } from '../../../i18n/useT';
import type { NextPageWithLayout } from '../../_app';

// Firebase is browser-only: the app is skipped on the server and its bundle
// is downloaded only by the practice routes.
const PracticeApp = dynamic(() => import('../../../components/practice/PracticeApp'), { ssr: false });

const PracticePage: NextPageWithLayout = () => {
  const t = useT(practiceDict);
  return (
    <>
      <Head>
        <title>{t.pageTitle}</title>
      </Head>
      <PracticeApp screen="home" />
    </>
  );
};

PracticePage.getLayout = (page: ReactElement) => <LearnPageLayout>{page}</LearnPageLayout>;

export default PracticePage;
