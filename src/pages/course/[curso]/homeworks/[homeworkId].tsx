import type { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import { CourseMissing } from '../../../../components/learn/ClassList';
import LearnPageLayout from '../../../../components/learn/LearnPageLayout';
import { findCourse, querySlug } from '../../../../data/learn';
import { learnDict } from '../../../../i18n/learn';
import { useT } from '../../../../i18n/useT';
import type { NextPageWithLayout } from '../../../_app';

const HomeworkPage = dynamic(() => import('../../../../components/practice/HomeworkPage'), { ssr: false });

// Forces SSR so the course slug and the homework id reach useRouter on the first render.
export const getServerSideProps: GetServerSideProps = async () => ({ props: {} });

/** One specific homework of the signed-in student: /course/<course>/homeworks/<id>. */
const CourseHomeworkPage: NextPageWithLayout = () => {
  const t = useT(learnDict);
  const router = useRouter();
  const course = findCourse(querySlug(router.query.curso));
  const homeworkId = querySlug(router.query.homeworkId) ?? '';

  if (!course) {
    return router.isReady ? <CourseMissing /> : null;
  }

  return (
    <>
      <Head>
        <title>{t.homeworksPageTitle}</title>
      </Head>
      <HomeworkPage course={course} homeworkId={homeworkId} />
    </>
  );
};

CourseHomeworkPage.getLayout = (page: ReactElement) => <LearnPageLayout>{page}</LearnPageLayout>;

export default CourseHomeworkPage;
