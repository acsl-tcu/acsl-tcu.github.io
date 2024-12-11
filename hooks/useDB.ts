import { useEffect, useState } from 'react';

export const useDB = () => {
  const [state, setState] = useState("waya");
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

  return { state };
};