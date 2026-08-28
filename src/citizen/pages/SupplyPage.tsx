import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { fetchSupply } from '../api.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';
import { DataConnectionState } from '../components/DataConnectionState.js';
import {
  PageShell,
  LoadingState,
  EmptyState,
} from '../components/PageShell.js';
import { StatusBadge } from '../components/StatusBadge.js';

export default function SupplyPage() {
  const { data, error, state, lastUpdated, reload } = useCachedFetch(
    'supply',
    fetchSupply,
  );

  return (
    <PageShell shell banner={{ state, lastUpdated }}>
      <div className="os-workspace">
        <header className="os-workspace-head">
          <div className="os-workspace-head-text">
            <h1 className="os-workspace-title">Suministros</h1>
            <p className="os-workspace-sub">
              Agregados del agente Logístico — sin información personal.
            </p>
          </div>
          <div className="os-workspace-cta">
            <Link to="/gestion" className="ds-btn-secondary ds-btn-app-shape hidden sm:inline-flex">
              Ver gestión
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </header>

        {error && state === 'error' && !data ? (
          <DataConnectionState module="supply" error={error} onRetry={() => void reload()} />
        ) : null}

        {!data && state !== 'error' ? <LoadingState /> : null}

        {data ? (
          data.inventory.length === 0 ? (
            <EmptyState
              title="Sin datos de inventario"
              description="Cuando el pipeline publique suministros agregados, aparecerán aquí."
            />
          ) : (
            <ul className="os-workspace-list">
              {data.inventory.map((item) => (
                <li key={item.status}>
                  <article className="os-workspace-row os-workspace-row--static">
                    <span className="os-workspace-row-body">
                      <span className="os-workspace-row-name">
                        {item.totalAmount} {item.currency}
                      </span>
                      <span className="os-workspace-row-meta">
                        {item.count} registros agregados
                      </span>
                    </span>
                    <StatusBadge status={item.status} />
                  </article>
                </li>
              ))}
            </ul>
          )
        ) : null}
      </div>
    </PageShell>
  );
}
