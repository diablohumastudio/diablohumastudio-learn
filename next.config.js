/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep in sync with src/i18n/locales.ts. The default locale has no URL
  // prefix; browser-language detection only runs on `/` (see docs/i18n-handoff.md).
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
  },
  // Old URL shapes. The platform lived under /learn on the marketing site, which now sends
  // /learn/* here unchanged; courses had no /course prefix and only wwise-unreal existed then.
  async redirects() {
    return [
      // The bare prefix needs its own rule: with nothing after it, `/:path*` renders as an empty Location.
      {
        source: '/learn',
        destination: '/courses',
        permanent: true,
      },
      {
        source: '/learn/:path*',
        destination: '/:path*',
        permanent: true,
      },
      {
        source: '/wwise-unreal',
        destination: '/course/wwise-unreal',
        permanent: true,
      },
      {
        source: '/wwise-unreal/exams',
        destination: '/course/wwise-unreal/exams',
        permanent: true,
      },
      {
        source: '/wwise-unreal/:clase',
        destination: '/course/wwise-unreal/class/:clase',
        permanent: true,
      },
      // Practice has no home of its own (it starts from a course) and exams are listed per course.
      {
        source: '/practice',
        destination: '/courses',
        permanent: false,
      },
      {
        source: '/exam',
        destination: '/courses',
        permanent: false,
      },
      // Links shared before the quiz became practice and teacher.
      {
        source: '/quiz',
        destination: '/courses',
        permanent: true,
      },
      {
        source: '/quiz/teacher',
        destination: '/teacher/students-practice-info',
        permanent: true,
      },
      {
        source: '/quiz/questions',
        destination: '/teacher/questions',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
