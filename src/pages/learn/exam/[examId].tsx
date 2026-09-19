import dynamic from 'next/dynamic';
import Head from 'next/head';
import type { ReactElement } from 'react';
import LearnPageLayout from '../../../components/learn/LearnPageLayout';
import { examDict } from '../../../i18n/pages/exam';
import { useT } from '../../../i18n/useT';
import type { NextPageWithLayout } from '../../_app';

const ExamApp = dynamic(() => import('../../../components/exam/ExamApp'), { ssr: false });

const ExamPage: NextPageWithLayout = () => {
  const t = useT(examDict);
  return (
    <>
      <Head>
        <title>{t.pageTitle}</title>
      </Head>
      <ExamApp />
    </>
  );
};

ExamPage.getLayout = (page: ReactElement) => <LearnPageLayout>{page}</LearnPageLayout>;

export default ExamPage;
