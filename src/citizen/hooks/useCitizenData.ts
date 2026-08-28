import { useCallback, useEffect, useRef, useState } from 'react';

import { readCache, writeCache } from '../cache.js';
import type { NetworkSyncState } from '../api.js';

export function useCachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  pollMs = 30_000,
) {
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const dataRef = useRef<T | null>(null);
  const [state, setState] = useState<NetworkSyncState>(
    navigator.onLine ? 'syncing' : 'offline',
  );
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (options?: { background?: boolean }) => {
    const background = options?.background ?? false;
    const hasData = dataRef.current !== null;

    if (!navigator.onLine) {
      const cached = await readCache<T>(key);
      if (cached) {
        dataRef.current = cached;
        setData(cached);
        setState('offline');
        setError(null);
      }
      return;
    }

    if (!background && !hasData) {
      setState('syncing');
    }

    try {
      const fresh = await fetcherRef.current();
      dataRef.current = fresh;
      setData(fresh);
      await writeCache(key, fresh);
      setState('synced');
      setLastUpdated(new Date().toISOString());
      setError(null);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Error de red';
      const cached = await readCache<T>(key);
      const fallback = cached ?? dataRef.current;
      if (fallback !== null) {
        dataRef.current = fallback;
        setData(fallback);
        setState('offline');
        setError(message);
      } else {
        dataRef.current = null;
        setData(null);
        setState('error');
        setError(message);
      }
    }
  }, [key]);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const cached = await readCache<T>(key);
      if (cancelled) return;
      if (cached) {
        dataRef.current = cached;
        setData(cached);
        setState(navigator.onLine ? 'synced' : 'offline');
      }
      await load({ background: Boolean(cached) });
    })();

    return () => {
      cancelled = true;
    };
  }, [key, load]);

  useEffect(() => {
    const onOnline = () => void load({ background: true });
    const onOffline = () => setState('offline');
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, [load]);

  useEffect(() => {
    const id = setInterval(() => void load({ background: true }), pollMs);
    return () => clearInterval(id);
  }, [load, pollMs]);

  const setDataExternal = useCallback((value: T | null | ((prev: T | null) => T | null)) => {
    setData((prev) => {
      const next =
        typeof value === 'function'
          ? (value as (prev: T | null) => T | null)(prev)
          : value;
      dataRef.current = next;
      return next;
    });
  }, []);

  return { data, error, state, lastUpdated, reload: load, setData: setDataExternal };
}
