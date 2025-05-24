'use client';

import { FC, MouseEvent } from 'react';
import ExcelJS from 'exceljs';

interface ExcelWriteProps {
  head: Record<string, string>;
  data: Record<string, any>[];
  txt?: string;
}

const ExcelWrite: FC<ExcelWriteProps> = ({ head, data, txt }) => {
  const handlerClickDownloadButton = async (
    e: MouseEvent<HTMLButtonElement>,
    format: 'xlsx' | 'csv'
  ) => {
    e.preventDefault();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('sheet1');
    worksheet.columns = Object.keys(head).map((key) => ({ header: head[key], key }));
    worksheet.addRows(data);

    const buffer =
      format === 'xlsx'
        ? await workbook.xlsx.writeBuffer()
        : await workbook.csv.writeBuffer();

    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeDate = new Date().toISOString().replace(/[:.]/g, '-');
    a.href = url;
    a.download = `export-${safeDate}.${format}`;
    a.click();
    a.remove();
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold">{txt || 'データ出力'}</p>
      <div className="flex gap-2">
        <button
          onClick={(e) => handlerClickDownloadButton(e, 'xlsx')}
          className="btn btn-outline"
        >
          Excel形式
        </button>
        <button
          onClick={(e) => handlerClickDownloadButton(e, 'csv')}
          className="btn btn-outline"
        >
          CSV形式
        </button>
      </div>
    </div>
  );
};

export default ExcelWrite;
