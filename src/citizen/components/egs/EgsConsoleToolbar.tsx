import { Link } from 'react-router-dom';
import { ExternalLink, RefreshCw } from 'lucide-react';

import { ModelStatusBadge } from '../models/ModelStatusBadge.js';
import {
  EGS_MODEL_PATH,
  getAgigovModel,
} from '../../platform/agigovModels.js';
import type { NetworkSyncState } from '../../api.js';

type Props = {
  syncState?: NetworkSyncState;
  lastUpdated?: string | null;
  onRefresh?: () => void;
  refreshing?: boolean;
};

/** Barra operativa consola EGS — título + acciones mínimas. */
export function EgsConsoleToolbar({
  syncState,
  lastUpdated,
  onRefresh,
  refreshing,
}: Props) {
  const model = getAgigovModel('egs');

  return (
    <div className="mb-8 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-agigov-text-muted">
              Consola operativa
            </p>
            <h1 className="font-display text-base font-semibold text-agigov-text sm:text-lg">
              Salud presupuestaria · EGS
            </h1>
          </div>
          {model ? <ModelStatusBadge modelId={model.id} status={model.status} size="md" /> : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {syncState ? (
            <span className="rounded-full border border-agigov-border px-2.5 py-1 text-[10px] text-agigov-text-muted">
              {syncLabel(syncState)}
              {lastUpdated ? ` · ${new Date(lastUpdated).toLocaleTimeString()}` : ''}
            </span>
          ) : null}
          {onRefresh ? (
            <button
              type="button"
              className="ds-btn-secondary ds-btn-app-shape ds-btn-sm"
              onClick={onRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
          ) : null}
          <Link to={EGS_MODEL_PATH} className="ds-btn-app ds-btn-sm">
            Ficha modelo
          </Link>
          <a
            href="/api/public/egs/ministry-health"
            target="_blank"
            rel="noopener noreferrer"
            className="agigov-link inline-flex items-center gap-1 text-sm"
          >
            API
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

function syncLabel(state: NetworkSyncState): string {
  switch (state) {
    case 'synced':
      return 'Sincronizado';
    case 'syncing':
      return 'Actualizando…';
    case 'offline':
      return 'Offline · caché';
    case 'error':
      return 'Error de sync';
    default:
      return state;
  }
}
