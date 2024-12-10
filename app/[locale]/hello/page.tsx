'use client';

import { useI18nContext } from '@/contexts/i18nContext';
import { FB } from '../../FacebookSDK';

export default function Hello() {
  const { messages } = useI18nContext();
  return (
    <div>
      <FB />
      <h1>ABOUT US</h1>
      <h1>{messages.hello.title}</h1>
      <p>{messages.hello.aboutUs}</p>
    </div>
  );
}
