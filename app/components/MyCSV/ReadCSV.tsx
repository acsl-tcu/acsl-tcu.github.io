'use client';

import { useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import Encoding from 'encoding-japanese';

interface ReadCSVProps {
  action: (results: any) => void;
  setTableName?: (name: string) => void;
}

export default function ReadCSV({ action, setTableName }: ReadCSVProps) {
  const onDrop = useCallback((files: File[]) => {
    const file = files[0];
    const reader = new FileReader();

    if (setTableName) {
      setTableName(file.name.replace(/\..*/g, ''));
    }

    reader.onload = (e) => {
      const codes = new Uint8Array(e.target?.result as ArrayBuffer);
      let encoding = Encoding.detect(codes);

      if (encoding !== 'UTF8') {
        encoding = 'shiftjis';
      }

      const unicodeString = Encoding.convert(codes, {
        to: 'unicode',
        from: encoding,
        type: 'string',
      });

      Papa.parse(unicodeString, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => action(results),
      });
    };

    reader.readAsArrayBuffer(file);
  }, [action, setTableName]);

  const { getRootProps, getInputProps, isDragActive, open, acceptedFiles } = useDropzone({
    onDrop,
    noClick: true,
  });

  const files = useMemo(() =>
    acceptedFiles.map((file) => (
      <li key={file.path}>
        {file.path} - {file.size} bytes
      </li>
    )), [acceptedFiles]
  );

  return (
    <div className="w-full p-4 border-2 border-dashed rounded-lg shadow-sm bg-white text-center space-y-4">
      <div {...getRootProps()} className={`p-6 ${isDragActive ? 'border-blue-500' : 'border-gray-300'} border-2 rounded-md`}>
        <input {...getInputProps()} />
        <p className="text-sm text-gray-600">{isDragActive ? 'Drop here ...' : 'Drag & drop CSV here, or use the button below'}</p>
        <button
          type="button"
          onClick={open}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Select files
        </button>
      </div>
      <ul className="text-sm text-gray-500">{files}</ul>
    </div>
  );
}
