import { useTranslations } from 'next-intl';

export default function Page() {
  const t = useTranslations('common');

  return (
    <div>
      <h1>{t('hello')}</h1>
    </div>
  );
}
