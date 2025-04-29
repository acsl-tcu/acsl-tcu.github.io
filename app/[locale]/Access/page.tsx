'use client';
import React, { useState } from 'react';
import { useI18nContext } from '@/contexts/i18nContext';
import Container from '@mui/material/Container';
import Selector from '@/app/components/selector';

export default function Access() {
  const { messages } = useI18nContext();
  const campusList = [messages.accessTab.setagayaCampus, messages.accessTab.yokohamaCampus];
  const [value, setValue] = useState<string>(campusList[0]);

  const selectCampus = (str: string): string => {
    switch (str) {
      case messages.accessTab.yokohamaCampus:
        return "yokohamaCampus"
      default: //case messages.accessTab.setagayaCampus:
        return "setagayaCampus"
    }
  }
  const campusInfo = (str: string) => {
    const campus = selectCampus(str);
    return (<><a href={messages.accessTab.link} rel="noopener noreferrer"> {messages.accessTab[campus + "Sec_to"]}</a><br />
      <div style={{ whiteSpace: 'pre-wrap' }}>
        {messages.accessTab[campus + "AddressStr"]}
      </div></>)
  }
  return (
    <Container maxWidth="sm">
      <Selector setValue={setValue} title="Campus" contents={campusList} />
      {campusInfo(value)}
    </Container>
  );
}
