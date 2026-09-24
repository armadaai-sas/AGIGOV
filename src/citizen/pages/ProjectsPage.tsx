import { useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

import {
  fetchMinistryHealth,
  fetchProjects,
  type MinistryHealthResponse,
  type ProjectItem,
} from '../api.js';
import {
  MinistryHealthPanel,
  MinistryHealthUnavailable,
} from '../components/egs/MinistryHealthPanel.js';
import { EGS_CONSOLE_PATH } from '../services/egs-vial-service.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';
import { DataConnectionState } from '../components/DataConnectionState.js';
import {
  PageShell,
  LoadingState,
  EmptyState,
} from '../components/PageShell.js';
import { modelWorkspacePath } from '../platform/modelWorkspace.js';
import {
  Droplets,
  GraduationCap,
  HeartPulse,
  Landmark,
  Activity,
  Briefcase,
  ChevronRight,
} from 'lucide-react';

type ProjectsTab = 'salud' | 'dao';

const SECTOR_ICON: Record<string, LucideIcon> = {
  infraestructura: Droplets,
  educacion: GraduationCap,
  salud: HeartPulse,
  general: Landmark,
};

export default function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [tab, setTab] = useState<ProjectsTab>(
    tabParam === 'dao' ? 'dao' : tabParam === 'salud' ? 'salud' : 'dao',
  );

  const health = useCachedFetch('ministry-health', () => fetchMinistryHealth('MPPI'), 15_000);
  const dao = useCachedFetch('projects', fetchProjects);

  useEffect(() => {
    if (tabParam === 'dao') {
      setTab('dao');
      return;
    }
    if (tabParam === 'salud') {
      setTab('salud');
    }
  }, [tabParam]);

  function selectTab(next: ProjectsTab) {
    setTab(next);
    setSearchParams(next === 'dao' ? { tab: 'dao' } : { tab: 'salud' }, { replace: true });
  }

  const bannerState =
    tab === 'salud'
      ? health.state === 'error'
        ? 'offline'
        : health.state
      : dao.state === 'error'
        ? 'offline'
        : dao.state;
  const bannerUpdated =
    tab === 'salud' ? health.lastUpdated : dao.lastUpdated;

  const healthFatal =
    tab === 'salud' && Boolean(health.error && health.state === 'error' && !health.data);
  const daoFatal =
    tab === 'dao' && Boolean(dao.error && dao.state === 'error' && !dao.data);
  const suppressBanner = healthFatal || daoFatal;

  return (
    <PageShell
      shell
      narrow
      banner={suppressBanner ? undefined : { state: bannerState, lastUpdated: bannerUpdated }}
    >
      <div className="os-workspace">
        <header className="os-workspace-head os-workspace-head--stack">
          <div className="os-workspace-head-text">
            <h1 className="os-workspace-title">Proyectos</h1>
            <p className="os-workspace-sub">
              Obras y causas con aportes. El pago sale cuando la etapa está hecha.
            </p>
          </div>
          <div className="os-workspace-cta">
            <Link
              to={modelWorkspacePath(tab === 'salud' ? 'egs' : 'dao-ciudadano')}
              className="ds-btn-secondary ds-btn-app-shape"
            >
              {tab === 'salud' ? 'Abrir el cierre' : 'Abrir el modelo'}
            </Link>
          </div>
        </header>

        <ul className="os-workspace-list">
            <li>
              <button
                type="button"
                onClick={() => selectTab('salud')}
                className={`os-workspace-row w-full text-left${tab === 'salud' ? ' os-workspace-row--active' : ''}`}
              >
                <span className="os-workspace-row-icon" aria-hidden>
                  <Activity className="h-4 w-4" />
                </span>
                <span className="os-workspace-row-body">
                  <span className="os-workspace-row-name">Ahorro del trimestre</span>
                  <span className="os-workspace-row-meta">Lo presupuestado frente a lo gastado</span>
                </span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => selectTab('dao')}
                className={`os-workspace-row w-full text-left${tab === 'dao' ? ' os-workspace-row--active' : ''}`}
              >
                <span className="os-workspace-row-icon" aria-hidden>
                  <Briefcase className="h-4 w-4" />
                </span>
                <span className="os-workspace-row-body">
                  <span className="os-workspace-row-name">Obras con aportes</span>
                  <span className="os-workspace-row-meta">Monto reunido y etapa</span>
                </span>
              </button>
            </li>
          </ul>

        {tab === 'salud' ? <SaludTab health={health} /> : <DaoTab dao={dao} />}
      </div>
    </PageShell>
  );
}

function SaludTab({
  health,
}: {
  health: ReturnType<typeof useCachedFetch<MinistryHealthResponse>>;
}) {
  if (health.error && health.state === 'error' && !health.data) {
    return (
      <DataConnectionState
        module="egs"
        error={health.error}
        onRetry={() => void health.reload()}
      />
    );
  }

  if (!health.data && health.state !== 'error') {
    return <LoadingState label="Cargando salud del ministerio…" />;
  }

  if (health.data) {
    return (
      <>
        <MinistryHealthPanel data={health.data} />
        <Link to={EGS_CONSOLE_PATH} className="os-workspace-foot-link mt-4 inline-flex items-center gap-1">
          Consola EGS completa
          <ChevronRight className="h-4 w-4" />
        </Link>
      </>
    );
  }

  return (
    <>
      <MinistryHealthUnavailable />
      <Link to={EGS_CONSOLE_PATH} className="os-workspace-foot-link mt-4 inline-flex items-center gap-1">
        Abrir consola EGS
        <ChevronRight className="h-4 w-4" />
      </Link>
    </>
  );
}

function DaoTab({
  dao,
}: {
  dao: ReturnType<typeof useCachedFetch<Awaited<ReturnType<typeof fetchProjects>>>>;
}) {
  return (
    <>
      {dao.error && dao.state === 'error' && !dao.data ? (
        <DataConnectionState
          module="projects"
          error={dao.error}
          onRetry={() => void dao.reload()}
        />
      ) : null}

      {!dao.data && dao.state !== 'error' ? <LoadingState /> : null}

      {dao.data ? (
        <div className="os-workspace-section">
          <dl className="os-metrics-row">
            <div className="os-metrics-item">
              <dt className="os-metrics-label">Proyectos</dt>
              <dd className="os-metrics-value">{dao.data.summary.projectCount}</dd>
            </div>
            <div className="os-metrics-item">
              <dt className="os-metrics-label">Recaudado</dt>
              <dd className="os-metrics-value text-base">
                {parseFloat(dao.data.summary.totalRaised).toLocaleString('es-VE')}{' '}
                {dao.data.summary.currency}
              </dd>
            </div>
            <div className="os-metrics-item">
              <dt className="os-metrics-label">Aportes</dt>
              <dd className="os-metrics-value">{dao.data.summary.totalContributions}</dd>
            </div>
          </dl>

          {dao.data.projects.length === 0 ? (
            <EmptyState
              title="Sin proyectos publicados"
              description="Proyectos aprobados con fondos en escrow se listarán aquí cuando estén publicados."
            />
          ) : (
            <ul className="os-workspace-list">
              {dao.data.projects.map((project) => (
                <li key={project.id}>
                  <ProjectRow project={project} />
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </>
  );
}

function ProjectRow({ project }: { project: ProjectItem }) {
  const Icon = SECTOR_ICON[project.sector] ?? Landmark;
  const target = parseFloat(project.targetAmount) || 1;
  const raised = parseFloat(project.raisedAmount) || 0;
  const pct = Math.min(100, Math.round((raised / target) * 100));

  return (
    <Link to={`/proyectos/${project.id}`} className="os-workspace-row">
      <span className="os-workspace-row-icon" aria-hidden>
        <Icon className="h-4 w-4" />
      </span>
      <span className="os-workspace-row-body">
        <span className="os-workspace-row-name">{project.title}</span>
        <span className="os-workspace-row-meta">
          {pct}% · {project.contributions} aportes · {project.territoryCode}
        </span>
      </span>
      <ChevronRight className="os-workspace-row-chevron h-4 w-4" aria-hidden />
    </Link>
  );
}
