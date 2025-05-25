'use client';

import { useState, memo, useEffect, useRef } from 'react';

interface DispCSVInfoProps {
  info: string[];
  jinfo: string[];
  table_name: string;
  setTableName: (name: string) => void;
  fCopy?: boolean;
  fUpdate?: boolean;
}

const copyToClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text);
};

const DispCSVInfo = memo(function DispCSVInfo({
  info: rawInfo,
  jinfo,
  table_name,
  setTableName,
  fCopy,
}: DispCSVInfoProps) {
  const [info, setInfo] = useState(
    rawInfo.map((item) => item.replace(/\.|\/| /g, '_').toLowerCase())
  );

  const prevCopyRef = useRef(fCopy);
  const brace = [
    'model ',
    ' {\n  id Int @id @default(autoincrement())\n  ',
    '}',
  ];

  function onChange(value: string, index: number) {
    const updated = [...info];
    updated[index] = value;
    setInfo(updated);
  }

  useEffect(() => {
    if (!prevCopyRef.current && fCopy) {
      const modelDef =
        brace[0] +
        table_name +
        brace[1] +
        info
          .map((field, i) => `${field}\tString\t@default("") // ${jinfo[i] ?? ''}`)
          .join('\n  ') +
        '\n' +
        brace[2];
      copyToClipboard(modelDef);
    }
    prevCopyRef.current = fCopy;
  }, [fCopy, info, jinfo, table_name]);

  return (
    <div className="text-sm font-mono whitespace-pre-wrap bg-gray-50 p-4 rounded border border-gray-300 shadow">
      <div className="mb-4 flex items-center gap-2">
        <span className="font-bold">{brace[0]}</span>
        <input
          type="text"
          className="p-1 border rounded text-sm"
          onChange={(e) => setTableName(e.target.value)}
          placeholder="table_name_DCSVI"
          value={table_name}
        />
      </div>

      <div className="mb-4">
        {brace[1]}
        {info.map((field, i) => (
          <div key={`field-${i}`} className="flex items-center gap-2 mb-1">
            <input
              type="text"
              className="p-1 border rounded text-sm w-48"
              defaultValue={field}
              onChange={(e) => onChange(e.target.value, i)}
            />
            <span>
              String @default("") // {jinfo[i] ?? ''}
            </span>
          </div>
        ))}
        {brace[2]}
      </div>

      <div className="mb-2">
        <p className="font-semibold">JSON Mapping:</p>
        {info.map((field, i) => (
          <div key={`json-${i}`}>
            {field}: "{jinfo[i] ?? ''}",
          </div>
        ))}
      </div>

      <div>
        <p className="font-semibold">Field List:</p>
        {info.map((field, i) => (
          <div key={`fieldlist-${i}`}>
            "{field}", // {jinfo[i] ?? ''}
          </div>
        ))}
      </div>
    </div>
  );
});

export default DispCSVInfo;
