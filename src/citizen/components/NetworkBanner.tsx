import type { NetworkSyncState } from '../api.js';
import { PlatformAlert } from './PlatformAlert.js';

const LABELS: Record<NetworkSyncState, string> = {
  offline: 'Sin conexión — mostrando datos guardados',
  syncing: 'Sincronizando con el nodo…',
  synced: 'Actualizado desde ledger público',
  error: 'Error al sincronizar — el nodo de demostración no responde',
};

const VARIANTS: Record<
  NetworkSyncState,
  'offline' | 'info' | 'success' | 'error'
> = {
  offline: 'offline',
  syncing: 'info',
  synced: 'success',
  error: 'error',
};

export function NetworkBanner({
  state,
  lastUpdated,
}: {
  state: NetworkSyncState;
  lastUpdated: string | null;
}) {
  return (
    <PlatformAlert variant={VARIANTS[state]} title={LABELS[state]} banner>
      {lastUpdated && state !== 'syncing' ? (
        <> · {new Date(lastUpdated).toLocaleString('es-VE')}</>
      ) : null}
    </PlatformAlert>
  );
}
