import dynamic from 'next/dynamic';
import Head from 'next/head';
import type { ReactElement } from 'react';
import QuizLayout from '../../../components/quiz/QuizLayout';
import { quizDict } from '../../../i18n/pages/quiz';
import { useT } from '../../../i18n/useT';
import type { NextPageWithLayout } from '../../_app';

const QuestionEditor = dynamic(() => import('../../../components/quiz/QuestionEditor'), { ssr: false });

const QuestionsPage: NextPageWithLayout = () => {
  const t = useT(quizDict);
  return (
    <>
      <Head>
        <title>{t.editorPageTitle}</title>
      </Head>
      <QuestionEditor />
    </>
  );
};

QuestionsPage.getLayout = (page: ReactElement) => <QuizLayout>{page}</QuizLayout>;

export default QuestionsPage;
