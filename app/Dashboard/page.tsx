// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/app/components/DataTable';


interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  overview: string;
  pubdate: string;
  publisher: string;
}

const columns = [
  { key: 'isbn', label: 'ISBN' },
  { key: 'title', label: 'Title' },
  { key: 'author', label: 'Author' },
  { key: 'publisher', label: 'Publisher' },
  { key: 'pubdate', label: 'Pubdate' },
] as const;

const table_title = "書籍一覧";

export default function DashboardPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/Login';
      return;
    }

    fetch('https://acsl-hp.vercel.app/api/books?tables=books&year=2024', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('認証エラーまたはデータ取得エラー');
        return res.json();
      })
      .then((data) => {
        setBooks(data.message);
      })
      .catch((err) => {
        setError(err.message);
        localStorage.removeItem('token');
        window.location.href = '/Login';
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">{table_title}</h1>
      {error && <p className="text-red-500">{error}</p>}
      <DataTable<Book>
        data={books}
        columns={columns}
        onSync={async (data) => {
          await fetch('/api/books', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
        }}
      />
    </div>
  );
}
