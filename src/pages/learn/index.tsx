import type { GetServerSideProps } from 'next';
import { LEARN_COURSES, classPath, latestClass } from '../../data/learn';
import { DEFAULT_LOCALE, isLocale, localizedPath } from '../../i18n/locales';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const course = LEARN_COURSES[0];
  const activeLocale = isLocale(locale) ? locale : DEFAULT_LOCALE;
  return {
    redirect: {
      destination: localizedPath(activeLocale, classPath(course, latestClass(course))),
      permanent: false,
    },
  };
};

export default function LearnIndex() {
  return null;
}
