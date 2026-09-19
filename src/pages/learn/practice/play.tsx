import dynamic from 'next/dynamic';
import Head from 'next/head';
import type { ReactElement } from 'react';
import LearnPageLayout from '../../../components/learn/LearnPageLayout';
import { practiceDict } from '../../../i18n/pages/practice';
import { useT } from '../../../i18n/useT';
import type { NextPageWithLayout } from '../../_app';

const PlayScopeSelect = dynamic(() => import('../../../components/practice/PlayScopeSelect'), { ssr: false });
const PracticeApp = dynamic(() => import('../../../components/practice/PracticeApp'), { ssr: false });

const PracticePlayPage: NextPageWithLayout = () => {
  const t = useT(practiceDict);
  return (
    <>
      <Head>
        <title>{t.pageTitle}</title>
      </Head>
      <PracticeApp />
    </>
  );
};

PracticePlayPage.getLayout = (page: ReactElement) => (
  <LearnPageLayout headerCenter={<PlayScopeSelect />}>{page}</LearnPageLayout>
);

export default PracticePlayPage;
