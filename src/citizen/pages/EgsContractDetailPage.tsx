import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Lock,
  ShieldAlert,
} from 'lucide-react';

import { fetchEgsContractDetail } from '../api.js';
import { breadcrumbsForPath } from '../components/AppBreadcrumbs.js';
import { DataConnectionState } from '../components/DataConnectionState.js';
import {
  PageShell,
  SectionHeader,
  LoadingState,
} from '../components/PageShell.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';

const MILESTONE_ICON = {
  LOCKED: Lock,
  VALIDATED: ShieldAlert,
  RELEASED: CheckCircle2,
} as const;

const MILESTONE_COLOR = {
  LOCKED: 'text-white/30',
  VALIDATED: 'text-amber-400',
  RELEASED: 'text-emerald-400',
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
    <PageShell
      banner={undefined}
      breadcrumbs={breadcrumbsForPath(`/proyectos/contrato/${escrowProcessId}`)}
    >
      <Link to="/proyectos" className="agigov-help-back">
        <ArrowLeft className="h-4 w-4" />
        Salud del Ministerio
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
          <SectionHeader
            eyebrow={`${data.quarter.fiscalYear} Q${data.quarter.quarter} · Escrow Institucional`}
            title={data.contract.title}
            lead={`Territorio ${data.contract.territoryCode} · Smart Escrow programático`}
            helpTopic="proyectos"
          />

          {!data.quarter.reconcileOk ? (
            <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              Cierre trimestral bloqueado. Este contrato puede tener pagos retenidos.
            </div>
          ) : null}

          <article className="agigov-card">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={data.contract.escrowStatus} />
              <span
                className={`agigov-badge ${
                  data.contract.status === 'ok'
                    ? 'bg-emerald-500/15 text-emerald-200'
                    : data.contract.status === 'discrepancy'
                      ? 'bg-red-500/15 text-red-200'
                      : 'bg-amber-500/15 text-amber-200'
                }`}
              >
                {data.contract.status === 'ok'
                  ? 'Sin discrepancias'
                  : data.contract.status === 'discrepancy'
                    ? 'Discrepancia detectada'
                    : 'Ejecución parcial'}
              </span>
              <span className="agigov-mono-id">{data.contract.id}</span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-agigov-text-muted">Monto contrato</p>
                <p className="font-display text-lg font-semibold">
                  {formatVes(data.contract.totalAmount)} {data.contract.currency}
                </p>
              </div>
              <div>
                <p className="text-xs text-agigov-text-muted">Liberado verificado</p>
                <p className="font-display text-lg font-semibold text-emerald-300">
                  {formatVes(data.contract.spentAmount)} {data.contract.currency}
                </p>
              </div>
            </div>

            <section className="mt-8 border-t border-white/5 pt-6">
              <h2 className="font-display text-lg font-semibold">Cadena de custodia — 5 hitos</h2>
              <p className="mt-1 text-sm text-agigov-text-muted">
                Verificación IoT + auditores ciudadanos · validación centinela · liberación escrow
              </p>

              <ol className="mt-6 space-y-4">
                {data.milestones.map((milestone) => {
                  const Icon = MILESTONE_ICON[milestone.state] ?? Circle;
                  return (
                    <li
                      key={milestone.index}
                      className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${MILESTONE_COLOR[milestone.state]}`} />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium text-agigov-text">{milestone.label}</span>
                            <StatusBadge status={milestone.state} />
                          </div>

                          {milestone.state !== 'LOCKED' ? (
                            <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                              <div>
                                <dt className="text-agigov-text-muted">Monto liberado</dt>
                                <dd className="font-medium">
                                  {formatVes(milestone.amount)} {data.contract.currency}
                                </dd>
                              </div>
                              <div>
                                <dt className="text-agigov-text-muted">Verificado</dt>
                                <dd>
                                  {milestone.verifiedAt
                                    ? new Date(milestone.verifiedAt).toLocaleString('es-VE')
                                    : '—'}
                                </dd>
                              </div>
                              {milestone.evidenceRef ? (
                                <div className="sm:col-span-2">
                                  <dt className="text-agigov-text-muted">Evidencia (hash)</dt>
                                  <dd className="agigov-mono-id break-all text-xs">
                                    {milestone.evidenceRef}
                                  </dd>
                                </div>
                              ) : null}
                              {milestone.validators ? (
                                <>
                                  <div className="sm:col-span-2">
                                    <dt className="text-agigov-text-muted">Centinela</dt>
                                    <dd className="agigov-mono-id text-xs">
                                      {milestone.validators.centinela}
                                    </dd>
                                  </div>
                                  <div>
                                    <dt className="text-agigov-text-muted">Sensor IoT</dt>
                                    <dd className="agigov-mono-id text-xs">
                                      {milestone.validators.iot}
                                    </dd>
                                  </div>
                                  <div>
                                    <dt className="text-agigov-text-muted">Auditores ciudadanos</dt>
                                    <dd className="agigov-mono-id text-xs">
                                      {milestone.validators.citizens.join(' · ')}
                                    </dd>
                                  </div>
                                </>
                              ) : null}
                            </dl>
                          ) : (
                            <p className="mt-2 text-sm text-agigov-text-muted">
                              Hito pendiente — fondos en escrow LOCKED hasta verificación.
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>

            {data.ledgerProcessId ? (
              <p className="mt-6 border-t border-white/5 pt-4 text-xs text-agigov-text-muted">
                Ancla ledger:{' '}
                <span className="agigov-mono-id">{data.ledgerProcessId}</span>
              </p>
            ) : null}
          </article>
        </>
      ) : null}
    </PageShell>
  );
}
