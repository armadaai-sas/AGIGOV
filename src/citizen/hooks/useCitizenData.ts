import { useCallback, useEffect, useState } from 'react';

import { readCache, writeCache } from '../cache.js';
import type { NetworkSyncState } from '../api.js';

export function useCachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  pollMs = 30_000,
) {
  const [state, setState] = useState<NetworkSyncState>(
    navigator.onLine ? 'syncing' : 'offline',
  );
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!navigator.onLine) {
      const cached = await readCache<T>(key);
      if (cached) {
        setData(cached);
        setState('offline');
      }
      return;
    }

    setState('syncing');
    try {
      const fresh = await fetcher();
      setData(fresh);
      await writeCache(key, fresh);
      setState('synced');
      setLastUpdated(new Date().toISOString());
      setError(null);
    } catch (e) {
      const cached = await readCache<T>(key);
      if (cached) {
        setData(cached);
        setState('offline');
      } else {
        setState('error');
        setError(e instanceof Error ? e.message : 'Error de red');
      }
    }
  }, [fetcher, key]);

  useEffect(() => {
    const onOnline = () => void load();
    const onOffline = () => setState('offline');
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, [load]);

  useEffect(() => {
    void load();
    const id = setInterval(() => void load(), pollMs);
    return () => clearInterval(id);
  }, [load, pollMs]);

  return { data, error, state, lastUpdated, reload: load, setData };
}
