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
        const results = await Promise.all(
          tables.map(async (table) => {
            const response = await fetch(`https://acsl-hp.vercel.app/api/read-database?table=${table}&year=${year}`);
            if (!response.ok) {
              throw new Error(`Error fetching data from ${table}: ${response.statusText}`);
            }
            const result = await response.json();
            return result.message;
          })
        );
        setRows(results);
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
  }, [tables, year]);

  return { rows, error };
};

export default useDB;