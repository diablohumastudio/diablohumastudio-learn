/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
    ]
  },
}

module.exports = nextConfig
