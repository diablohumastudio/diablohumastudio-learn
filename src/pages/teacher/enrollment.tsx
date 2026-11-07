import dynamic from 'next/dynamic';
import Head from 'next/head';
import type { ReactElement } from 'react';
import LearnPageLayout from '../../components/learn/LearnPageLayout';
import { courseDict } from '../../i18n/pages/course';
import { useT } from '../../i18n/useT';
import type { NextPageWithLayout } from '../_app';

const EnrollmentManager = dynamic(() => import('../../components/course/EnrollmentManager'), { ssr: false });

const TeacherEnrollmentPage: NextPageWithLayout = () => {
  const t = useT(courseDict);
  return (
    <>
      <Head>
        <title>{t.enrollmentPageTitle}</title>
      </Head>
      <EnrollmentManager />
    </>
  );
};

TeacherEnrollmentPage.getLayout = (page: ReactElement) => <LearnPageLayout wide>{page}</LearnPageLayout>;

export default TeacherEnrollmentPage;
