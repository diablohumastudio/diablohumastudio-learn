/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep in sync with src/i18n/locales.ts. The default locale has no URL
  // prefix; browser-language detection only runs on `/` (see docs/i18n-handoff.md).
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
  },
  async redirects() {
    return [
      {
        source: '/discord',
        destination: 'https://discord.gg/5JNJcmHSQ',
        permanent: false,
      },
      // Class links shared before the section moved to /learn.
      {
        source: '/incine/:path*',
        destination: '/learn/:path*',
        permanent: true,
      },
      // Links shared before the quiz became /learn/practice and /learn/teacher.
      {
        source: '/learn/quiz',
        destination: '/learn/practice',
        permanent: true,
      },
      {
        source: '/learn/quiz/teacher',
        destination: '/learn/teacher/students-practice-info',
        permanent: true,
      },
      {
        source: '/learn/quiz/questions',
        destination: '/learn/teacher/questions',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
