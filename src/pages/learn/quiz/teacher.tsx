import dynamic from 'next/dynamic';
import Head from 'next/head';
import type { ReactElement } from 'react';
import QuizLayout from '../../../components/quiz/QuizLayout';
import { quizDict } from '../../../i18n/pages/quiz';
import { useT } from '../../../i18n/useT';
import type { NextPageWithLayout } from '../../_app';

const TeacherBoard = dynamic(() => import('../../../components/quiz/TeacherBoard'), { ssr: false });

const TeacherPage: NextPageWithLayout = () => {
  const t = useT(quizDict);
  return (
    <>
      <Head>
        <title>{t.teacherPageTitle}</title>
      </Head>
      <TeacherBoard />
    </>
  );
};

TeacherPage.getLayout = (page: ReactElement) => <QuizLayout>{page}</QuizLayout>;

export default TeacherPage;
