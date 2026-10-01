import dynamic from 'next/dynamic';
import Head from 'next/head';
import type { ReactElement } from 'react';
import LearnPageLayout from '../../../components/learn/LearnPageLayout';
import { practiceDict } from '../../../i18n/pages/practice';
import { useT } from '../../../i18n/useT';
import type { NextPageWithLayout } from '../../_app';

const HomeworkManager = dynamic(() => import('../../../components/practice/HomeworkManager'), { ssr: false });

const TeacherHomeworksPage: NextPageWithLayout = () => {
  const t = useT(practiceDict);
  return (
    <>
      <Head>
        <title>{t.homeworksPageTitle}</title>
      </Head>
      <HomeworkManager />
    </>
  );
};

TeacherHomeworksPage.getLayout = (page: ReactElement) => <LearnPageLayout>{page}</LearnPageLayout>;

export default TeacherHomeworksPage;
