import { useEffect, useState } from 'react';

const useDB = (tables: string[], year: number) => {
  //default value
  const [rows, setRows] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tables || tables.length === 0) {
      setError("No tables provided.");
      return;
    }
    async function fetchData(): Promise<void> {
      try {
        const response = await fetch(`https://acsl-hp.vercel.app/api/read-database-psql`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tables, year })
        });
        if (!response.ok) {
          throw new Error(`Error fetching data from ${tables}: ${response.statusText}`);
        }
        const result = await response.json();
        if (result && result.message) {
          setRows(result.message);
        } else {
          throw new Error('Invalid response format');
        }
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
  }, [year]);//tables, year

  return { rows, error };
};

export default useDB;