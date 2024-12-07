'use client';

import { useI18nContext } from '@/contexts/i18nContext';

export default function Hello() {
  const { locale, messages } = useI18nContext();
  return (
    <h1>{messages.title}</h1>
  );
}

//    <div>
// <h1>{messages.hello.greeting("Visitor")}</h1>
// <p>{`Current locale: ${locale}`}</p> </div >
