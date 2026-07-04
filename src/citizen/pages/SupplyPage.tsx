import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { fetchSupply } from '../api.js';
import { breadcrumbsForPath } from '../components/AppBreadcrumbs.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';
import { DataConnectionState } from '../components/DataConnectionState.js';
import {
  PageShell,
  SectionHeader,
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
    <PageShell banner={{ state, lastUpdated }} breadcrumbs={breadcrumbsForPath('/suministros')}>
      <SectionHeader
        eyebrow="AGIGOV · Logística territorial"
        title="Suministros públicos"
        lead="Agregados del agente Logístico — agua, energía, granos. Datos sin información personal."
        helpTopic="suministros"
        action={
          <Link to="/gestion" className="ds-btn-secondary ds-btn-app-shape hidden sm:inline-flex">
            Ver gestión
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      {error && state === 'error' && !data ? (
        <DataConnectionState
          module="supply"
          error={error}
          onRetry={() => void reload()}
        />
      ) : null}

      {!data && state !== 'error' ? <LoadingState /> : null}

      {data ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {data.inventory.length === 0 ? (
            <div className="sm:col-span-2">
              <EmptyState
                title="Sin datos de inventario"
                description="Agregados del agente Logístico — agua, energía, granos — aparecerán aquí cuando haya registros publicados."
                hint="Modo demo: npm run db:seed && npm run agents:flow"
              />
            </div>
          ) : (
            data.inventory.map((item) => (
              <div key={item.status} className="agigov-stat">
                <StatusBadge status={item.status} />
                <p className="mt-4 font-display text-3xl font-bold text-agigov-text">
                  {item.totalAmount} {item.currency}
                </p>
                <p className="mt-2 text-sm text-agigov-text-muted">
                  {item.count} registros agregados
                </p>
              </div>
            ))
          )}
        </div>
      ) : null}
    </PageShell>
  );
}
