import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import IncineLayout, { IncineMissing } from '../../../components/incine/IncineLayout';
import { findClass, findCourse, querySlug } from '../../../data/incine';
import type { NextPageWithLayout } from '../../_app';

// Forces SSR so route params reach useRouter on the first render:
// the slide is in the initial HTML instead of appearing after hydration.
export const getServerSideProps: GetServerSideProps = async () => ({ props: {} });

const IncineClassPage: NextPageWithLayout = () => {
  const router = useRouter();
  const course = findCourse(querySlug(router.query.curso));
  const incineClass = course ? findClass(course, querySlug(router.query.clase)) : undefined;

  if (!course || !incineClass) {
    return router.isReady ? <IncineMissing /> : null;
  }

  const Presentation = incineClass.component;

  return (
    <>
      <Head>
        <title>{`${incineClass.title} – ${course.title}`}</title>
      </Head>
      <Presentation />
    </>
  );
};

IncineClassPage.getLayout = (page: ReactElement) => <IncineLayout>{page}</IncineLayout>;

export default IncineClassPage;
