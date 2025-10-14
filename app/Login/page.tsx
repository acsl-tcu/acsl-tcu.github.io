// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const searchParams = useSearchParams();
  const redirectQuery = searchParams.get('redirect') || "/Dashboard";

  // redirectは string | string[] | undefined なのでstring型に変換
  const redirectUrl = Array.isArray(redirectQuery) ? redirectQuery[0] : redirectQuery;

  const login = async () => {
    console.log("Login action start!!");
    const res = await fetch('https://acsl-hp.vercel.app/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    if (res.ok) {
      localStorage.setItem('role', email);
      window.location.href = redirectUrl;
    }else {
      const err = await res.json();
      alert("ログイン失敗: " + err.message);
    }
  };

  return (
    <div>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="name" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" />
      <button onClick={login}
        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition transform duration-150"
      >Login</button>
    </div>
  );
}
