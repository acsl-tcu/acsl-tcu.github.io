"use client"
import { useEffect, useState } from 'react';
import React from 'react';
import Button from '@mui/material/Button';
import { useI18nRouter } from '@/hooks/useI18nRouter';
// Assuming you have a function to get the locale const
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
//import AppAppBar from './components/AppAppBar';
import MainContent from './components/MainContent';
import Latest from './components/Latest';
import Footer from './components/Footer';
// import AppTheme from './shared-theme/AppTheme';


const Home: React.FC = () => {
  const [state, setState] = useState("hoge");
  const { switchLocale } = useI18nRouter();
  useEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        const response = await fetch('https://acsl-hp.vercel.app/api/hello');
        const data: { message: string } = await response.json();
        setState(data.message);
        //document.getElementById('response').innerText = data.message;
      } catch (error) { console.log('Fetch error:', error); }
    }
    fetchData();
  });
  return (
    <div className="container">
      <Button variant="outlined" onClick={() => {
        switchLocale('en');
      }}>Click me!</Button>
      <h1>GitHub Pages with Vercel Function</h1>
      <div id="response">{state}</div>
      {/* <AppTheme> */}
      <CssBaseline enableColorScheme />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
      >
        <MainContent />
        <Latest />
      </Container>
      <Footer />
      {/* </AppTheme > */}
    </div>
  );
};
export default Home;

