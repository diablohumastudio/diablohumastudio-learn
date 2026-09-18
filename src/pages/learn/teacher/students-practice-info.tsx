import dynamic from 'next/dynamic';
import Head from 'next/head';
import type { ReactElement } from 'react';
import LearnPageLayout from '../../../components/learn/LearnPageLayout';
import { practiceDict } from '../../../i18n/pages/practice';
import { useT } from '../../../i18n/useT';
import type { NextPageWithLayout } from '../../_app';

const TeacherBoard = dynamic(() => import('../../../components/practice/TeacherBoard'), { ssr: false });

const StudentsPracticeInfoPage: NextPageWithLayout = () => {
  const t = useT(practiceDict);
  return (
    <>
      <Head>
        <title>{t.teacherPageTitle}</title>
      </Head>
      <TeacherBoard />
    </>
  );
};

StudentsPracticeInfoPage.getLayout = (page: ReactElement) => <LearnPageLayout>{page}</LearnPageLayout>;

export default StudentsPracticeInfoPage;
