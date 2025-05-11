'use client';
// GitHub Pages 対応: github.ioでは、Next.js の middleware や next.config.js の redirects() を使用したページ遷移が機能しません。
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
