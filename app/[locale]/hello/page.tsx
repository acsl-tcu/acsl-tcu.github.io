'use client';

import { useI18nContext } from '@/contexts/i18nContext';

export default function Hello() {
  const { locale, messages } = useI18nContext();
  return (
    <div>
      <p>{`Current locale: ${locale}`}</p>
      <h1>{messages.hello.title}</h1>
      <p>{messages.hello.greeting("Visitor!")}</p>
    </div>
  );
}
