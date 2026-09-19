import dynamic from 'next/dynamic';
import Head from 'next/head';
import type { ReactElement } from 'react';
import LearnPageLayout from '../../../components/learn/LearnPageLayout';
import { examDict } from '../../../i18n/pages/exam';
import { useT } from '../../../i18n/useT';
import type { NextPageWithLayout } from '../../_app';

const ExamManager = dynamic(() => import('../../../components/exam/ExamManager'), { ssr: false });

const TeacherExamPage: NextPageWithLayout = () => {
  const t = useT(examDict);
  return (
    <>
      <Head>
        <title>{t.teacherPageTitle}</title>
      </Head>
      <ExamManager />
    </>
  );
};

TeacherExamPage.getLayout = (page: ReactElement) => <LearnPageLayout>{page}</LearnPageLayout>;

export default TeacherExamPage;
