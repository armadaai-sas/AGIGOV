import { Link } from 'react-router-dom';
import { useCallback, useState } from 'react';

import { fetchMinistryHealth } from '../api.js';
import { useSovereignConfig } from '../context/PlatformContext.js';
import { EgsConsoleToolbar } from '../components/egs/EgsConsoleToolbar.js';
import { MinistryHealthPanel, MinistryHealthUnavailable } from '../components/egs/MinistryHealthPanel.js';
import { ServiceConnectionPanel } from '../components/services/ServiceConnectionPanel.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';
import { DataConnectionState } from '../components/DataConnectionState.js';
import { PageShell, LoadingState } from '../components/PageShell.js';
import { EGS_MODEL_PATH } from '../platform/agigovModels.js';
import { modelWorkspacePath } from '../platform/modelWorkspace.js';

/** EGS desplegado — salud presupuestaria (sin capa marketing). */
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
      shell
      narrow={false}
      banner={
        showHealth
          ? {
              state: health.state === 'error' ? 'offline' : health.state,
              lastUpdated: health.lastUpdated,
            }
          : undefined
      }
    >
      <div className="os-workspace">
        <EgsConsoleToolbar
          syncState={showHealth ? health.state : undefined}
          lastUpdated={health.lastUpdated}
          onRefresh={showHealth ? () => void health.reload() : undefined}
          refreshing={health.state === 'syncing'}
        />

        <header className="os-workspace-head">
          <div className="os-workspace-head-text">
            <h1 className="os-workspace-title">Reparto del ahorro por eficiencia</h1>
            <p className="os-workspace-sub">Línea base, gasto verificado y cierre trimestral.</p>
          </div>
          <div className="os-workspace-cta">
            <Link to={modelWorkspacePath('egs')} className="ds-btn-secondary ds-btn-app-shape">
              Espacio EGS
            </Link>
            <Link to={EGS_MODEL_PATH} className="os-btn-text ml-2 text-[13px]">
              Ficha
            </Link>
          </div>
        </header>

        {serviceReady !== true ? (
          <ServiceConnectionPanel showConsoleLink={false} onReadyChange={handleReadyChange} />
        ) : health.state === 'syncing' && !health.data ? (
          <LoadingState label="Cargando datos…" />
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
      </div>
    </PageShell>
  );
}
