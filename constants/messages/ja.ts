import { Messages } from '@/types/i18n';

const messages: Messages = {
  hello: {
    title: '日本語ハローページ',
    greeting: (name: string) => `こんにちは!,${name}`
  }
  // 省略
}
export default messages;