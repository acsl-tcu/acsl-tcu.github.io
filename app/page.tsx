"use client"
import { useEffect, useState } from 'react';
import React from 'react';
import Button from '@mui/material/Button';
import App from './blog/Blog';

const Home: React.FC = () => {
  const [state, setState] = useState("hogehoge");
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
  }, []);
  return (
    <div className="container">
      <Button variant="outlined">Click me!</Button>
      <h1>GitHub Pages with Vercel Function</h1>
      <div id="response">{state}</div>
      <h1>Hello, Bootstrap!</h1>
      <App />
    </div>
  );
};
export default Home;

