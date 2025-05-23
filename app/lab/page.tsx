'use client';
// Redirect / to /{default lang}/Home
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootRedirect() {
  const router = useRouter();

  useEffect(() => {
    const userLang = navigator.language;
    const langPrefix = userLang.startsWith('ja') ? 'ja' : 'en';
    router.replace(`/${langPrefix}/Home`);
  }, [router]);

  return null;
}
