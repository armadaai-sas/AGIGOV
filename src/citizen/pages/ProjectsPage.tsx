import { useEffect, useState, type FormEvent } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';

import {
  fetchMinistryHealth,
  fetchProjects,
  submitContribution,
  type ContributionReceipt,
  type MinistryHealthResponse,
  type ProjectItem,
} from '../api.js';
import {
  MinistryHealthPanel,
  MinistryHealthUnavailable,
} from '../components/egs/MinistryHealthPanel.js';
import { EgsServiceUnavailable } from '../components/services/ServiceConnectionPanel.js';
import { EGS_CONSOLE_PATH } from '../services/egs-vial-service.js';
import { ActionReceipt } from '../components/ActionReceipt.js';
import { breadcrumbsForPath } from '../components/AppBreadcrumbs.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';
import { applyContributionOptimistic } from '../utils/optimisticProjects.js';
import {
  PageShell,
  SectionHeader,
  ErrorState,
  LoadingState,
  EmptyState,
  DsSpinner,
} from '../components/PageShell.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { usePlatform } from '../context/PlatformContext.js';
import { usesFunnelNav } from '../platform/navConfig.js';
import {
  Droplets,
  GraduationCap,
  HeartPulse,
  Landmark,
  Coins,
  Users,
  CheckCircle2,
  Circle,
  Activity,
  Briefcase,
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
  const { implementationId } = usePlatform();
  const funnelNav = usesFunnelNav(implementationId);
  const [tab, setTab] = useState<ProjectsTab>(
    tabParam === 'dao' ? 'dao' : 'salud',
  );

  const health = useCachedFetch('ministry-health', () => fetchMinistryHealth('MPPI'), 15_000);
  const dao = useCachedFetch('projects', fetchProjects);

  useEffect(() => {
    if (tabParam === 'dao') {
      setTab('dao');
      return;
    }
    if (tabParam === 'salud' || tabParam === null) {
      setTab('salud');
    }
  }, [tabParam]);

  function selectTab(next: ProjectsTab) {
    setTab(next);
    setSearchParams(next === 'salud' ? {} : { tab: 'dao' }, { replace: true });
  }

  function handleContributed(projectId: string, receipt: ContributionReceipt) {
    if (dao.data) {
      dao.setData(applyContributionOptimistic(dao.data, projectId, receipt));
    }
    window.setTimeout(() => void dao.reload(), 1200);
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

  if (funnelNav && tabParam !== 'dao') {
    return <Navigate to={EGS_CONSOLE_PATH} replace />;
  }

  return (
    <PageShell
      banner={{ state: bannerState, lastUpdated: bannerUpdated }}
      breadcrumbs={breadcrumbsForPath('/proyectos')}
    >
      <SectionHeader
        eyebrow="AGIGOV · Prosperidad Compartida (DAO)"
        title={tab === 'salud' ? 'Salud presupuestaria EGS' : 'Proyectos DAO'}
        lead={
          tab === 'salud' ? (
            <>
              Cierre trimestral EGS · baseline, gasto verificado y ahorro Δ en tiempo real.
            </>
          ) : (
            <>Proyectos con escrow programático y aportes ciudadanos trazables.</>
          )
        }
        helpTopic="proyectos"
      />

      {!funnelNav || tab === 'dao' ? (
        <div className="mb-8 flex gap-2 rounded-lg border border-white/5 bg-white/[0.02] p-1">
          <TabButton
            active={tab === 'salud'}
            onClick={() => selectTab('salud')}
            icon={Activity}
            label="Salud del Ministerio"
          />
          <TabButton
            active={tab === 'dao'}
            onClick={() => selectTab('dao')}
            icon={Briefcase}
            label="Proyectos DAO"
          />
        </div>
      ) : null}

      {tab === 'salud' ? (
        <SaludTab health={health} />
      ) : (
        <DaoTab dao={dao} onContributed={handleContributed} />
      )}
    </PageShell>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
        active
          ? 'bg-sky-500/20 text-sky-100 shadow-sm'
          : 'text-agigov-text-muted hover:bg-white/5 hover:text-agigov-text'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function SaludTab({
  health,
}: {
  health: ReturnType<typeof useCachedFetch<MinistryHealthResponse>>;
}) {
  if (health.error && health.state === 'error' && !health.data) {
    return (
      <div className="space-y-4">
        <EgsServiceUnavailable compact />
        <ErrorState message={health.error} onRetry={() => void health.reload()} />
      </div>
    );
  }

  if (!health.data && health.state !== 'error') {
    return <LoadingState label="Cargando salud del ministerio…" />;
  }

  if (health.data) {
    return <MinistryHealthPanel data={health.data} />;
  }

  return <MinistryHealthUnavailable />;
}

function DaoTab({
  dao,
  onContributed,
}: {
  dao: ReturnType<typeof useCachedFetch<Awaited<ReturnType<typeof fetchProjects>>>>;
  onContributed: (projectId: string, receipt: ContributionReceipt) => void;
}) {
  return (
    <>
      {dao.error && dao.state === 'error' ? (
        <ErrorState message={dao.error} onRetry={() => void dao.reload()} />
      ) : null}

      {!dao.data && dao.state !== 'error' ? <LoadingState /> : null}

      {dao.data ? (
        <div className="space-y-8 agigov-stagger-list">
          <section className="grid grid-cols-3 gap-3">
            <SummaryStat icon={Landmark} label="Proyectos" value={String(dao.data.summary.projectCount)} />
            <SummaryStat
              icon={Coins}
              label="Recaudado"
              value={`${parseFloat(dao.data.summary.totalRaised).toLocaleString('es-VE')}`}
              suffix={dao.data.summary.currency}
            />
            <SummaryStat
              icon={Users}
              label="Aportes"
              value={String(dao.data.summary.totalContributions)}
            />
          </section>

          <section className="space-y-5">
            {dao.data.projects.length === 0 ? (
              <EmptyState
                title="Sin proyectos publicados"
                description="Proyectos aprobados con fondos en escrow programático se listarán aquí cuando estén en estado publicado."
                hint="Modo demo: npm run db:seed"
              />
            ) : (
              dao.data.projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onContributed={onContributed}
                />
              ))
            )}
          </section>
        </div>
      ) : null}
    </>
  );
}

function SummaryStat({
  icon: Icon,
  label,
  value,
  suffix,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  suffix?: string;
}) {
  return (
    <div className="agigov-stat text-center sm:text-left">
      <Icon className="mx-auto mb-2 h-5 w-5 text-sky-400 sm:mx-0" />
      <p className="text-[10px] font-medium uppercase tracking-wide text-agigov-text-muted">
        {label}
      </p>
      <p className="mt-1 font-display text-lg font-bold text-agigov-text sm:text-xl">
        {value}
        {suffix ? (
          <span className="ml-1 text-xs font-normal text-agigov-text-muted">{suffix}</span>
        ) : null}
      </p>
    </div>
  );
}

function ProjectCard({
  project,
  onContributed,
}: {
  project: ProjectItem;
  onContributed: (projectId: string, receipt: ContributionReceipt) => void;
}) {
  const Icon = SECTOR_ICON[project.sector] ?? Landmark;
  const target = parseFloat(project.targetAmount) || 1;
  const raised = parseFloat(project.raisedAmount) || 0;
  const pct = Math.min(100, Math.round((raised / target) * 100));
  const escrowStatus = project.escrow?.status ?? 'PENDING';

  const [amount, setAmount] = useState('100');
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState<ContributionReceipt | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleContribute(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setReceipt(null);
    const value = parseFloat(amount);
    if (Number.isNaN(value) || value <= 0) {
      setFormError('Ingresa un monto válido');
      return;
    }
    setLoading(true);
    try {
      const result = await submitContribution({
        projectId: project.id,
        amount: value,
        territoryCode: project.territoryCode || 'MAR_NORTH_01',
      });
      setReceipt(result.receipt);
      onContributed(project.id, result.receipt);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Error al aportar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="agigov-card agigov-card-interactive">
      <div className="flex items-start gap-4">
        <div className="agigov-pillar-icon shrink-0">
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="agigov-badge-global">{project.sector}</span>
            <span className="agigov-mono-id">{project.territoryCode}</span>
            {project.daoApproved ? (
              <span className="agigov-badge bg-emerald-500/15 text-emerald-200">DAO aprobado</span>
            ) : null}
          </div>
          <h2 className="mt-3 font-display text-xl font-semibold text-agigov-text">
            <Link to={`/proyectos/${project.id}`} className="agigov-link-hover">
              {project.title}
            </Link>
          </h2>
          <p className="mt-1 agigov-mono-id">{project.id}</p>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-sm text-agigov-text-muted">
          <span>
            {raised.toLocaleString('es-VE')} / {target.toLocaleString('es-VE')} {project.currency}
          </span>
          <span className="font-semibold text-sky-300">{pct}%</span>
        </div>
        <div className="agigov-progress-track">
          <div
            className="agigov-progress-fill"
            style={{ width: `${pct}%` }}
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-xs text-agigov-text-muted">{project.contributions} aportes</span>
          <StatusBadge status={escrowStatus} />
        </div>
      </div>

      {project.milestones.length > 0 ? (
        <ul className="mt-6 space-y-2 border-t border-white/5 pt-5">
          {project.milestones.map((m) => (
            <li key={m.label} className="flex items-center gap-2.5 text-sm text-agigov-text-muted">
              {m.done ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              ) : (
                <Circle className="h-4 w-4 shrink-0 text-white/20" />
              )}
              {m.label}
            </li>
          ))}
        </ul>
      ) : null}

      <form onSubmit={(e) => void handleContribute(e)} className="mt-6 border-t border-white/5 pt-5">
        <p className="text-sm font-medium text-agigov-text">Aportar al proyecto (demo)</p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            type="number"
            min="1"
            max="10000"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="agigov-input sm:max-w-[140px]"
            placeholder="Monto demo"
            aria-label="Monto en bolívares"
          />
          <button type="submit" disabled={loading} className="ds-btn-app w-full sm:flex-1">
            {loading ? <DsSpinner /> : null}
            Registrar aporte
          </button>
        </div>
        {formError ? <p className="mt-2 text-sm text-red-300 agigov-enter-up">{formError}</p> : null}
        {receipt ? (
          <ActionReceipt
            className="mt-4"
            title="Aporte registrado en ledger"
            monoId={receipt.receiptId}
            onDismiss={() => setReceipt(null)}
            action={{ label: 'Ver detalle del proyecto', to: `/proyectos/${project.id}` }}
          >
            <p>
              {receipt.amount} {receipt.currency} · {receipt.territoryCode}
            </p>
          </ActionReceipt>
        ) : null}
      </form>
    </article>
  );
}
