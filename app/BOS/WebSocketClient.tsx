'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react'; // または localStorage/cookie

export default function WebSocketClient() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.token) return;

    const ws = new WebSocket(`wss://bos-wgh5.onrender.com?token=${session.token}`);
    ws.onopen = () => console.log('connected');
    ws.onmessage = (e) => console.log('message:', e.data);
    ws.onclose = () => console.log('disconnected');

    return () => ws.close();
  }, [session?.token]);

  return <div>WebSocket 状態: 接続中/未接続</div>;
}
