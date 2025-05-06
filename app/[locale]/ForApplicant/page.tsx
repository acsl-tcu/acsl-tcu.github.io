'use client';

import { useI18nContext } from '@/contexts/i18nContext';

export default function ForApplicant() {
  const { messages } = useI18nContext();
  return (
    <div>
      <h1>{messages.forApplicantTab.title}</h1>
      <p>{messages.forApplicantTab.text}</p>
      <iframe width="100%" height="315" src="https://www.youtube.com/embed/59HnKaeN39U"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>

      <iframe src="https://docs.google.com/gview?url=https://www.cl.mse.tcu.ac.jp/lab/img/2021labIntroForB3.pdf&embedded=true" width="100%" height="1200px"></iframe>
    </div>
  );
}
