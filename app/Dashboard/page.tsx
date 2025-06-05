// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/app/components/DataTable';
import { BookColumns, book_table_title } from './Books';
import { EquipmentColumns, EquipmentColumnsStaffHide, EquipmentColumnsStudentHide, equipment_table_title } from './Equipment';
// import { MemberColumns, member_table_title } from './Member'; 
import type { Book } from './Books';
import type { Equipment } from './Equipment';
//import type { Member } from './Member'; 
import VarSelector from '@/app/components/VarSelector';
type WithIdOrItemNumber = { id: string } | { itemNumber: string };

export default function DashboardPage() {
  const [error, setError] = useState<string | null>(null);
  const [table, setTable] = useState<string>('goods');
  const [data, setData] = useState<unknown>([]);
  const [originalData, setOriginalData] = useState<unknown>([]);
  const tableOptions = ['equipment', 'books', 'goods', 'members'];
  const tableOptionLables = ['備品', '書籍', '物品', '会員'];
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

  function computeDiff<T extends WithIdOrItemNumber>(original: T[], current: T[]) {
    const originalMap = new Map(original.map(item => [("id" in item ? item.id : item.itemNumber), item]));
    const currentMap = new Map(current.map(item => [("id" in item ? item.id : item.itemNumber), item]));

    const added = current.filter(item => !originalMap.has(("id" in item ? item.id : item.itemNumber)));
    const deleted = original.filter(item => !currentMap.has(("id" in item ? item.id : item.itemNumber))).map(item => ("id" in item ? item.id : item.itemNumber));
    const updated = current.filter(item => {
      const orig = originalMap.get(("id" in item ? item.id : item.itemNumber));
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
        <DataTable<Book>
          data={data as Book[]}
          columns={BookColumns}
          onSync={async (newData) => {
            const { added, updated, deleted } = computeDiff<Book>(originalData as Book[], newData);
            await fetch(`https://acsl-hp.vercel.app/api/${table}`, {
              method: 'PUT',
              credentials: 'include',
              body: JSON.stringify({ added, updated, deleted }),
            });
          }}
        />
      </>)}
      {table === 'equipment' && (<>
        <h1 className="text-xl font-bold mb-4">{equipment_table_title}</h1>
        <DataTable<Equipment>
          data={data as Equipment[]}
          columns={equipmentColumns}
          onSync={async (newData) => {
            const { added, updated, deleted } = computeDiff<Equipment>(originalData as Equipment[], newData);
            await fetch(`https://acsl-hp.vercel.app/api/${table}`, {
              method: 'PUT',
              credentials: 'include',
              body: JSON.stringify({ added, updated, deleted }),
            });
          }}
        /></>)}
    </div>
  );
}
