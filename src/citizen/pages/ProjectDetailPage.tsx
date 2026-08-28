import { useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  CheckCircle2,
  Circle,
  Droplets,
  GraduationCap,
  HeartPulse,
  Landmark,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import {
  fetchProjectDetail,
  submitContribution,
  type ContributionReceipt,
  type ProjectItem,
} from '../api.js';
import { ActionReceipt } from '../components/ActionReceipt.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';
import { DataConnectionState } from '../components/DataConnectionState.js';
import {
  PageShell,
  LoadingState,
  DsSpinner,
} from '../components/PageShell.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { modelWorkspacePath } from '../platform/modelWorkspace.js';

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
    <PageShell shell narrow banner={undefined}>
      <div className="os-workspace">
        <Link to="/proyectos?tab=dao" className="os-workspace-foot-link inline-flex items-center gap-1">
          ← Proyectos DAO
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
      </div>
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
  const target = parseFloat(project.targetAmount) || 1;
  const raised = parseFloat(project.raisedAmount) || 0;
  const pct = Math.min(100, Math.round((raised / target) * 100));

  return (
    <>
      <header className="os-workspace-head os-workspace-head--stack">
        <div className="os-workspace-head-text">
          <p className="os-workspace-section-title">{project.sector}</p>
          <h1 className="os-workspace-title">{project.title}</h1>
          <p className="os-workspace-sub">
            {raised.toLocaleString('es-VE')} / {target.toLocaleString('es-VE')} {project.currency} · {pct}%
          </p>
        </div>
      </header>

      <section className="os-panel">
        <p className="text-[13px] text-zinc-600">
          {project.territoryCode} · {project.contributions} aportes ·{' '}
          <StatusBadge status={project.escrow?.status ?? 'PENDING'} />
        </p>

        {project.milestones.length > 0 ? (
          <ul className="mt-4 space-y-1.5 text-[13px] text-zinc-600">
            {project.milestones.map((m) => (
              <li key={m.label} className="flex items-center gap-2">
                {m.done ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-zinc-500" />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-zinc-300" />
                )}
                {m.label}
              </li>
            ))}
          </ul>
        ) : null}

        <ContributeForm project={project} onContributed={onContributed} />
      </section>
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
    <form onSubmit={(e) => void handleContribute(e)} className="mt-4 border-t border-zinc-200 pt-4">
      <p className="text-[13px] font-medium text-zinc-900">Aportar al proyecto</p>
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
      {formError ? <p className="mt-2 text-sm text-zinc-600 agigov-enter-up">{formError}</p> : null}
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
