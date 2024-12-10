import { I18nProvider } from '@/contexts/i18nContext';
import { locales } from '@/constants/i18n';
import { Locale } from '@/types/i18n';

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AppAppBar from './components/AppAppBar';
//import MainContent from './components/MainContent';
import Latest from './components/Latest';
import Footer from './components/Footer';
import AppTheme from './shared-theme/AppTheme';
//import '@/styles/main.scss';

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
  const { locale } = await params; // awaitを使用して非同期で解決
  return (
    <html lang={locale}>
      <I18nProvider locale={locale}>
        <AppTheme>
          <CssBaseline enableColorScheme />
          <AppAppBar />
          <Container
            maxWidth="lg"
            component="main"
            sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
          >
            {children}
            <Latest />
          </Container>
          <Footer />
        </AppTheme>
      </I18nProvider>
    </html>
  );
}
//            <MainContent />