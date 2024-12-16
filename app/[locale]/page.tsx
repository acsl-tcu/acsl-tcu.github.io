"use client"
import React from 'react';
import Button from '@mui/material/Button';
import { useI18nRouter } from '@/hooks/useI18nRouter';
// Assuming you have a function to get the locale const
import MainContent from './components/MainContent';
import AppTheme from './shared-theme/AppTheme';
import Latest from './components/Latest';

const Home: React.FC = () => {
  const { switchLocale } = useI18nRouter();

  return (
    <div className="container">
      <Button variant="outlined" onClick={() => {
        switchLocale('en');
      }}>Click me!</Button>
      <h1>GitHub Pages with Vercel Function</h1>
      <AppTheme>
        <MainContent />
        <Latest />

      </AppTheme >
    </div>
  );
};
export default Home;

