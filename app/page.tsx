"use client"
import { useEffect, useState } from 'react';
import React from 'react';
import Button from '@mui/material/Button';
import { useI18nRouter } from '@/hooks/useI18nRouter';

const Home: React.FC = () => {
  const { appendBrowserLocale } = useI18nRouter();
  useEffect(() => {
    appendBrowserLocale();
  });
  return (
    <div className="container">
      Hellllllllooooooooooooo
    </div>
  );
};
export default Home;


