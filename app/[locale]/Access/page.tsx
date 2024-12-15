'use client';
import React, { useState } from 'react';
import { useI18nContext } from '@/contexts/i18nContext';
import Container from '@mui/material/Container';
import Selector from '@/app/components/selector';

export default function Access() {
  const { messages } = useI18nContext();
  const campusList = [messages.accessTab.setagayaCampus, messages.accessTab.yokohamaCampus];
  const [value, setValue] = useState<string>(campusList[0]);

  const campusInfo = (str: string) => {
    switch (str) {
      case messages.accessTab.setagayaCampus:
        return (<><a href={messages.accessTab.link} rel="noopener noreferrer"> {messages.accessTab.sec_toSetagayaCampus}</a><br />
          <div style={{ whiteSpace: 'pre-wrap' }}>
            {messages.accessTab.setagayaCampusAddressStr}
          </div></>)
      case messages.accessTab.yokohamaCampus:
        return (<><a href={messages.accessTab.link} rel="noopener noreferrer"> {messages.accessTab.sec_toYokohamaCampus}</a><br />
          <div style={{ whiteSpace: 'pre-wrap' }}>
            {messages.accessTab.yokohamaCampusAddressStr}
          </div></>)
    }
  }
  return (
    <Container maxWidth="sm">
      <Selector setValue={setValue} title="Campus" contents={campusList} />
      {campusInfo(value)}
    </Container>
  );
}
