/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // un-comment for githubio
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.boxcloud.com',
      },
      {
        protocol: 'https',
        hostname: 'box.com',
      },
    ],
  },
};

export default nextConfig;
