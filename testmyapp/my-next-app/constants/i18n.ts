import { Messages, Locale } from '@/types/i18n';

import enMessages from './messages/en';
import jaMessages from './messages/ja';

export const locales: Locale[] = ['en','ja'];
export const defaultLocale: Locale = 'ja';
export const messagesMap: { [key in Locale]: Messages } = {
  en: enMessages,
  ja: jaMessages,
};