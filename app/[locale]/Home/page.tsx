
"use client"
import React from "react"
import { useI18nContext } from '@/contexts/i18nContext';
import { FB } from '@/app/components/FacebookSDK';
import News from './News';
const Home: React.FC = () => {
  const { messages } = useI18nContext();
  return (
    <div className="space-y-6">
      <h2>ABOUT US</h2>
      <p>{messages.home.aboutUs}</p>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="order-2 sm:order-1 w-full sm:w-2/3 bg-white p-4 shadow rounded flex flex-col">
          <News />
        </div>
        <div className="order-1 sm:order-2 w-full sm:w-1/3 bg-white p-4 shadow rounded flex flex-col">
          <FB />
        </div>
      </div>
    </div>
  );
}

export default Home;