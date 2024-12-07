/**
* @type {import('next').NextConfig}
*/

import path from 'path';
export default {
  webpack: (config) => {
    config.resolve.alias['@'] = path.join(process.cwd()); // __dirnameの代わりにprocess.cwd()を使用 
    return config;
  },
};

const nextConfig = {
  output: "export",
  trailingSlash: true,
}

export default nextConfig
