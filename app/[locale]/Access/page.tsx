'use client';
import React, { useState } from 'react';
import { useI18nContext } from '@/contexts/i18nContext';
import Selector from '@/app/components/selector';

export default function Access() {
  const { messages } = useI18nContext();
  const campusList = [messages.accessTab.setagayaCampus, messages.accessTab.yokohamaCampus];
  const [value, setValue] = useState<string>(campusList[0]);

  const campusInfo = (str: string) => {
    switch (str) {
      case messages.accessTab.setagayaCampus:
        return (<>< h1 > {messages.accessTab.sec_toSetagayaCampus}</h1 >
          {messages.accessTab.setagayaCampusAddressStr}</>)
      case messages.accessTab.yokohamaCampus:
        return (<>< h1 > {messages.accessTab.sec_toYokohamaCampus}</h1 >
          {messages.accessTab.yokohamaCampusAddressStr}</>)
    }
  }
  return (
    <div>
      <h1>{messages.accessTab.sec_address}</h1>
      <Selector setValue={setValue} title={messages.accessTab.setagayaCampusAddressStr} contents={campusList} />
      {value}
      {campusInfo(value)}
    </div>
  );
}
