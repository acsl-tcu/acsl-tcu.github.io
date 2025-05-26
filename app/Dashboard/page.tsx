// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/app/components/DataTable';
import { BookColumns, book_table_title } from './Books';
import { GoodsColumns, goods_table_title } from './Goods';
// import { MemberColumns, member_table_title } from './Member'; 
import type { Book } from './Books';
import type { Good } from './Goods';
//import type { Member } from './Member'; 
import VarSelector from '@/app/components/VarSelector';

export default function DashboardPage() {
  const [error, setError] = useState<string | null>(null);
  const [table, setTable] = useState("books");
  const [data, setData] = useState<unknown>([]);
  const [originalData, setOriginalData] = useState<unknown>([]);
  const tableOptions = ['books', 'goods', 'members'];
  const tableOptionLables = ['書籍', '物品', '会員'];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/Login';
      return;
    }

    fetch(`https://acsl-hp.vercel.app/api/${table}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('認証エラーまたはデータ取得エラー');
        return res.json();
      })
      .then((data) => {
        setData(data.message);
        setOriginalData(data.message);
      })
      .catch((err) => {
        setError(err.message);
        localStorage.removeItem('token');
        window.location.href = '/Login';
      });
  }, [table]);

  function computeDiff<T extends { id: string | number }>(original: T[], current: T[]) {
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
      {<VarSelector vars={tableOptions} labels={tableOptionLables} current={table} setVar={setTable} />}
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
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ added, updated, deleted }),
            });
          }}
        />
      </>)}
      {table === 'goods' && (<>
        <h1 className="text-xl font-bold mb-4">{goods_table_title}</h1>
        <DataTable<Good>
          data={data as Good[]}
          columns={GoodsColumns}
          onSync={async (newData) => {
            const { added, updated, deleted } = computeDiff<Good>(originalData as Good[], newData);
            await fetch(`https://acsl-hp.vercel.app/api/${table}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ added, updated, deleted }),
            });
          }}
        /></>)}
    </div>
  );
}
