import dynamic from 'next/dynamic';
import Head from 'next/head';
import type { ReactElement } from 'react';
import LearnPageLayout from '../../../components/learn/LearnPageLayout';
import { examDict } from '../../../i18n/pages/exam';
import { useT } from '../../../i18n/useT';
import type { NextPageWithLayout } from '../../_app';

const ExamList = dynamic(() => import('../../../components/exam/ExamList'), { ssr: false });

const ExamsPage: NextPageWithLayout = () => {
  const t = useT(examDict);
  return (
    <>
      <Head>
        <title>{t.pageTitle}</title>
      </Head>
      <ExamList />
    </>
  );
};

ExamsPage.getLayout = (page: ReactElement) => <LearnPageLayout>{page}</LearnPageLayout>;

export default ExamsPage;
