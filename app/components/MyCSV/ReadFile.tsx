'use client';

import { useState } from 'react';
import ReadCSV from './ReadCSV';
import DispCSVInfo from './DispCSVInfo';

export default function ReadFile() {
  const [info, setInfo] = useState<any[]>([]);
  const [jinfo, setJInfo] = useState<any[]>([]);

  return (
    <div className="space-y-4">
      <ReadCSV setInfo={setInfo} setJInfo={setJInfo} />
      <DispCSVInfo info={info} jinfo={jinfo} />
    </div>
  );
}
