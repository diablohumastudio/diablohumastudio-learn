import type { GetServerSideProps } from 'next';
import { COURSES_PATH } from '../data/learn';
import { DEFAULT_LOCALE, isLocale, localizedPath } from '../i18n/locales';

// The home is the course list for now; redirecting keeps `/` free for a dashboard later.
// Server redirects do not add the locale prefix by themselves (see docs/i18n-handoff.md).
export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  redirect: {
    destination: localizedPath(isLocale(locale) ? locale : DEFAULT_LOCALE, COURSES_PATH),
    permanent: false,
  },
});

export default function HomePage() {
  return null;
}
