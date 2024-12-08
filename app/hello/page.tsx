'use client';

import { useI18nContext } from '@/contexts/i18nContext';

export default function Hello() {
  const { locale, messages } = useI18nContext();
  return (
    <div>
      <p>{`Current locale: ${locale}`}</p>
      <h1>{messages.hello.title}</h1>
    </div>
  );
}

//    <div>
// <h1>{messages.hello.greeting("Visitor")}</h1>
//
