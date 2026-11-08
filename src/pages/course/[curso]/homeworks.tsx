import type { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import { CourseMissing } from '../../../components/learn/ClassList';
import LearnPageLayout from '../../../components/learn/LearnPageLayout';
import { findCourse, querySlug } from '../../../data/learn';
import { learnDict } from '../../../i18n/learn';
import { useT } from '../../../i18n/useT';
import type { NextPageWithLayout } from '../../_app';

const HomeworkList = dynamic(() => import('../../../components/practice/HomeworkList'), { ssr: false });

// Forces SSR so the course slug reaches useRouter on the first render.
export const getServerSideProps: GetServerSideProps = async () => ({ props: {} });

const CourseHomeworksPage: NextPageWithLayout = () => {
  const t = useT(learnDict);
  const router = useRouter();
  const course = findCourse(querySlug(router.query.curso));

  if (!course) {
    return router.isReady ? <CourseMissing /> : null;
  }

  return (
    <>
      <Head>
        <title>{t.homeworksPageTitle}</title>
      </Head>
      <HomeworkList course={course} />
    </>
  );
};

CourseHomeworksPage.getLayout = (page: ReactElement) => <LearnPageLayout>{page}</LearnPageLayout>;

export default CourseHomeworksPage;
