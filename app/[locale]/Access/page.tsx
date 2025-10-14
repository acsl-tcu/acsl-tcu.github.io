'use client';
import React, { useState } from 'react';
import { useI18nContext } from '@/contexts/i18nContext';
import Selector from '@/components/lab/selector';
import Image from "next/image";

export default function Access() {
  const { messages } = useI18nContext();
  const campusList = [messages.accessTab.setagayaCampus, messages.accessTab.yokohamaCampus];
  const [value, setValue] = useState<string>(campusList[0]);

  const selectCampus = (str: string): string => {
    switch (str) {
      case messages.accessTab.yokohamaCampus:
        return "yokohamaCampus"
      default:
        return "setagayaCampus"
    }
  }
  const campusInfo = (str: string) => {
    const campus = selectCampus(str);
    return (<>
      <h2>{messages.accessTab.sec_address}</h2>
      <a href={messages.accessTab.link} rel="noopener noreferrer"> {messages.accessTab[campus + "Sec_to"]}</a><br />
      <div style={{ whiteSpace: 'pre-wrap' }}>
        {messages.accessTab[campus + "AddressStr"]}
      </div>
      <iframe
        src={messages.accessTab[campus + "Link"]}
        width="600" height="450" style={{
          border: "0",
          maxWidth: "100%"
        }} className="w-full"
        allowFullScreen></iframe >
      <h2>{messages.accessTab.sec_time}</h2>
      <Image src={messages.accessTab[campus + "Route"]} alt="主要駅からの乗り換え所要時間"
        width="600" height="450" className="object-cover w-full" />
    </>)
  }
  return (
    <div>
      <Selector setValue={setValue} title="Select Campus" contents={campusList} />
      {campusInfo(value)}
    </div>
  );
}
