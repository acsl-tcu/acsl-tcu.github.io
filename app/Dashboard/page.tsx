// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/app/components/DataTable/DataTable';
import { EquipmentConvertToAPIFormat, EquipmentConvertToDBFormat, EquipmentColumns, EquipmentColumnsStaffHide, EquipmentColumnsStudentHide, equipment_table_title } from './Equipment';
import type { EquipmentAPI, EquipmentDB } from './Equipment';
import { BookConvertToAPIFormat, BookConvertToDBFormat, BookColumns, book_table_title } from './Books';
import type { BookAPI, BookDB } from './Books';
import VarSelector from '@/app/components/VarSelector';
type WithIdentifier = { id: string, title: string };

export default function DashboardPage() {
  const [error, setError] = useState<string | null>(null);
  const [table, setTable] = useState<string>('equipment'); // 初期値は 'equipment'
  const [data, setData] = useState<unknown>([]);
  const [originalData, setOriginalData] = useState<unknown>([]);
  const tableOptions = ['equipment', 'books', 'members'];
  const tableOptionLables = ['備品', '書籍', '会員'];
  const [equipmentColumns, setEquipmentColumns] = useState<typeof EquipmentColumns>(EquipmentColumns);
  useEffect(() => {
    setTable(localStorage.getItem('table') || table);
    fetch(`https://acsl-hp.vercel.app/api/${table}`, {
      method: 'GET',
      credentials: 'include', // ← 認証用Cookie を送るのに必要
    })
      .then((res) => {
        if (!res.ok) throw new Error('認証エラーまたはデータ取得エラー');
        return res.json();
      })
      .then((data) => {
        // console.log(data);
        setData(data.message);
        setOriginalData(data.message);
        const isStaff = localStorage.getItem('role') === 'staff';
        const isStudent = localStorage.getItem('role') === 'student';
        const tmp2 = isStaff
          ? EquipmentColumns.filter(col => !EquipmentColumnsStaffHide.includes(col.key))
          : isStudent
            ? EquipmentColumns.filter(col => !EquipmentColumnsStudentHide.includes(col.key))
            : EquipmentColumns; // 管理者は全てのカラムを表示
        setEquipmentColumns(tmp2);
      })
      .catch((err) => {
        setError(err.message);
        window.location.href = '/Login';
      });
  }, [table]);

  function computeDiff<T extends WithIdentifier>(original: T[], current: T[]) {
    const originalMap = new Map(original.map(item => [item.id, item]));
    const currentMap = new Map(current.map(item => [item.id, item]));

    const added = current.filter(item => !originalMap.has(item.id));
    const deleted = original.filter(item => !currentMap.has(item.id)).map(item => item.id);
    const updated = current.filter(item => {
      const orig = originalMap.get(item.id);
      return orig && JSON.stringify(orig) !== JSON.stringify(item);
    });

    return { added, updated, deleted };
  }

  return (
    <div className="px-2 w-full">
      {<VarSelector vars={tableOptions} labels={tableOptionLables} current={table} setVar={(t: string) => { localStorage.setItem('table', t); setTable(t); }} />}
      {error && <p className="text-red-500">{error}</p>}
      {table === 'books' && (<>
        <h1 className="text-xl font-bold mb-4">{book_table_title}</h1>
        <DataTable<BookAPI>
          data={BookConvertToAPIFormat(data as BookDB[])}
          DataInfo={{ columns: BookColumns, cardEditField: [''] }}
          onSync={async (newData) => {
            const { added, updated, deleted } = computeDiff<BookAPI>(BookConvertToAPIFormat(originalData as BookDB[]), newData);
            const added_converted = BookConvertToDBFormat(added);
            const updated_converted = BookConvertToDBFormat(updated);
            await fetch(`https://acsl-hp.vercel.app/api/${table}`, {
              method: 'PUT',
              credentials: 'include',
              body: JSON.stringify({ added_converted, updated_converted, deleted }),
            });
          }}
        />
      </>)}
      {table === 'equipment' && (<>
        <h1 className="text-xl font-bold mb-4">{equipment_table_title}</h1>
        <DataTable<EquipmentAPI>
          data={EquipmentConvertToAPIFormat(data as EquipmentDB[])}
          DataInfo={{ columns: equipmentColumns, cardEditField: ['place', 'responsiblePerson'] }}
          onSync={async (newData) => {
            const { added, updated, deleted } = computeDiff<EquipmentAPI>(EquipmentConvertToAPIFormat(originalData as EquipmentDB[]), newData);
            const added_converted = EquipmentConvertToDBFormat(added);
            const updated_converted = EquipmentConvertToDBFormat(updated);
            await fetch(`https://acsl-hp.vercel.app/api/${table}`, {
              method: 'PUT',
              credentials: 'include',
              body: JSON.stringify({ added_converted, updated_converted, deleted }),
            });
          }}
        /></>)}
    </div>
  );
}
