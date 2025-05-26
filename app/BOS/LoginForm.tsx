'use client';

import { useState } from 'react';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log('[1] フォーム送信開始');
      console.log('入力内容:', { username, password });

      const res = await fetch('https://bos-wgh5.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      console.log('[2] サーバー応答ステータス:', res.status);

      if (!res.ok) {
        const errorData = await res.json();
        console.log('[3] 認証失敗:', errorData);
        setMessage(`エラー: ${errorData.error}`);
        return;
      }

      const data = await res.json();
      console.log('[4] 認証成功: トークン取得', data.token);

      localStorage.setItem('authToken', data.token);
      setMessage('✅ ログイン成功！');
      window.location.href = "./WebSocket/";
    } catch (err) {
      console.error('[X] フェッチ中エラー:', err);
      setMessage('❌ ログイン失敗：ネットワークエラー');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md p-4 mx-auto border rounded shadow">
      <h2 className="text-xl font-bold mb-4">ログイン</h2>

      <label className="block mb-2">
        ユーザー名:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </label>

      <label className="block mb-4">
        パスワード:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </label>

      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        ログイン
      </button>

      {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
    </form>
  );
}