import { Link } from 'react-router-dom';
import { ExternalLink, LayoutGrid, RefreshCw, TrendingDown } from 'lucide-react';

import { ModelStatusBadge } from '../models/ModelStatusBadge.js';
import {
  EGS_CONSOLE_PATH,
  EGS_MODEL_PATH,
  getAgigovModel,
} from '../../platform/agigovModels.js';
import type { NetworkSyncState } from '../../api.js';
import { useSovereignConfig } from '../../context/PlatformContext.js';

type Props = {
  syncState?: NetworkSyncState;
  lastUpdated?: string | null;
  onRefresh?: () => void;
  refreshing?: boolean;
};

/** Barra operativa consola EGS — navegación app + acciones. */
export function EgsConsoleToolbar({
  syncState,
  lastUpdated,
  onRefresh,
  refreshing,
}: Props) {
  const { t } = useSovereignConfig();
  const model = getAgigovModel('egs');

  return (
    <div className="mb-8 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-500/25 bg-sky-500/10">
            <TrendingDown className="h-5 w-5 text-sky-400" aria-hidden />
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-agigov-text-muted">
              Consola operativa
            </p>
            <p className="font-display text-sm font-semibold text-agigov-text">
              Efficiency Gain Share
            </p>
          </div>
          {model ? <ModelStatusBadge modelId={model.id} status={model.status} size="md" /> : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {syncState ? (
            <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-agigov-text-muted">
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
        </div>
      </div>

      <nav
        className="mt-4 flex flex-wrap gap-2 border-t border-white/[0.06] pt-4"
        aria-label="Consola EGS"
      >
        <Link to={EGS_CONSOLE_PATH} className="ds-btn-primary ds-btn-app-shape ds-btn-sm">
          Salud presupuestaria
        </Link>
        <Link to={`${EGS_MODEL_PATH}#simulador-delta`} className="ds-btn-secondary ds-btn-app-shape ds-btn-sm">
          {t('egs.simulator.toolbar')}
        </Link>
        <Link to={EGS_MODEL_PATH} className="ds-btn-secondary ds-btn-app-shape ds-btn-sm">
          Ficha modelo
        </Link>
        <Link to="/modelos" className="ds-btn-secondary ds-btn-app-shape ds-btn-sm">
          <LayoutGrid className="h-4 w-4" />
          Catálogo
        </Link>
        <a
          href="/api/public/egs/ministry-health"
          target="_blank"
          rel="noopener noreferrer"
          className="ds-btn-secondary ds-btn-app-shape ds-btn-sm"
        >
          <ExternalLink className="h-4 w-4" />
          API demo
        </a>
      </nav>
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
