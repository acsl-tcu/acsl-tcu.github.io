'use client';

import { useEffect, useState } from 'react';
type User = {
  id: number;
  name: string;
  email: string;
};




export default function DashboardPage() {
  const [data, setData] = useState<User[]>([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetch('https://acsl-hp.vercel.app/app/api/protected/data', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((d) => setData(d));
  }, []);

  return (
    <div>
      <h1>認証後のデータ</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
