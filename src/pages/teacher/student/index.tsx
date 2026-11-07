import dynamic from 'next/dynamic';
import Head from 'next/head';
import type { ReactElement } from 'react';
import LearnPageLayout from '../../../components/learn/LearnPageLayout';
import { practiceDict } from '../../../i18n/pages/practice';
import { useT } from '../../../i18n/useT';
import type { NextPageWithLayout } from '../../_app';

const StudentReview = dynamic(() => import('../../../components/practice/StudentReview'), { ssr: false });

const StudentReviewPage: NextPageWithLayout = () => {
  const t = useT(practiceDict);
  return (
    <>
      <Head>
        <title>{t.studentReviewPageTitle}</title>
      </Head>
      <StudentReview />
    </>
  );
};

StudentReviewPage.getLayout = (page: ReactElement) => <LearnPageLayout wide>{page}</LearnPageLayout>;

export default StudentReviewPage;
