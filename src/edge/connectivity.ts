import { getCoreDb } from '../db/client.js';

export interface ConnectivityStatus {
  online: boolean;
  postgres: boolean;
  http: boolean;
  checkedAt: string;
  detail?: string;
}

async function probePostgres(): Promise<boolean> {
  try {
    await getCoreDb().$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

async function probeHttp(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(5_000),
      headers: { Accept: 'application/json' },
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Comprueba si el core es alcanzable (Postgres y/o API pública). */
export async function checkCoreConnectivity(
  healthUrl: string,
): Promise<ConnectivityStatus> {
  const [postgres, http] = await Promise.all([
    probePostgres(),
    probeHttp(healthUrl),
  ]);
  const online = postgres || http;

  return {
    online,
    postgres,
    http,
    checkedAt: new Date().toISOString(),
    detail: online
      ? `postgres=${postgres} http=${http}`
      : 'Core no alcanzable — sync diferido',
  };
}
