// next.config.mjs

const nextConfig = {
  reactStrictMode: true,

  async redirects() {
    return [
      {
        source: '/ja',
        destination: '/ja/Home',
        permanent: true,
      },
      {
        source: '/en',
        destination: '/en/Home',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
