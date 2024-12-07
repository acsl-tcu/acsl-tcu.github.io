export type Locale = 'en' | 'ja';
export type Messages = {
  hello: {
    title: string;
    greeting: (name: string) => string;
  }
  // 省略
};