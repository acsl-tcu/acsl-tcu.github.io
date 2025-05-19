
"use client"
import React from "react"
import { useI18nContext } from '@/contexts/i18nContext';
import { FB } from '@/app/components/FacebookSDK';
import {News} from './News';
const Home: React.FC = () => {
  const { messages } = useI18nContext();
  return (
    <div className="space-y-6">
    <h2>ABOUT US</h2>
    <p>{messages.home.aboutUs}</p>

    <div className="flex flex-row gap-4">
      <div className="w-2/3">
        <News />
      </div>
      <div className="w-1/3">
        <FB />
      </div>
    </div>
  </div>
  );
}

export default Home;