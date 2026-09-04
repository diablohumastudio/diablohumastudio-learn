import type { GetServerSideProps } from 'next';
import type { ReactElement } from 'react';
import LearnLayout, { LearnMissing } from '../../../components/learn/LearnLayout';
import { classPath, findCourse, firstClass, querySlug } from '../../../data/learn';
import { DEFAULT_LOCALE, isLocale, localizedPath } from '../../../i18n/locales';
import type { NextPageWithLayout } from '../../_app';

// A course URL opens its first class; the class page shows slide 1 when `?s=` is absent.
export const getServerSideProps: GetServerSideProps = async ({ params, locale }) => {
  const course = findCourse(querySlug(params?.curso));
  if (!course) return { props: {} };
  const activeLocale = isLocale(locale) ? locale : DEFAULT_LOCALE;
  return {
    redirect: {
      destination: localizedPath(activeLocale, classPath(course, firstClass(course))),
      permanent: false,
    },
  };
};

const LearnCoursePage: NextPageWithLayout = () => <LearnMissing />;

LearnCoursePage.getLayout = (page: ReactElement) => <LearnLayout>{page}</LearnLayout>;

export default LearnCoursePage;
