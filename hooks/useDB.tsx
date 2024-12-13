import { useEffect, useState } from 'react';

interface UseDBOptions {
  year?: number;
}

const useDB = (column: string, table: string, options: UseDBOptions = {}) => {
  //default value
  const {
    year = new Date().getFullYear()
  } = options;
  const [rows, setRow] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        const response = await fetch(`https://acsl-hp.vercel.app/api/read-member?column=${column}&table=${table}&year=${year}`);
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const result = await response.json();
        console.log('Fetched data:', result.message);
        setRow(result.message);
      } catch (error) {
        console.log('Fetch error:', error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred.');
        }
      }
    }
    fetchData();
  }, [column, table]);

  return { rows, error };
};

export default useDB;