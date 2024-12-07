import i18nConfig from './i18n.mjs';

export default {
  experimental: {
    appDir: true,
  },
  reactStrictMode: true,
  output: 'export', // 静的エクスポートを有効化
  i18n: {
    locales: i18nConfig.locales,
    defaultLocale: i18nConfig.defaultLocale,
  },
};
