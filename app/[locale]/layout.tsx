import { I18nProvider } from '@/contexts/i18nContext';
import { locales } from '@/constants/i18n';
import { Locale } from '@/types/i18n';
import NavBar from './components/NavBar';
import Title from './components/Title';
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

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps) {
  const { locale } = await params; // awaitで非同期データ取得
  return (
    <>
      <I18nProvider locale={locale}>
        <header className="sm:sticky sm:top-0 bg-white dark:bg-gray-900 bg-opacity-40 backdrop-blur-md border-b border-gray-300 shadow-md z-[5]">
          <Title />
          <NavBar />
        </header>
        <main className="container mx-auto flex flex-col">
          {children}
        </main>
      </I18nProvider>
    </>
  );
}
