import { I18nProvider } from '@/contexts/i18nContext';
import { locales } from '@/constants/i18n';
import { Locale } from '@/types/i18n';

import '@/styles/main.scss';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    locale: Locale;
  };
}) {
  return (
    <html lang={params.locale}>
      <I18nProvider locale={params.locale}>
        {children}
      </I18nProvider>
    </html>
  );
}