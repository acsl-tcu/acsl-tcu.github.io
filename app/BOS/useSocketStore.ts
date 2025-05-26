import { create } from 'zustand';

type State = {
  socket: WebSocket | null;
  isConnected: boolean;
  connect: (token: string) => void;
  disconnect: () => void;
};

let reconnectTimer: NodeJS.Timeout | null = null;

export const useSocketStore = create<State>((set, get) => ({
  socket: null,
  isConnected: false,

  connect: (token: string) => {
    if (get().socket) return; // 多重接続防止

    const ws = new WebSocket(`wss://bos-wgh5.onrender.com?token=${token}`);

    ws.onopen = () => {
      console.log('WebSocket connected');
      set({ socket: ws, isConnected: true });
    };

    ws.onmessage = (e) => {
      console.log('Received:', e.data);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      set({ socket: null, isConnected: false });
      attemptReconnect(token);
    };

    ws.onerror = (err) => {
      console.error('WebSocket error', err);
      ws.close(); // 強制クローズして `onclose` 経由で再接続へ
    };
  },

  disconnect: () => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    const { socket } = get();
    socket?.close();
    set({ socket: null, isConnected: false });
  }
}));

function attemptReconnect(token: string, delay = 3000) {
  if (reconnectTimer) return;

  console.log(`Reconnecting in ${delay / 1000} seconds...`);
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    useSocketStore.getState().connect(token);
  }, delay);
}
