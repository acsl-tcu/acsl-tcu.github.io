import { I18nProvider } from '@/contexts/i18nContext';
import { locales } from '@/constants/i18n';
import { Locale } from '@/types/i18n';

// import '@/styles/main.scss';
import AppAppBar from './components/AppAppBar';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: Locale;
  }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps) {
  const { locale } = await params; // awaitで非同期データ取得

  return (
    <>
      <I18nProvider locale={locale}>
        <AppAppBar />
        <main className="container mx-auto flex flex-col my-16 gap-4 px-4">
          {children}
        </main>
      </I18nProvider>
    </>
  );
}
//<html lang={locale}>
