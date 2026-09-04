import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import LearnLayout, { LearnMissing } from '../../../components/learn/LearnLayout';
import { findClass, findCourse, querySlug } from '../../../data/learn';
import type { NextPageWithLayout } from '../../_app';

// Forces SSR so route params reach useRouter on the first render:
// the slide is in the initial HTML instead of appearing after hydration.
export const getServerSideProps: GetServerSideProps = async () => ({ props: {} });

const LearnClassPage: NextPageWithLayout = () => {
  const router = useRouter();
  const course = findCourse(querySlug(router.query.curso));
  const learnClass = course ? findClass(course, querySlug(router.query.clase)) : undefined;

  if (!course || !learnClass) {
    return router.isReady ? <LearnMissing /> : null;
  }

  const Presentation = learnClass.component;

  return (
    <>
      <Head>
        <title>{`${learnClass.title} – ${course.title}`}</title>
      </Head>
      <Presentation />
    </>
  );
};

LearnClassPage.getLayout = (page: ReactElement) => <LearnLayout>{page}</LearnLayout>;

export default LearnClassPage;
