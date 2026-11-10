import type { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import { CourseMissing } from '../../../components/learn/ClassList';
import LearnPageLayout from '../../../components/learn/LearnPageLayout';
import { findCourse, querySlug } from '../../../data/learn';
import { practiceDict } from '../../../i18n/pages/practice';
import { useT } from '../../../i18n/useT';
import type { NextPageWithLayout } from '../../_app';

const StudentProposals = dynamic(() => import('../../../components/practice/StudentProposals'), { ssr: false });

// Forces SSR so the course slug reaches useRouter on the first render.
export const getServerSideProps: GetServerSideProps = async () => ({ props: {} });

const CourseProposalsPage: NextPageWithLayout = () => {
  const t = useT(practiceDict);
  const router = useRouter();
  const course = findCourse(querySlug(router.query.curso));

  if (!course) {
    return router.isReady ? <CourseMissing /> : null;
  }

  return (
    <>
      <Head>
        <title>{t.proposalsPageTitle}</title>
      </Head>
      <StudentProposals course={course} />
    </>
  );
};

CourseProposalsPage.getLayout = (page: ReactElement) => <LearnPageLayout>{page}</LearnPageLayout>;

export default CourseProposalsPage;
