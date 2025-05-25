'use client';

import { useEffect, useState } from 'react';
// import Main from './Main';
type User = {
  id: number;
  name: string;
  email: string;
};

export default function DashboardPage() {
  const [data, setData] = useState<User[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token'); // ✅ localStorageから取得

    if (!token) {
      window.location.href = "/Login";
      return;
    }

    fetch('https://acsl-hp.vercel.app/api/protected/data', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('認証失敗');
        return res.json();
      })
      .then((d) => setData(d))
      .catch(() => {
        localStorage.removeItem('token');
        window.location.href = "/Login";
      });
  }, []);

  return (
    <div>
      <h1>認証後のデータ</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      {/* <Main /> */}
    </div>
  );
}
