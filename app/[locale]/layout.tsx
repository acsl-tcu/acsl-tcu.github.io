import { I18nProvider } from '@/contexts/i18nContext';
import { locales } from '@/constants/i18n';
import { Locale } from '@/types/i18n';

//import '@/styles/main.scss';
import AppAppBar from './components/AppAppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

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
        <CssBaseline enableColorScheme />
        <AppAppBar />
        <Container
          maxWidth="lg"
          component="main"
          sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
        >
          {children}
        </Container>

      </I18nProvider>
    </html>
  );
}
//            <MainContent />