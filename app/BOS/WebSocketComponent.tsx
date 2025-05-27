'use client';

import { useEffect } from 'react';
import { useSocketStore } from './useSocketStore';

export default function WebSocketComponent() {
  const { connect, disconnect, isConnected } = useSocketStore();

  useEffect(() => {
    const token = localStorage.getItem('authToken') || '';
    connect(token);

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return <div>WebSocket: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</div>;
}
