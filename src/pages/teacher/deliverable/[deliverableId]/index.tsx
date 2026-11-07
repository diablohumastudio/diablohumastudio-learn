import dynamic from 'next/dynamic';
import Head from 'next/head';
import type { ReactElement } from 'react';
import LearnPageLayout from '../../../../components/learn/LearnPageLayout';
import { deliverableDict } from '../../../../i18n/pages/deliverable';
import { useT } from '../../../../i18n/useT';
import type { NextPageWithLayout } from '../../../_app';

/* One deliverable of the teacher's: /teacher/deliverable/<id>, or /teacher/deliverable/new?role=<role>
   for one not saved yet. There is no list here: deliverables are listed with the homeworks or the
   exams, by role. DeliverableManager reads the id and the role from the route. */
const DeliverableManager = dynamic(() => import('../../../../components/deliverable/DeliverableManager'), {
  ssr: false,
});

const TeacherDeliverablePage: NextPageWithLayout = () => {
  const t = useT(deliverableDict);
  return (
    <>
      <Head>
        <title>{t.teacherPageTitle}</title>
      </Head>
      <DeliverableManager />
    </>
  );
};

TeacherDeliverablePage.getLayout = (page: ReactElement) => <LearnPageLayout wide>{page}</LearnPageLayout>;

export default TeacherDeliverablePage;
