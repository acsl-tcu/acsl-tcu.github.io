'use client';

import { useState } from 'react';
import ReadCSV from './ReadCSV';
import DispCSVInfo from './DispCSVInfo';

export default function ReadFile() {
  const [info, setInfo] = useState<string[]>([]);
  const [jinfo, setJInfo] = useState<string[]>([]);
  const [tableName, setTableName] = useState<string>(''); // ✅ 追加

  return (
    <div className="flex flex-col gap-4">
      <ReadCSV setInfo={setInfo} setJInfo={setJInfo} />
      <DispCSVInfo info={info} jinfo={jinfo}
        table_name={tableName}
        setTableName={setTableName} />
    </div>
  );
}
