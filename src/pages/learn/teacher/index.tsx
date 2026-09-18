import dynamic from 'next/dynamic';
import Head from 'next/head';
import type { ReactElement } from 'react';
import LearnPageLayout from '../../../components/learn/LearnPageLayout';
import { learnDict } from '../../../i18n/learn';
import { useT } from '../../../i18n/useT';
import type { NextPageWithLayout } from '../../_app';

const TeacherHub = dynamic(() => import('../../../components/learn/TeacherHub'), { ssr: false });

const TeacherPage: NextPageWithLayout = () => {
  const t = useT(learnDict);
  return (
    <>
      <Head>
        <title>{t.teacherPageTitle}</title>
      </Head>
      <TeacherHub />
    </>
  );
};

TeacherPage.getLayout = (page: ReactElement) => <LearnPageLayout>{page}</LearnPageLayout>;

export default TeacherPage;
