// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/app/components/DataTable';
import { BookColumns, book_table_title } from './Books';
import { GoodsColumns, GoodsColumnsStaffHide, GoodsColumnsStudentHide, goods_table_title } from './Goods';
// import { MemberColumns, member_table_title } from './Member'; 
import type { Book } from './Books';
import type { Good } from './Goods';
//import type { Member } from './Member'; 
import VarSelector from '@/app/components/VarSelector';
import BoxImageUploader from './BoxImageUploader';

export default function DashboardPage() {
  const [error, setError] = useState<string | null>(null);
  const [table, setTable] = useState<string>('goods');
  const [data, setData] = useState<unknown>([]);
  const [originalData, setOriginalData] = useState<unknown>([]);
  const tableOptions = ['books', 'goods', 'members'];
  const tableOptionLables = ['書籍', '物品', '会員'];
  const [goodsColumns, setGoodsColumns] = useState<typeof GoodsColumns>(GoodsColumns);
  // const [Token, setToken] = useState(null);
  useEffect(() => {
    // const token = localStorage.getItem('token');
    // if (!token) {
    //   window.location.href = '/Login';
    //   return;
    // }
    // setToken(token);
    setTable(localStorage.getItem('table') || table);
    // fetch(`https://acsl-hp.vercel.app/api/${table}`, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`, 
    //   },
    // })
    fetch(`https://acsl-hp.vercel.app/api/${table}`, {
      method: 'GET',
      credentials: 'include', // ← Cookie を送るのに必要
    })
      .then((res) => {
        if (!res.ok) throw new Error('認証エラーまたはデータ取得エラー');
        return res.json();
      })
      .then((data) => {
        setData(data.message);
        setOriginalData(data.message);
        const isStaff = localStorage.getItem('role') === 'staff';
        const isStudent = localStorage.getItem('role') === 'student';
        const tmp = isStaff
          ? GoodsColumns.filter(col => !GoodsColumnsStaffHide.includes(col.key))
          : isStudent
            ? GoodsColumns.filter(col => !GoodsColumnsStudentHide.includes(col.key))
            : GoodsColumns; // 管理者は全てのカラムを表示
        setGoodsColumns(tmp);
      })
      .catch((err) => {
        setError(err.message);
        // localStorage.removeItem('token');
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
      <BoxImageUploader
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
        {table === 'goods' && (<>
          <h1 className="text-xl font-bold mb-4">{goods_table_title}</h1>
          <DataTable<Good>
            data={data as Good[]}
            columns={goodsColumns}
            onSync={async (newData) => {
              const { added, updated, deleted } = computeDiff<Good>(originalData as Good[], newData);
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
