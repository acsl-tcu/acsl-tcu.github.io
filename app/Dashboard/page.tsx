// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import BookList from '@/app/components/BookList';

type Book = {
  id: number;
  title: string;
  author: string;
};

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
      .then((data) => setBooks(data.message[0]))
      .catch((err) => {
        setError(err.message);
        localStorage.removeItem('token');
        // window.location.href = '/Login';
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">書籍一覧</h1>
      {error && <p className="text-red-500">{error}</p>}
      <BookList books={books} />
    </div>
  );
}
