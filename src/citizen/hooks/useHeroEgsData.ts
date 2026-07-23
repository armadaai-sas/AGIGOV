import { useMemo } from 'react';

import type { MinistryHealthResponse } from '../api.js';
import { usePlatform } from '../context/PlatformContext.js';
import { fetchHomeHeroEgs, getHeroDemoData } from '../components/home/homeHeroData.js';
import { useCachedFetch } from './useCitizenData.js';

const LIVE_API_ISOS = new Set(['VEN', 'COL', 'USA']);

/** API cuando hay seed en ledger; demo localizado si no hay datos. */
export function useHeroEgsData(cacheKey: string, refreshMs = 30_000) {
  const { sovereign, t } = usePlatform();
  const programKey =
    sovereign.iso === 'COL'
      ? 'demo.program.col'
      : sovereign.iso === 'USA'
        ? 'demo.program.usa'
        : sovereign.iso === 'VEN'
          ? 'demo.program.ven'
          : 'demo.program.gen';

  const localizedDemo = useMemo(
    () => getHeroDemoData(sovereign, t(programKey)),
    [sovereign, t, programKey],
  );

  const useLiveApi = LIVE_API_ISOS.has(sovereign.iso);
  const health = useCachedFetch(
    `${cacheKey}-${sovereign.iso}-${sovereign.ministryCode}`,
    () => fetchHomeHeroEgs(sovereign.ministryCode),
    useLiveApi ? refreshMs : 86_400_000,
  );

  const data: MinistryHealthResponse = useMemo(() => {
    if (useLiveApi && health.data) return health.data;
    return localizedDemo;
  }, [useLiveApi, health.data, localizedDemo]);

  return {
    data,
    live: useLiveApi && Boolean(health.data),
    syncing: useLiveApi && !health.data && health.state !== 'error',
  };
}
