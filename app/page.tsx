"use client"
import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from 'react';
import React from 'react';
import { Button } from 'react-bootstrap';

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
      <button type="button" className="btn btn-primary">
      Push!
      </button>
      <h1>GitHub Pages with Vercel Function</h1>
      <div id="response">{state}</div>
      <h1>Hello, Bootstrap!</h1>
      <Button variant="primary">Click me!</Button>
    </div>
  );
};
export default Home;

