/**
* @type {import('next').NextConfig}
*/
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
const nextConfig = {
  output: "export",
  trailingSlash: true,
  webpack: (config, { isServer }) => {
    if (process.env.ANALYZE === 'true') {
      config.plugins.push(new BundleAnalyzerPlugin());
    }
    if (!isServer) {
      // config.optimization.splitChunks.cacheGroups = {default: false, };
      config.optimization.runtimeChunk = 'single';
      config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      });
    }
    config.optimization = {
      ...config.optimization,
      minimize: true, // コードの最小化を有効にする
      splitChunks: {
        chunks: 'all',
        minSize: 0,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '~',
        cacheGroups: {
          default: false,
          vendors: false,
        },
      },
    };
    // config.cache = {
    //   type: 'filesystem',
    //   buildDependencies: {
    //     config: [__filename],
    //   },
    // };
    return config;
  },
}

export default nextConfig
