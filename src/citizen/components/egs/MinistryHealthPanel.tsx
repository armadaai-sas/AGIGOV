import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Landmark,
  ShieldCheck,
  TrendingDown,
} from 'lucide-react';

import { OsCollapsible } from '../os/OsCollapsible.js';
import type { MinistryHealthResponse } from '../../api.js';
import { EgsConnectionPanel } from '../services/ServiceConnectionPanel.js';
import { PlatformAlert } from '../PlatformAlert.js';
import { StatusBadge } from '../StatusBadge.js';

import { useSovereignConfig } from '../../context/PlatformContext.js';

function formatAmount(value: string, formatMoney: (v: string | number, o?: { showCode?: boolean }) => string): string {
  const n = parseFloat(value);
  if (Number.isNaN(n)) return value;
  return formatMoney(n);
}

export function MinistryHealthPanel({ data }: { data: MinistryHealthResponse }) {
  const { formatMoney, sovereign, t } = useSovereignConfig();
  const unit = data.currency ?? sovereign.currency;
  const fmt = (v: string) => `${formatAmount(v, formatMoney)} ${unit}`;
  const budgetOk = data.reconcileOk && data.quarterCloseStatus !== 'FROZEN';

  return (
    <div className="space-y-8 agigov-stagger-list">
      {!data.reconcileOk ? (
        <PlatformAlert variant="error" title="Discrepancia detectada — cierre bloqueado">
          <ul className="mt-2 list-inside list-disc text-[13px]">
            {data.discrepancies.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <p className="mt-2 text-[12px] text-zinc-600">
            Pagos congelados hasta resolución humana.
          </p>
        </PlatformAlert>
      ) : null}

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCard
          icon={TrendingDown}
          label={t('egs.savings.quarterly')}
          value={formatAmount(data.calculoAhorroFinal, formatMoney)}
          suffix={unit}
        />
        <KpiCard
          icon={ShieldCheck}
          label="Ejecución en custodia"
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

      <section className="os-panel">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs text-agigov-text-muted">
              {data.ministryCode} · {data.fiscalYear} Q{data.quarter}
            </p>
            <h2 className="mt-1 text-base font-semibold text-agigov-text">
              Línea base vs. gasto efectivo
            </h2>
            <p className="mt-1 text-sm text-agigov-text-muted">{data.programName}</p>
          </div>
          <StatusBadge status={data.quarterCloseStatus} />
        </div>

        <div className="mt-4 space-y-4">
          <BudgetBar
            label="Línea base trimestral"
            amount={data.baselineTrimestral}
            pct={100}
            className="bg-zinc-300"
          />
          <BudgetBar
            label="Gasto verificado (centinela)"
            amount={data.gastosVerificados}
            pct={data.executionPct}
            className="bg-zinc-600"
          />
          <div className="flex justify-between text-sm">
            <span className="text-agigov-text-muted">{t('egs.savings.generated')}</span>
            <span className="font-semibold text-zinc-900">
              {fmt(data.calculoAhorroFinal)}
            </span>
          </div>
        </div>
      </section>

      <OsCollapsible title="Reparto del ahorro y comisiones" hint="70 / 20 / 10">
        <div className="space-y-4 pt-2">
          <p className="text-sm text-agigov-text-muted">{t('egs.savings.splitLead')}</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <SplitBucket
              pct={70}
              label="Re-inversión obra"
              amount={data.split.reinversion}
            />
            <SplitBucket
              pct={20}
              label="Incentivos mérito"
              amount={data.split.meritPool}
            />
            <SplitBucket pct={10} label="Comisión AGIGOV" amount={data.split.agigovFee} />
          </div>
          {data.feeShare ? (
            <p className="text-xs text-agigov-text-muted">
              Comisión del protocolo → constructor {data.feeShare.builderAmount} · kernel{' '}
              {data.feeShare.protocolAmount}
            </p>
          ) : null}
        </div>
      </OsCollapsible>

      <section className="space-y-3">
        <div>
          <h2 className="text-base font-semibold text-agigov-text">Contratos en custodia</h2>
          <p className="text-sm text-agigov-text-muted">
            {data.contracts.length} contratos · siguiente paso: revisar hito
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {data.contracts.slice(0, 6).map((contract) => (
            <ContractTile key={contract.id} contract={contract} />
          ))}
        </div>
        {data.contracts.length > 6 ? (
          <p className="text-xs text-agigov-text-muted">+ {data.contracts.length - 6} más en custodia</p>
        ) : null}
      </section>
    </div>
  );
}

export function MinistryHealthUnavailable() {
  return (
    <EgsConnectionPanel
      title="Reparto del ahorro por eficiencia"
      showConsoleLink={false}
      autoVerify
    />
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  suffix,
  badge,
}: {
  icon: typeof TrendingDown;
  label: string;
  value: string;
  suffix?: string;
  badge?: string;
}) {
  return (
    <div className="agigov-stat text-center sm:text-left">
      <Icon className="mx-auto mb-2 h-5 w-5 text-zinc-500 sm:mx-0" />
      <p className="text-[10px] font-medium uppercase tracking-wide text-agigov-text-muted">
        {label}
      </p>
      <p className="mt-1 font-display text-lg font-bold text-zinc-900 sm:text-xl">
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
  const { formatMoney, sovereign } = useSovereignConfig();
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-agigov-text-muted">{label}</span>
        <span className="font-medium text-agigov-text">
          {formatMoney(amount)} {sovereign.currency} · {pct}%
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
}: {
  pct: number;
  label: string;
  amount: string;
}) {
  const { formatMoney, sovereign } = useSovereignConfig();
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
      <p className="text-2xl font-bold text-agigov-text">{pct}%</p>
      <p className="text-xs text-agigov-text-muted">{label}</p>
      <p className="mt-2 font-display text-sm font-semibold text-agigov-text">
        {formatMoney(amount)} {sovereign.currency}
      </p>
    </div>
  );
}

const TILE_STYLE = 'border-zinc-200 bg-zinc-50 hover:border-zinc-300';

function ContractTile({
  contract,
}: {
  contract: MinistryHealthResponse['contracts'][number];
}) {
  const { formatMoney, sovereign } = useSovereignConfig();
  return (
    <Link
      to={`/proyectos/contrato/${encodeURIComponent(contract.id)}`}
      className={`group block rounded-lg border p-3 transition ${TILE_STYLE}`}
    >
      <p className="font-display text-sm font-semibold text-agigov-text">{contract.title}</p>
      <p className="mt-1 text-[10px] text-agigov-text-muted">{contract.territoryCode}</p>
      <p className="mt-3 text-xs text-agigov-text-muted">
        {contract.milestonesReleased}/{contract.milestonesTotal} hitos
      </p>
      <p className="mt-1 text-xs font-medium text-agigov-text">
        {formatMoney(contract.spentAmount)} {sovereign.currency}
      </p>
      <span className="mt-3 flex items-center gap-1 text-[10px] text-zinc-500 opacity-0 transition group-hover:opacity-100">
        Ver custodia <ArrowRight className="h-3 w-3" />
      </span>
    </Link>
  );
}
