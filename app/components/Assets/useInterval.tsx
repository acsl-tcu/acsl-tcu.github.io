import { useEffect, useRef } from 'react';

function useInterval(callback: () => void, delay: number | null, run: boolean) {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (run && delay !== null) {
      const tick = () => savedCallback.current?.();
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay, run]);
}

export default useInterval;
