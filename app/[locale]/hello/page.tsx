'use client';

import { useI18nContext } from '@/contexts/i18nContext';

export default function Hello() {
  const { messages } = useI18nContext();
  return (
    <div>
      <h1>{messages.hello.title}</h1>
      <p>{messages.hello.aboutUs}</p>
    </div>
  );
}
