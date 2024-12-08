'use client';
import { createContext, useContext } from 'react';

import { Locale, Messages } from '@/types/i18n';
import { messagesMap } from '@/constants/i18n';

// const I18nContext = createContext<
//   | {
//     locale: Locale;
//     messages: Messages;
//   }
//   | undefined
// >(undefined);

// Define the context type 
interface I18nContextType { locale: Locale; messages: Messages; }
// Create the context 
const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const useI18nContext = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('Failed to retrieve I18nContext.');
  }
  return context;
};

export const I18nProvider = ({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) => {
  const messages = messagesMap[locale];
  return (
    <I18nContext.Provider value={{ locale, messages }}>
      {children}
    </I18nContext.Provider>
  );
};