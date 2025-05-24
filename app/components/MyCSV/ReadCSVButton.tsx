'use client';

import { useCSVReader } from 'react-papaparse';
import { FC } from 'react';

interface ReadCSVButtonProps {
  onLoad: (results: any) => void;
}

const ReadCSVButton: FC<ReadCSVButtonProps> = ({ onLoad }) => {
  const { CSVReader } = useCSVReader();

  return (
    <CSVReader onUploadAccepted={onLoad}>
      {({ getRootProps, acceptedFile, ProgressBar }) => (
        <div className="flex flex-col items-start gap-2">
          <button
            type="button"
            {...getRootProps()}
            className="btn btn-outline px-4 py-2 rounded border border-gray-400 shadow-sm text-sm hover:bg-gray-50"
          >
            📂 CSV読込
          </button>
          {acceptedFile && (
            <div className="text-xs text-gray-600">{acceptedFile.name}</div>
          )}
          <ProgressBar className="w-full h-2 bg-red-200 rounded" />
        </div>
      )}
    </CSVReader>
  );
};

export default ReadCSVButton;
