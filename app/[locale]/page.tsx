'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LocaleRedirect({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const { locale } = params;

  useEffect(() => {
    router.replace(`/${locale}/Home`);
  }, [locale, router]);

  return null;
}
