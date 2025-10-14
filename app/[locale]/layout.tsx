// app/[locale]/layout.tsx
import { I18nProvider } from '@/contexts/i18nContext';
import { locales } from '@/constants/i18n';
import type { Locale } from '@/types/i18n';
import ClientLayout from './components/ClientLayout';

// frame structure setting
// Site title: h1
// Each page title: h2
// Section:

// 必要に応じて：SSGで動的パラメータを固定
export const dynamicParams = false;

export async function generateStaticParams(): Promise<{ locale: Locale }[]> {
  return locales.map((l) => ({ locale: l }));
}

type Props = {
  children: React.ReactNode;
  // <= あなたの環境(typed routes)が要求している Promise 形
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
// localeをLocale型に明示的にキャスト（※安全に変換する処理を入れてください）
  const typedLocale = locale as Locale;
  return (
    <I18nProvider locale={typedLocale}>
      <ClientLayout>{children}</ClientLayout>
    </I18nProvider>
  );
}