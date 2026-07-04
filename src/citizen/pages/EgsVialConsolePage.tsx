import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { fetchMinistryHealth } from '../api.js';
import { MinistryHealthPanel } from '../components/egs/MinistryHealthPanel.js';
import { breadcrumbsForPath } from '../components/AppBreadcrumbs.js';
import {
  EgsServiceUnavailable,
  ServiceConnectionPanel,
} from '../components/services/ServiceConnectionPanel.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';
import {
  PageShell,
  SectionHeader,
  ErrorState,
  LoadingState,
} from '../components/PageShell.js';
import {
  EGS_CONSOLE_PATH,
  EGS_MODEL_PATH,
} from '../services/egs-vial-service.js';

/** Consola operativa EGS — sin tabs DAO, solo verdad presupuestaria. */
export default function EgsVialConsolePage() {
  const [serviceReady, setServiceReady] = useState<boolean | null>(null);
  const health = useCachedFetch('ministry-health', () => fetchMinistryHealth('MPPI'), 15_000);

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
      banner={
        showHealth
          ? { state: health.state === 'error' ? 'offline' : health.state, lastUpdated: health.lastUpdated }
          : undefined
      }
      breadcrumbs={breadcrumbsForPath(EGS_CONSOLE_PATH)}
    >
      <Link to={EGS_MODEL_PATH} className="agigov-help-back">
        <ArrowLeft className="h-4 w-4" />
        Modelo Efficiency Gain Share
      </Link>

      <SectionHeader
        eyebrow="AGIGOV · Gubernamental · EGS · Consola"
        title="Salud presupuestaria"
        lead={
          <>
            Cierre trimestral · partida presupuestaria demo · baseline, gasto verificado y ahorro Δ
            en tiempo real.
          </>
        }
        helpTopic="proyectos"
      />

      {serviceReady !== true ? (
        <ServiceConnectionPanel showConsoleLink={false} onReadyChange={handleReadyChange} />
      ) : health.state === 'syncing' && !health.data ? (
        <LoadingState label="Cargando consola operativa…" />
      ) : health.error && !health.data ? (
        <div className="space-y-4">
          <EgsServiceUnavailable compact />
          <ErrorState message="No se pudo cargar el panel operativo." onRetry={() => void health.reload()} />
        </div>
      ) : health.data ? (
        <MinistryHealthPanel data={health.data} />
      ) : (
        <EgsServiceUnavailable />
      )}
    </PageShell>
  );
}
