import { Link } from 'react-router-dom';
import { CheckCircle2, RefreshCw } from 'lucide-react';

import { StateHint } from '../PageShell.js';
import { getAgigovModel } from '../../platform/agigovModels.js';
import {
  getCatalogSyncStats,
  getModelStatusSync,
  MODEL_STATUS_LABEL,
} from '../../platform/modelStatusSync.js';

const DEV_MODE = import.meta.env.DEV;

export function CatalogSyncStrip() {
  const stats = getCatalogSyncStats();
  const synced = stats.outOfSync === 0;
  const auditDate = new Date(stats.lastAuditAt).toLocaleString();

  // Ciudadanos no necesitan strip de auditoría si todo está alineado.
  if (synced && !DEV_MODE) return null;

  return (
    <StateHint>
      <div className="flex flex-wrap items-start gap-3">
        {synced ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-zinc-600" aria-hidden />
        ) : (
          <RefreshCw className="mt-0.5 h-5 w-5 shrink-0 text-zinc-400" aria-hidden />
        )}
        <div className="min-w-0 flex-1">
          <p className="agigov-page-state-kicker">
            {synced ? 'Modelos sincronizados' : 'Estados de modelos desalineados'}
          </p>
          <p className="text-sm text-agigov-text">
            <strong>{stats.inSync}/{stats.total}</strong> alineados ·{' '}
            <strong>{stats.approved}</strong> aprobados · auditoría {auditDate}
          </p>
          {!synced ? (
            <ul className="mt-2 space-y-1 text-xs text-agigov-text-muted">
              {stats.driftIds.map((id) => {
                const model = getAgigovModel(id);
                if (!model) return null;
                const sync = getModelStatusSync(id, model.status);
                return (
                  <li key={id}>
                    <Link to={model.productPath} className="text-zinc-600 hover:underline">
                      {model.shortName}
                    </Link>
                    : listado{' '}
                    <span className="font-medium">{MODEL_STATUS_LABEL[sync.catalogStatus]}</span>
                    {' · '}auditoría{' '}
                    <span className="font-medium">
                      {sync.auditStatus ? MODEL_STATUS_LABEL[sync.auditStatus] : '—'}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : null}
          {DEV_MODE ? (
            <p className="mt-2 text-xs text-agigov-text-muted">
              Sincronizar: <code className="agigov-mono-id">npm run models:audit</code>
            </p>
          ) : null}
        </div>
      </div>
    </StateHint>
  );
}
