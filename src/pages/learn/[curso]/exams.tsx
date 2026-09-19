import type { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import { CourseMissing } from '../../../components/learn/ClassList';
import LearnPageLayout from '../../../components/learn/LearnPageLayout';
import { findCourse, querySlug } from '../../../data/learn';
import { examDict } from '../../../i18n/pages/exam';
import { useT } from '../../../i18n/useT';
import type { NextPageWithLayout } from '../../_app';

const ExamList = dynamic(() => import('../../../components/exam/ExamList'), { ssr: false });

// Forces SSR so the course slug reaches useRouter on the first render.
export const getServerSideProps: GetServerSideProps = async () => ({ props: {} });

const CourseExamsPage: NextPageWithLayout = () => {
  const t = useT(examDict);
  const router = useRouter();
  const course = findCourse(querySlug(router.query.curso));

  if (!course) {
    return router.isReady ? <CourseMissing /> : null;
  }

  return (
    <>
      <Head>
        <title>{t.pageTitle}</title>
      </Head>
      <ExamList course={course} />
    </>
  );
};

CourseExamsPage.getLayout = (page: ReactElement) => <LearnPageLayout>{page}</LearnPageLayout>;

export default CourseExamsPage;
