'use client';

import { ChangeEvent } from 'react';
import Papa from 'papaparse';

interface ReadCSVProps {
  setInfo: (info: string[]) => void;
  setJInfo: (jinfo: string[]) => void;
}
export default function ReadCSV({ setInfo, setJInfo }: ReadCSVProps) {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const csvText = reader.result as string;
      Papa.parse<string[]>(csvText, {
        complete: (results) => {
          const data = results.data;
          if (data.length >= 2) {
            setInfo(data[0]);
            setJInfo(data[1]);
          }
        }
      });
    };
    reader.readAsText(file, 'UTF-8');
  };

  return (
    <div className="flex items-center gap-4">
      <label className="text-sm font-medium">CSVファイルを選択：</label>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="block file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100"
      />
    </div>
  );
}
