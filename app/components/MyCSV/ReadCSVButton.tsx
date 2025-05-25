'use client';

import { useCSVReader } from 'react-papaparse';
import type { ParseResult } from 'papaparse';
import { FC } from 'react';

interface ReadCSVButtonProps {
  onLoad: (results: ParseResult<Record<string, string>>) => void;
}

const ReadCSVButton: FC<ReadCSVButtonProps> = ({ onLoad }) => {
  const { CSVReader } = useCSVReader();

  return (
    <CSVReader onUploadAccepted={onLoad}>
      {({
        getRootProps,
        acceptedFile,
        ProgressBar,
      }: {
        getRootProps: () => React.HTMLProps<HTMLButtonElement>;
        acceptedFile: File | null;
        ProgressBar: React.FC<{ className?: string }>;
      }) => (
        <div className="flex flex-col items-start gap-2">
          <button
            type="button"
            {...getRootProps()}
            className="px-4 py-2 rounded border border-gray-400 shadow-sm text-sm hover:bg-gray-50"
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
