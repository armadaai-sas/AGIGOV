import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Landmark,
  PiggyBank,
  ShieldCheck,
  TrendingDown,
} from 'lucide-react';

import type { MinistryHealthResponse } from '../../api.js';
import { PlatformAlert } from '../PlatformAlert.js';
import { StatusBadge } from '../StatusBadge.js';

function formatVes(value: string): string {
  const n = parseFloat(value);
  if (Number.isNaN(n)) return value;
  return n.toLocaleString('es-VE', { maximumFractionDigits: 0 });
}

function pctOf(part: string, total: string): number {
  const p = parseFloat(part);
  const t = parseFloat(total);
  if (!t || Number.isNaN(p)) return 0;
  return Math.round((p / t) * 100);
}

export function MinistryHealthPanel({ data }: { data: MinistryHealthResponse }) {
  const budgetOk = data.reconcileOk && data.quarterCloseStatus !== 'FROZEN';

  return (
    <div className="space-y-8 agigov-stagger-list">
      {data.pilotBanner ? (
        <PlatformAlert variant="warning" title="Aviso piloto">
          {data.pilotBanner}
        </PlatformAlert>
      ) : null}

      {!data.reconcileOk ? (
        <PlatformAlert variant="error" title="Cierre trimestral bloqueado — centinela detectó discrepancia">
          <ul className="mt-2 list-inside list-disc">
            {data.discrepancies.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs opacity-90">
            Los pagos a tesorería permanecen congelados hasta resolución humana.
          </p>
        </PlatformAlert>
      ) : null}

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCard
          icon={TrendingDown}
          label="Ahorro Δ trimestral"
          value={formatVes(data.calculoAhorroFinal)}
          suffix="VES"
          accent={data.reconcileOk ? 'text-emerald-300' : 'text-red-300'}
        />
        <KpiCard
          icon={ShieldCheck}
          label="Ejecución en escrow"
          value={`${data.escrowExecutionPct}%`}
          suffix={`${data.releaseCount} hitos`}
        />
        <KpiCard
          icon={Landmark}
          label="Estado presupuesto"
          value={budgetOk ? 'Conforme' : 'Bloqueado'}
          badge={data.quarterCloseStatus}
        />
      </section>

      <section className="agigov-card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-agigov-text-muted">
              {data.ministryCode} · {data.fiscalYear} Q{data.quarter}
            </p>
            <h2 className="mt-1 font-display text-lg font-semibold text-agigov-text">
              Baseline vs. gasto efectivo
            </h2>
            <p className="mt-1 text-sm text-agigov-text-muted">{data.programName}</p>
          </div>
          <StatusBadge status={data.quarterCloseStatus} />
        </div>

        <div className="mt-6 space-y-4">
          <BudgetBar
            label="Baseline trimestral"
            amount={data.baselineTrimestral}
            pct={100}
            className="bg-sky-500/80"
          />
          <BudgetBar
            label="Gasto verificado (centinela)"
            amount={data.gastosVerificados}
            pct={data.executionPct}
            className="bg-emerald-500/80"
          />
          <div className="flex justify-between text-sm">
            <span className="text-agigov-text-muted">Ahorro generado (Δ)</span>
            <span className="font-semibold text-emerald-300">
              {formatVes(data.calculoAhorroFinal)} VES
            </span>
          </div>
        </div>
      </section>

      <section className="agigov-card">
        <div className="flex items-center gap-2">
          <PiggyBank className="h-5 w-5 text-sky-400" />
          <h2 className="font-display text-lg font-semibold">Reparto EGS 70 / 20 / 10</h2>
        </div>
        <p className="mt-1 text-sm text-agigov-text-muted">
          Sobre el ahorro verificable Δ — Efficiency Gain Share
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <SplitBucket
            pct={70}
            label="Re-inversión obra"
            amount={data.split.reinversion}
            className="border-emerald-500/30 bg-emerald-500/10"
          />
          <SplitBucket
            pct={20}
            label="Incentivos mérito"
            amount={data.split.meritPool}
            className="border-sky-500/30 bg-sky-500/10"
          />
          <SplitBucket
            pct={10}
            label="Fee AGIGOV"
            amount={data.split.agigovFee}
            className="border-violet-500/30 bg-violet-500/10"
          />
        </div>

        <div className="mt-6 flex h-3 overflow-hidden rounded-full bg-white/5">
          <div
            className="bg-emerald-500/80"
            style={{ width: `${pctOf(data.split.reinversion, data.calculoAhorroFinal)}%` }}
          />
          <div
            className="bg-sky-500/80"
            style={{ width: `${pctOf(data.split.meritPool, data.calculoAhorroFinal)}%` }}
          />
          <div
            className="bg-violet-500/80"
            style={{ width: `${pctOf(data.split.agigovFee, data.calculoAhorroFinal)}%` }}
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="font-display text-lg font-semibold">Contratos en escrow</h2>
            <p className="text-sm text-agigov-text-muted">
              {data.contracts.length} contratos · clic para cadena de custodia
            </p>
          </div>
          <div className="flex gap-3 text-xs text-agigov-text-muted">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> Validado
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-red-400" /> Discrepancia
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {data.contracts.map((contract) => (
            <ContractTile key={contract.id} contract={contract} />
          ))}
        </div>
      </section>
    </div>
  );
}

export function MinistryHealthUnavailable() {
  return (
    <PlatformAlert variant="warning" title="Datos EGS no publicados">
      Active el nodo de demostración o verifique la conexión antes de ver la telemetría presupuestaria.
    </PlatformAlert>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  suffix,
  accent,
  badge,
}: {
  icon: typeof TrendingDown;
  label: string;
  value: string;
  suffix?: string;
  accent?: string;
  badge?: string;
}) {
  return (
    <div className="agigov-stat text-center sm:text-left">
      <Icon className="mx-auto mb-2 h-5 w-5 text-sky-400 sm:mx-0" />
      <p className="text-[10px] font-medium uppercase tracking-wide text-agigov-text-muted">
        {label}
      </p>
      <p className={`mt-1 font-display text-lg font-bold sm:text-xl ${accent ?? 'text-agigov-text'}`}>
        {value}
        {suffix ? (
          <span className="ml-1 text-xs font-normal text-agigov-text-muted">{suffix}</span>
        ) : null}
      </p>
      {badge ? (
        <div className="mt-2">
          <StatusBadge status={badge} />
        </div>
      ) : null}
    </div>
  );
}

function BudgetBar({
  label,
  amount,
  pct,
  className,
}: {
  label: string;
  amount: string;
  pct: number;
  className: string;
}) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-agigov-text-muted">{label}</span>
        <span className="font-medium text-agigov-text">
          {formatVes(amount)} VES · {pct}%
        </span>
      </div>
      <div className="agigov-progress-track">
        <div
          className={`agigov-progress-fill ${className}`}
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
    </div>
  );
}

function SplitBucket({
  pct,
  label,
  amount,
  className,
}: {
  pct: number;
  label: string;
  amount: string;
  className: string;
}) {
  return (
    <div className={`rounded-xl border px-4 py-3 ${className}`}>
      <p className="text-2xl font-bold text-agigov-text">{pct}%</p>
      <p className="text-xs text-agigov-text-muted">{label}</p>
      <p className="mt-2 font-display text-sm font-semibold text-agigov-text">
        {formatVes(amount)} VES
      </p>
    </div>
  );
}

const TILE_STYLES: Record<string, string> = {
  ok: 'border-emerald-500/40 bg-emerald-500/10 hover:border-emerald-400/60',
  partial: 'border-amber-500/40 bg-amber-500/10 hover:border-amber-400/60',
  discrepancy: 'border-red-500/40 bg-red-500/10 hover:border-red-400/60',
};

function ContractTile({
  contract,
}: {
  contract: MinistryHealthResponse['contracts'][number];
}) {
  return (
    <Link
      to={`/proyectos/contrato/${encodeURIComponent(contract.id)}`}
      className={`group block rounded-xl border p-3 transition ${TILE_STYLES[contract.status] ?? TILE_STYLES.partial}`}
    >
      <p className="font-display text-sm font-semibold text-agigov-text">{contract.title}</p>
      <p className="mt-1 text-[10px] text-agigov-text-muted">{contract.territoryCode}</p>
      <p className="mt-3 text-xs text-agigov-text-muted">
        {contract.milestonesReleased}/{contract.milestonesTotal} hitos
      </p>
      <p className="mt-1 text-xs font-medium text-agigov-text">
        {formatVes(contract.spentAmount)} VES
      </p>
      <span className="mt-3 flex items-center gap-1 text-[10px] text-sky-300 opacity-0 transition group-hover:opacity-100">
        Ver custodia <ArrowRight className="h-3 w-3" />
      </span>
    </Link>
  );
}
