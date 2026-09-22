import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';

import {
  fetchEgsMinistryStatus,
  fetchEgsPipeline,
  fetchMinistryHealth,
  type EgsMinistryStatusResponse,
  type EgsPipelineResponse,
} from '../api.js';
import { MinistryEgsConsole, MinistryEgsEmpty } from '../components/egs/MinistryEgsConsole.js';
import { ModelConsoleLayout } from '../components/models/ModelConsoleLayout.js';
import { DataConnectionState } from '../components/DataConnectionState.js';
import { PageShell, LoadingState } from '../components/PageShell.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';
import { agigovIconProps } from '../components/icons/agigovIcon.js';
import { useSovereignConfig } from '../context/PlatformContext.js';
import { useInstitutionAuth } from '../institutional/useInstitutionAuth.js';
import { useEgsMinistryScope } from '../institutional/useEgsMinistryScope.js';
import { getAgigovModel, EGS_MODEL_PATH } from '../platform/agigovModels.js';
import {
  ministryEgsResultLine,
  ministryEgsStatusHint,
} from '../platform/egsMinistryCopy.js';
import { egsDemoHealth, egsDemoPipeline, egsDemoStatus } from './egsDemoFixture.js';

/** EGS — consola ministerio (Estado territorial §7.3). */
export default function EgsVialConsolePage() {
  const model = getAgigovModel('egs');
  const { sovereign } = useSovereignConfig();
  const { isAuthenticated } = useInstitutionAuth();
  const { ministryCode, displayName } = useEgsMinistryScope();
  const [searchParams] = useSearchParams();
  const demo = searchParams.get('demo') === '1';
  const [pipeline, setPipeline] = useState<EgsPipelineResponse | null>(null);
  const [status, setStatus] = useState<EgsMinistryStatusResponse | null>(null);

  const demoData = useMemo(() => (demo ? egsDemoHealth() : null), [demo]);
  const demoStatus = useMemo(() => (demo ? egsDemoStatus() : null), [demo]);
  const demoPipeline = useMemo(() => (demo ? egsDemoPipeline() : null), [demo]);

  const health = useCachedFetch(
    `ministry-health-${ministryCode}`,
    () => fetchMinistryHealth(ministryCode),
    15_000,
  );

  const loadStatus = useCallback(async () => {
    try {
      setStatus(await fetchEgsMinistryStatus(ministryCode));
    } catch {
      setStatus(null);
    }
  }, [ministryCode]);

  const loadPipeline = useCallback(async () => {
    try {
      setPipeline(await fetchEgsPipeline());
    } catch {
      setPipeline(null);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([health.reload(), loadStatus(), loadPipeline()]);
  }, [health, loadPipeline, loadStatus]);

  useEffect(() => {
    void loadPipeline();
  }, [loadPipeline]);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus, health.data?.updatedAt]);

  const data = demo ? demoData : health.data;
  const effectiveStatus = demo ? demoStatus : status;
  const effectivePipeline = demo ? demoPipeline : pipeline;
  const noData = !demo && Boolean(health.error && !health.data);
  const loading = !demo && health.state === 'syncing' && !health.data;

  const title = data
    ? `${data.ministryCode} · ${data.programName}`
    : `${ministryCode} · ${displayName || 'Programa piloto'}`;

  const quarterLabel = data ? `Q${data.quarter} ${data.fiscalYear}` : '';

  return (
    <PageShell
      shell
      narrow
      banner={
        demo
          ? { state: 'synced', lastUpdated: demoData?.updatedAt ?? null }
          : data
            ? { state: health.state, lastUpdated: health.lastUpdated }
            : undefined
      }
    >
      <ModelConsoleLayout
        eyebrow={model?.shortName ?? 'EGS'}
        title={title}
        result={
          data
            ? ministryEgsResultLine(data)
            : 'Interconecta presupuesto, ejecución y ahorro verificable — de ministerio a territorio.'
        }
        dataHint={data ? ministryEgsStatusHint(data) : quarterLabel || sovereign.ministryCode}
        action={
          <button
            type="button"
            className="app-btn app-btn--secondary inline-flex items-center gap-1.5"
            onClick={() => void refreshAll()}
          >
            <RefreshCw {...agigovIconProps('md')} />
            Actualizar
          </button>
        }
      >
        {demo ? (
          <p className="egs-demo-banner" role="note">
            Modo demostración · datos de ejemplo (MPPI). No son datos publicados reales.
          </p>
        ) : null}

        {loading ? <LoadingState label="Cargando datos de la institución…" /> : null}

        {noData && !loading ? (
          <>
            <MinistryEgsEmpty ministryCode={ministryCode} isAuthenticated={isAuthenticated} />
            {health.error && health.state === 'error' ? (
              <DataConnectionState
                module="egs"
                error={health.error}
                onRetry={() => void refreshAll()}
              />
            ) : null}
          </>
        ) : null}

        {data && effectiveStatus ? (
          <MinistryEgsConsole
            data={data}
            status={effectiveStatus}
            pipeline={effectivePipeline}
            isAuthenticated={isAuthenticated}
            onPublished={() => void refreshAll()}
          />
        ) : null}

        <p className="model-console-foot">
          <Link to={EGS_MODEL_PATH} className="desk-console-foot-link">
            Ficha del modelo EGS
          </Link>
        </p>
      </ModelConsoleLayout>
    </PageShell>
  );
}
