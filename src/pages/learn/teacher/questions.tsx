import dynamic from 'next/dynamic';
import Head from 'next/head';
import type { ReactElement } from 'react';
import LearnPageLayout from '../../../components/learn/LearnPageLayout';
import { practiceDict } from '../../../i18n/pages/practice';
import { useT } from '../../../i18n/useT';
import type { NextPageWithLayout } from '../../_app';

const QuestionEditor = dynamic(() => import('../../../components/practice/QuestionEditor'), { ssr: false });

const QuestionsPage: NextPageWithLayout = () => {
  const t = useT(practiceDict);
  return (
    <>
      <Head>
        <title>{t.editorPageTitle}</title>
      </Head>
      <QuestionEditor />
    </>
  );
};

QuestionsPage.getLayout = (page: ReactElement) => <LearnPageLayout>{page}</LearnPageLayout>;

export default QuestionsPage;
