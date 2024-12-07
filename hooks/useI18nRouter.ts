import { useRouter, usePathname } from 'next/navigation';

import { Locale } from '@/types/i18n';
import { locales, defaultLocale } from '@/constants/i18n';

export const useI18nRouter = () => {
  const router = useRouter();
  const pathname = usePathname();

  // URLのロケールを変更する
  const switchLocale = (locale: Locale) => {
    const newPath = pathname.replace(/^\/[^\/]+/, `/${locale}`);
    router.push(newPath);
  };

  // URLにブラウザ設定（またはデフォルト）のロケールを付与する
  const appendBrowserLocale = () => {
    const browserLocale = window.navigator.language;
    const locale =
      locales.find((locale) => browserLocale.startsWith(locale)) ||
      defaultLocale;
    const newPath = pathname.replace(/^\//, `/${locale}/`);
    router.push(newPath);
  };

  return { switchLocale, appendBrowserLocale };
};