// app/[locale]/layout.tsx
import type { LayoutProps } from 'next';
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

export default async function LocaleLayout(
  { children, params }: LayoutProps<'/[locale]'>
) {
  const { locale } = await params; // params: Promise<{ locale: Locale }>
  return (
    <I18nProvider locale={locale}>
      <ClientLayout>{children}</ClientLayout>
    </I18nProvider>
  );
}