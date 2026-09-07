import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Circle, Lock, ShieldAlert } from 'lucide-react';

import { fetchEgsContractDetail } from '../api.js';
import { DataConnectionState } from '../components/DataConnectionState.js';
import { PageShell, LoadingState } from '../components/PageShell.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';
import { modelWorkspacePath } from '../platform/modelWorkspace.js';

const MILESTONE_ICON = {
  LOCKED: Lock,
  VALIDATED: ShieldAlert,
  RELEASED: CheckCircle2,
} as const;

const MILESTONE_COLOR = {
  LOCKED: 'text-zinc-400',
  VALIDATED: 'text-zinc-600',
  RELEASED: 'text-zinc-900',
} as const;

function formatVes(value: string): string {
  const n = parseFloat(value);
  if (Number.isNaN(n)) return value;
  return n.toLocaleString('es-VE', { maximumFractionDigits: 0 });
}

export default function EgsContractDetailPage() {
  const { escrowProcessId = '' } = useParams();
  const { data, error, state, reload } = useCachedFetch(
    `egs-contract-${escrowProcessId}`,
    () => fetchEgsContractDetail(escrowProcessId),
    15_000,
  );

  return (
    <PageShell shell narrow>
      <div className="os-workspace">
        <Link to="/contratos" className="os-workspace-foot-link inline-flex items-center gap-1">
          ← Contratos
        </Link>

        {error && state === 'error' && !data ? (
          <DataConnectionState
            module="escrow"
            error={error}
            onRetry={() => void reload()}
          />
        ) : null}

        {!data && state !== 'error' ? <LoadingState label="Cargando contrato…" /> : null}

        {data ? (
          <>
            <header className="os-workspace-head os-workspace-head--stack">
              <div className="os-workspace-head-text">
                <p className="os-workspace-section-title">
                  {data.quarter.fiscalYear} Q{data.quarter.quarter} · Custodia
                </p>
                <h1 className="os-workspace-title">{data.contract.title}</h1>
                <p className="os-workspace-sub">
                  Territorio {data.contract.territoryCode}
                </p>
              </div>
              <div className="os-workspace-cta">
                <Link to={modelWorkspacePath('escrow-institucional')} className="ds-btn-secondary ds-btn-app-shape">
                  Espacio custodia
                </Link>
              </div>
            </header>

            {!data.quarter.reconcileOk ? (
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
                Cierre trimestral bloqueado. Pagos retenidos hasta resolución.
              </div>
            ) : null}

            <dl className="os-metrics-row">
              <div className="os-metrics-item">
                <dt className="os-metrics-label">Monto contrato</dt>
                <dd className="os-metrics-value text-base">
                  {formatVes(data.contract.totalAmount)} {data.contract.currency}
                </dd>
              </div>
              <div className="os-metrics-item">
                <dt className="os-metrics-label">Liberado verificado</dt>
                <dd className="os-metrics-value text-base">
                  {formatVes(data.contract.spentAmount)} {data.contract.currency}
                </dd>
              </div>
            </dl>

            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={data.contract.escrowStatus} />
              <span className="inline-flex rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs text-zinc-700">
                {data.contract.status === 'ok'
                  ? 'Sin discrepancias'
                  : data.contract.status === 'discrepancy'
                    ? 'Discrepancia detectada'
                    : 'Ejecución parcial'}
              </span>
            </div>

            <section className="os-workspace-section">
              <h2 className="os-workspace-section-title">Cadena de custodia — hitos</h2>
              <ol className="os-workspace-list">
                {data.milestones.map((milestone) => {
                  const Icon = MILESTONE_ICON[milestone.state] ?? Circle;
                  return (
                    <li key={milestone.index}>
                      <article className="os-panel">
                        <div className="flex items-start gap-3">
                          <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${MILESTONE_COLOR[milestone.state]}`} />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-medium text-zinc-900">{milestone.label}</span>
                              <StatusBadge status={milestone.state} />
                            </div>

                            {milestone.state !== 'LOCKED' ? (
                              <dl className="mt-3 grid gap-2 text-[13px] sm:grid-cols-2">
                                <div>
                                  <dt className="text-zinc-500">Monto liberado</dt>
                                  <dd className="font-medium text-zinc-900">
                                    {formatVes(milestone.amount)} {data.contract.currency}
                                  </dd>
                                </div>
                                <div>
                                  <dt className="text-zinc-500">Verificado</dt>
                                  <dd className="text-zinc-700">
                                    {milestone.verifiedAt
                                      ? new Date(milestone.verifiedAt).toLocaleString('es-VE')
                                      : '—'}
                                  </dd>
                                </div>
                                {milestone.evidenceRef ? (
                                  <div className="sm:col-span-2">
                                    <dt className="text-zinc-500">Evidencia verificable</dt>
                                    <dd className="os-mono-id break-all text-xs">{milestone.evidenceRef}</dd>
                                  </div>
                                ) : null}
                                {milestone.validators ? (
                                  <>
                                    <div className="sm:col-span-2">
                                      <dt className="text-zinc-500">Validación</dt>
                                      <dd className="os-mono-id text-xs">{milestone.validators.centinela}</dd>
                                    </div>
                                    <div>
                                      <dt className="text-zinc-500">Sensor IoT</dt>
                                      <dd className="os-mono-id text-xs">{milestone.validators.iot}</dd>
                                    </div>
                                    <div>
                                      <dt className="text-zinc-500">Auditores</dt>
                                      <dd className="os-mono-id text-xs">
                                        {milestone.validators.citizens.join(' · ')}
                                      </dd>
                                    </div>
                                  </>
                                ) : null}
                              </dl>
                            ) : (
                              <p className="mt-2 text-[13px] text-zinc-600">
                                Fondos en custodia hasta verificar la evidencia.
                              </p>
                            )}
                          </div>
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ol>
            </section>

            {data.ledgerProcessId ? (
              <p className="text-xs text-zinc-500">
                Registro verificable: <span className="os-mono-id">{data.ledgerProcessId}</span>
              </p>
            ) : null}
          </>
        ) : null}
      </div>
    </PageShell>
  );
}
