// utils/translateText.ts

export const translateArrayText = async (e: string[]): Promise<string[]> => {
  const jtext = e.join("\n");
  const translated = await translateText(jtext.replace(/\d/g, ""));
  const field = translated.split('\n');
  const ntext = jtext.replace(/.*(\d{2})/g, '$1').split('\n');
  return field.map((el, i) => el.replace(/ /g, '_') + (e[i] !== ntext[i] ? ntext[i] : ""));
};

export const translateText = async (text: string): Promise<string> => {
  const res = await fetch('https://libretranslate.de/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      q: text,
      source: 'ja',
      target: 'en',
    })
  });

  if (!res.ok) {
    console.error('Translation failed', res.statusText);
    throw new Error(res.statusText);
  }

  const data = await res.json();
  return data.translatedText;
};
