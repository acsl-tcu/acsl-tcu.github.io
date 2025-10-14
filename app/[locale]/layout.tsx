// app/[locale]/layout.tsx
import { I18nProvider } from '@/contexts/i18nContext';
import { locales } from '@/constants/i18n';
import type { Locale } from '@/types/i18n';
import ClientLayout from './components/ClientLayout';
import { notFound } from 'next/navigation';

// 生成しないパラメータは 404 にする（SSG/ISR向け）
export const dynamicParams = false;

export async function generateStaticParams(): Promise<{ locale: Locale }[]> {
  return locales.map((l) => ({ locale: l }));
}

type Props = {
  children: React.ReactNode;
  // ← ここを Locale に（string をやめる）
  params: Promise<{ locale: Locale }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // 念のため実行時も検証（build時は型で担保されるが、直叩き対策）
  if (!((locales as readonly string[]).includes(locale))) {
    notFound();
  }

  return (
    <I18nProvider locale={locale}>
      <ClientLayout>{children}</ClientLayout>
    </I18nProvider>
  );
}
