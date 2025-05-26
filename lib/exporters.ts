// lib/exporters.ts
import ExcelJS from 'exceljs';

export function exportCSV<T>(data: T[], visibleKeys: (keyof T)[], filename = 'export.csv') {
  const exportData = data.map(row => {
    const obj: Record<string, string> = {};
    visibleKeys.forEach(key => {
      obj[String(key)] = String(row[key] ?? '');
    });
    return obj;
  });
  const csvContent = [
    visibleKeys.map(k => String(k)).join(','),
    ...exportData.map(row => visibleKeys.map(k => row[String(k)]).join(','))
  ].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

export async function exportXLSX<T>(data: T[], visibleKeys: (keyof T)[], filename = 'export.xlsx') {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');
  worksheet.addRow(visibleKeys.map(k => String(k)));
  data.forEach(row => {
    worksheet.addRow(visibleKeys.map(key => String(row[key] ?? '')));
  });
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

export function printTable<T>(data: T[], visibleKeys: (keyof T)[]) {
  const printable = data.map(row =>
    visibleKeys.map(key => String(row[key] ?? '')).join('\t')
  ).join('\n');
  const newWin = window.open('', '', 'width=800,height=600');
  if (newWin) {
    newWin.document.write('<pre>' + printable + '</pre>');
    newWin.document.close();
    newWin.print();
  }
}
