import type { NetworkSyncState } from '../api.js';

const LABELS: Record<NetworkSyncState, string> = {
  offline: 'Sin conexión — mostrando datos guardados',
  syncing: 'Sincronizando con el nodo…',
  synced: 'Actualizado desde ledger público',
  error: 'Error al sincronizar — el nodo de demostración no responde. Verifique la conexión.',
};

const TONES: Record<NetworkSyncState, string> = {
  offline: 'bg-amber-950/90 text-amber-50 border-amber-700/40',
  syncing: 'bg-sky-950/90 text-sky-50 border-sky-700/40',
  synced: 'bg-emerald-950/90 text-emerald-50 border-emerald-800/40',
  error: 'bg-red-950/90 text-red-50 border-red-800/40',
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
      className={`border-b px-4 py-2.5 text-center text-sm ${TONES[state]}`}
      role="status"
      aria-live="polite"
    >
      <span className="font-medium">{LABELS[state]}</span>
      {lastUpdated && state !== 'syncing' ? (
        <span className="ml-2 opacity-75">
          · {new Date(lastUpdated).toLocaleString('es-VE')}
        </span>
      ) : null}
    </div>
  );
}
