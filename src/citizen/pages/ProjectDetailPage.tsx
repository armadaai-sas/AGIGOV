import { useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import {
  fetchProjectDetail,
  submitContribution,
  type ContributionReceipt,
  type ProjectItem,
} from '../api.js';
import { ActionReceipt } from '../components/ActionReceipt.js';
import { breadcrumbsForPath } from '../components/AppBreadcrumbs.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';
import { DataConnectionState } from '../components/DataConnectionState.js';
import {
  PageShell,
  SectionHeader,
  LoadingState,
  DsSpinner,
} from '../components/PageShell.js';
import { StatusBadge } from '../components/StatusBadge.js';
import {
  Droplets,
  GraduationCap,
  HeartPulse,
  Landmark,
} from 'lucide-react';

const SECTOR_ICON: Record<string, LucideIcon> = {
  infraestructura: Droplets,
  educacion: GraduationCap,
  salud: HeartPulse,
  general: Landmark,
};

export default function ProjectDetailPage() {
  const { id = '' } = useParams();
  const { data, error, state, reload } = useCachedFetch(
    `project-${id}`,
    () => fetchProjectDetail(id),
    15_000,
  );

  const project = data?.project;

  return (
    <PageShell banner={undefined} breadcrumbs={breadcrumbsForPath(`/proyectos/${id}`)}>
      <Link to="/proyectos" className="agigov-help-back">
        <ArrowLeft className="h-4 w-4" />
        Todos los proyectos
      </Link>

      {error && state === 'error' && !data ? (
        <DataConnectionState
          module="projects"
          error={error}
          onRetry={() => void reload()}
        />
      ) : null}

      {!project && state !== 'error' ? <LoadingState label="Cargando proyecto…" /> : null}

      {project ? (
        <ProjectDetail
          project={project}
          onContributed={() => window.setTimeout(() => void reload(), 1200)}
        />
      ) : null}
    </PageShell>
  );
}

function ProjectDetail({
  project,
  onContributed,
}: {
  project: ProjectItem & { recentContributions: Array<{ receiptId: string; amount: number; currency: string; committedAt: string }> };
  onContributed: () => void;
}) {
  const Icon = SECTOR_ICON[project.sector] ?? Landmark;
  const target = parseFloat(project.targetAmount) || 1;
  const raised = parseFloat(project.raisedAmount) || 0;
  const pct = Math.min(100, Math.round((raised / target) * 100));

  return (
    <>
      <SectionHeader
        eyebrow="AGIGOV · Prosperidad Compartida (DAO)"
        title={project.title}
        lead={`Territorio ${project.territoryCode} · ${project.sector}`}
        helpTopic="proyectos"
      />

      <article className="agigov-card">
        <div className="flex items-start gap-4">
          <div className="agigov-pillar-icon shrink-0">
            <Icon className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={project.escrow?.status ?? 'PENDING'} />
              {project.daoApproved ? (
                <span className="agigov-badge bg-emerald-500/15 text-emerald-200">DAO aprobado</span>
              ) : null}
              {project.funded ? (
                <span className="agigov-badge bg-sky-500/15 text-sky-200">Meta financiada</span>
              ) : null}
              <span className="agigov-mono-id">{project.id}</span>
            </div>
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
            <div className="agigov-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-xs text-agigov-text-muted">{project.contributions} aportes registrados</p>
        </div>

        {project.milestones.length > 0 ? (
          <section className="mt-8 border-t border-white/5 pt-6">
            <h2 className="font-display text-lg font-semibold">Hitos logístico</h2>
            <ul className="mt-4 space-y-2">
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
          </section>
        ) : null}

        <ContributeForm project={project} onContributed={onContributed} />

        {project.recentContributions.length > 0 ? (
          <section className="mt-8 border-t border-white/5 pt-6">
            <h2 className="font-display text-lg font-semibold">Aportes recientes (agregados)</h2>
            <ul className="mt-4 space-y-2">
              {project.recentContributions.map((c) => (
                <li key={c.receiptId} className="flex flex-wrap justify-between gap-2 text-sm">
                  <span className="agigov-mono-id">{c.receiptId.slice(0, 16)}…</span>
                  <span>
                    {c.amount} {c.currency}
                  </span>
                  <time className="text-agigov-text-muted">
                    {new Date(c.committedAt).toLocaleString('es-VE')}
                  </time>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>
    </>
  );
}

function ContributeForm({
  project,
  onContributed,
}: {
  project: ProjectItem;
  onContributed: () => void;
}) {
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
        territoryCode: project.territoryCode,
      });
      setReceipt(result.receipt);
      onContributed();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Error al aportar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={(e) => void handleContribute(e)} className="mt-8 border-t border-white/5 pt-6">
      <p className="text-sm font-medium text-agigov-text">Aportar al proyecto</p>
      <p className="mt-1 text-xs text-agigov-text-muted">
        Registro en ledger (piloto). Pasarela fiat real = HMAC listo · proveedor pendiente. Token
        gobernanza = roadmap (no mainnet).
      </p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <input
          type="number"
          min="1"
          max="10000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="agigov-input sm:max-w-[140px]"
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
        >
          <p>
            {receipt.amount} {receipt.currency} · {receipt.territoryCode}
          </p>
        </ActionReceipt>
      ) : null}
    </form>
  );
}
