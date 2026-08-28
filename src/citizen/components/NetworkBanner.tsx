import type { NetworkSyncState } from '../api.js';
import { PlatformAlert } from './PlatformAlert.js';

const LABELS: Record<Exclude<NetworkSyncState, 'synced'>, string> = {
  offline: 'Sin conexión — datos guardados',
  syncing: 'Sincronizando…',
  error: 'Error al sincronizar',
};

const VARIANTS: Record<
  Exclude<NetworkSyncState, 'synced'>,
  'offline' | 'info' | 'error'
> = {
  offline: 'offline',
  syncing: 'info',
  error: 'error',
};

/** Solo avisa cuando hay problema — no banner en cada sync OK. */
export function NetworkBanner({
  state,
  lastUpdated,
}: {
  state: NetworkSyncState;
  lastUpdated: string | null;
}) {
  if (state === 'synced') return null;

  return (
    <PlatformAlert variant={VARIANTS[state]} title={LABELS[state]} banner>
      {lastUpdated && state !== 'syncing' ? (
        <> · {new Date(lastUpdated).toLocaleString('es-VE')}</>
      ) : null}
    </PlatformAlert>
  );
}
