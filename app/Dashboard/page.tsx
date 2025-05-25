// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/app/components/DataTable';
import { BookColumns, book_table_title } from './Books'; // 必要なら分離
import { GoodsColumns, goods_table_title } from './Goods'; // 必要なら分離
// import { MemberColumns, member_table_title } from './Member'; // 必要な
import type { Book } from './Books'; // 必要なら分離
import type { Good } from './Goods'; // 必要なら分離
//import type { Member } from './Member'; // 必要な

export default function DashboardPage() {
  const [error, setError] = useState<string | null>(null);
  const [table, setTable] = useState("books");
  const [data, setData] = useState<unknown>([]); // 最初は unknown としておく

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
      })
      .catch((err) => {
        setError(err.message);
        localStorage.removeItem('token');
        window.location.href = '/Login';
      });
  }, [table]);
  const tableOptions = ['books', 'goods', 'members'];

  return (
    <div className="p-8">
      {tableOptions.map((t) => (
        <button
          key={t}
          onClick={() => setTable(t)}
          className={`px-4 py-2 rounded border ${table === t ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'
            }`}
        >
          {t === 'books' && '書籍'}
          {t === 'goods' && '物品'}
          {t === 'members' && '会員'}
        </button>))}
      {error && <p className="text-red-500">{error}</p>}
      {table === 'books' && (<>
        <h1 className="text-xl font-bold mb-4">{book_table_title}</h1>
        <DataTable<Book>
          data={data as Book[]}
          columns={BookColumns}
          onSync={async (data) => {
            await fetch(`https://acsl-hp.vercel.app/api/${table}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });
          }}
        /></>)
      }
      {table === 'goods' && (<>
        <h1 className="text-xl font-bold mb-4">{goods_table_title}</h1>
        <DataTable<Good>
          data={data as Good[]}
          columns={GoodsColumns}
          onSync={async (data) => {
            await fetch(`https://acsl-hp.vercel.app/api/${table}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });
          }}
        /></>)
      }
    </div>
  );
}
