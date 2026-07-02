import type { NetworkSyncState } from '../api.js';

const LABELS: Record<NetworkSyncState, string> = {
  offline: 'Sin conexión — mostrando datos guardados',
  syncing: 'Sincronizando con el nodo…',
  synced: 'Actualizado desde ledger público',
  error: 'Error al sincronizar',
};

const TONES: Record<NetworkSyncState, string> = {
  offline: 'bg-amber-950/80 text-amber-200 border-amber-800',
  syncing: 'bg-cyan-950/80 text-cyan-200 border-cyan-800',
  synced: 'bg-emerald-950/80 text-emerald-200 border-emerald-800',
  error: 'bg-red-950/80 text-red-200 border-red-800',
};

export function NetworkBanner({
  state,
  lastUpdated,
}: {
  state: NetworkSyncState;
  lastUpdated: string | null;
}) {
  return (
    <div
      className={`sticky top-0 z-50 border-b px-4 py-2 text-center text-sm font-mono ${TONES[state]}`}
      role="status"
      aria-live="polite"
    >
      {LABELS[state]}
      {lastUpdated && state !== 'syncing' ? (
        <span className="ml-2 opacity-70">
          · {new Date(lastUpdated).toLocaleString('es-VE')}
        </span>
      ) : null}
    </div>
  );
}
