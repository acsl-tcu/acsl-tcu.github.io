"use client"
import React from 'react';
// Assuming you have a function to get the locale const
import MainContent from './components/MainContent';
import AppTheme from './shared-theme/AppTheme';
import Latest from './components/Latest';

const Home: React.FC = () => {

  return (
    <div className="container">
      <AppTheme>
        <MainContent />
        <Latest />
      </AppTheme >
    </div>
  );
};
export default Home;

