'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const lang = navigator.language.startsWith('ja') ? 'ja' : 'en';
    router.replace(`/${lang}/Home`);
  }, []);

  return null;
}
