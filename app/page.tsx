"use client"
import { useEffect } from 'react';
import React from 'react';
import { useI18nRouter } from '@/hooks/useI18nRouter';

const Home: React.FC = () => {
  const { appendBrowserLocale } = useI18nRouter();
  useEffect(() => {
    appendBrowserLocale();
  });
  return (
    <div className="container">
    </div>
  );
};
export default Home;


