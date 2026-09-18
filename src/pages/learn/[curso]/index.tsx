import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import ClassList, { CourseMissing } from '../../../components/learn/ClassList';
import LearnPageLayout from '../../../components/learn/LearnPageLayout';
import { findCourse, querySlug } from '../../../data/learn';
import type { NextPageWithLayout } from '../../_app';

// Forces SSR so the course slug reaches useRouter on the first render.
export const getServerSideProps: GetServerSideProps = async () => ({ props: {} });

const LearnCoursePage: NextPageWithLayout = () => {
  const router = useRouter();
  const course = findCourse(querySlug(router.query.curso));

  if (!course) {
    return router.isReady ? <CourseMissing /> : null;
  }

  return (
    <>
      <Head>
        <title>{course.title}</title>
      </Head>
      <ClassList course={course} />
    </>
  );
};

LearnCoursePage.getLayout = (page: ReactElement) => <LearnPageLayout>{page}</LearnPageLayout>;

export default LearnCoursePage;
