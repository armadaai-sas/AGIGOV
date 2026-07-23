import { useCallback, useState } from 'react';

import { fetchMinistryHealth } from '../api.js';
import { useSovereignConfig } from '../context/PlatformContext.js';
import { EgsConsoleToolbar } from '../components/egs/EgsConsoleToolbar.js';
import { MinistryHealthPanel, MinistryHealthUnavailable } from '../components/egs/MinistryHealthPanel.js';
import { breadcrumbsForPath } from '../components/AppBreadcrumbs.js';
import {
  ServiceConnectionPanel,
} from '../components/services/ServiceConnectionPanel.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';
import { DataConnectionState } from '../components/DataConnectionState.js';
import {
  PageShell,
  SectionHeader,
  LoadingState,
} from '../components/PageShell.js';
import { EGS_CONSOLE_PATH, EGS_MODEL_PATH } from '../platform/agigovModels.js';

/** Consola operativa EGS — layout app, breadcrumbs, telemetría presupuestaria. */
export default function EgsVialConsolePage() {
  const [serviceReady, setServiceReady] = useState<boolean | null>(null);
  const { sovereign } = useSovereignConfig();
  const health = useCachedFetch(
    `ministry-health-${sovereign.iso}`,
    () => fetchMinistryHealth(sovereign.ministryCode),
    15_000,
  );

  const handleReadyChange = useCallback(
    (ready: boolean) => {
      setServiceReady(ready);
      if (ready) void health.reload();
    },
    [health],
  );

  const showHealth = serviceReady === true && health.data;

  return (
    <PageShell
      narrow={false}
      banner={
        showHealth
          ? { state: health.state === 'error' ? 'offline' : health.state, lastUpdated: health.lastUpdated }
          : undefined
      }
      breadcrumbs={breadcrumbsForPath(EGS_CONSOLE_PATH)}
    >
      <EgsConsoleToolbar
        syncState={showHealth ? health.state : undefined}
        lastUpdated={health.lastUpdated}
        onRefresh={showHealth ? () => void health.reload() : undefined}
        refreshing={health.state === 'syncing'}
      />

      <SectionHeader
        eyebrow="AGIGOV · Gubernamental · EGS"
        title="Salud presupuestaria"
        lead="Cierre trimestral demo: baseline firmada, gasto verificado en ledger y ahorro verificado con reparto 70/20/10."
        helpTopic="proyectos"
      />

      {serviceReady !== true ? (
        <ServiceConnectionPanel showConsoleLink={false} onReadyChange={handleReadyChange} />
      ) : health.state === 'syncing' && !health.data ? (
        <LoadingState label="Cargando consola operativa…" />
      ) : health.error && !health.data ? (
        <DataConnectionState
          module="egs"
          error={health.error}
          onRetry={() => void health.reload()}
        />
      ) : health.data ? (
        <MinistryHealthPanel data={health.data} />
      ) : (
        <MinistryHealthUnavailable />
      )}

      <p className="mt-10 text-center text-xs text-agigov-text-muted">
        Demo técnica · sin tesorería nacional conectada ·{' '}
        <a href={EGS_MODEL_PATH} className="text-sky-400 no-underline hover:text-sky-300">
          Ver ficha EGS
        </a>
      </p>
    </PageShell>
  );
}
