import { I18nProvider } from '@/contexts/i18nContext';
import { locales } from '@/constants/i18n';
import { Locale } from '@/types/i18n';
import ClientLayout from './components/ClientLayout';
// frame structure setting
// Site title: h1
// Each page title: h2
// Section:
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: Locale;
  }>;
}
// async 
export default async function LocaleLayout({
  children,
  params,
}: LayoutProps) {
  const { locale } = await params; // awaitで非同期データ取得

  return (
    <>
      <I18nProvider locale={locale}>
        <ClientLayout>{children}</ClientLayout>
      </I18nProvider>
    </>
  );
}
