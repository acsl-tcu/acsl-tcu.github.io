import { Messages } from '@/types/i18n';

const messages: Messages = {
  hello: {
    title: 'english hello page',
    greeting: (name: string) => `hello!,${name}`
  }
  // 省略
}
export default messages;