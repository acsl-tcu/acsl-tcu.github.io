
"use client"
import React from "react"
import { useI18nContext } from '@/contexts/i18nContext';
import { FB } from '@/app/components/FacebookSDK';

const Home: React.FC = () => {
  const { messages } = useI18nContext();
  return (
    <div>
      <h3>ABOUT US</h3>
      <p>{messages.home.aboutUs}</p>
      <FB />
    </div>
  );
}

export default Home;