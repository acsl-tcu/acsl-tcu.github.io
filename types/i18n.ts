export type Locale = 'en' | 'ja';
export type Messages = {
  title: string,
  hello: {
    title: string;
    greeting: (name: string) => string;
    aboutUs: string;
  }
};