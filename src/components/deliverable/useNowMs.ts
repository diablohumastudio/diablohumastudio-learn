import { useEffect, useState } from 'react';

/** The device clock, refreshed every `tickMs`: for countdowns and running/finished states. */
export function useNowMs(tickMs: number): number {
  const [nowMs, setNowMs] = useState(() => Date.now());
  useEffect(() => {
    const interval = window.setInterval(() => setNowMs(Date.now()), tickMs);
    return () => window.clearInterval(interval);
  }, [tickMs]);
  return nowMs;
}
