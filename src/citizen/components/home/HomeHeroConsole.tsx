import { Link } from 'react-router-dom';
import {
  ArrowRight,
  FileCheck,
  LayoutDashboard,
  Package,
  ShieldCheck,
  TrendingDown,
} from 'lucide-react';

import { useCachedFetch } from '../../hooks/useCitizenData.js';
import {
  EGS_VIAL_CONSOLE_PATH,
  EGS_VIAL_PRODUCT_PATH,
} from '../../services/egs-vial-service.js';
import { fetchHomeHeroEgs, formatHeroVes, HOME_HERO_DEMO } from './homeHeroData.js';

const NAV = [
  { icon: Package, label: 'Servicio' },
  { icon: LayoutDashboard, label: 'Consola', active: true },
  { icon: FileCheck, label: 'Contratos' },
  { icon: ShieldCheck, label: 'Docs' },
] as const;

type Props = {
  compact?: boolean;
};

export function HomeHeroConsole({ compact = false }: Props) {
  const health = useCachedFetch('home-hero-egs', fetchHomeHeroEgs, 30_000);
  const live = Boolean(health.data);
  const data = health.data ?? HOME_HERO_DEMO;
  const syncing = !health.data && health.state !== 'error';
  const badge = syncing ? 'SYNC' : live ? 'EN VIVO' : 'VISTA PREVIA';

  return (
    <div className={compact ? 'w-full' : 'w-full lg:translate-y-2'}>
      <div
        className={`overflow-hidden rounded-2xl border border-white/10 bg-[#070b12] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)] ${
          compact ? '' : 'lg:rotate-[0.5deg] lg:scale-[1.02]'
        }`}
      >
        {/* Title bar */}
        <div className="flex items-center gap-3 border-b border-white/10 bg-black/60 px-4 py-2.5">
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <span className="min-w-0 flex-1 truncate font-mono text-[10px] uppercase tracking-wider text-slate-500">
            consola.agigov.ven / egs-vial
          </span>
          <span
            className={`shrink-0 rounded px-2 py-0.5 font-mono text-[9px] font-bold tracking-widest ${
              live
                ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30'
                : 'bg-slate-800 text-slate-400 ring-1 ring-slate-600/40'
            }`}
          >
            {badge}
          </span>
        </div>

        <div className="flex">
          {/* Icon rail — solo desktop, sin texto suelto */}
          {!compact ? (
            <aside
              className="hidden w-12 shrink-0 flex-col items-center gap-3 border-r border-white/10 bg-black/40 py-4 sm:flex"
              aria-hidden
            >
              {NAV.map(({ icon: Icon, label, ...rest }) => {
                const active = 'active' in rest && rest.active === true;
                return (
                <span
                  key={label}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    active ? 'bg-sky-500/20 text-sky-300' : 'text-slate-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                );
              })}
            </aside>
          ) : null}

          <div className="min-w-0 flex-1 p-4 sm:p-5">
            <header className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                  Salud del Ministerio
                </p>
                <p className="mt-0.5 font-mono text-sm text-slate-200">
                  {data.ministryCode} · Q{data.quarter} {data.fiscalYear}
                </p>
              </div>
              <span className="shrink-0 rounded-md bg-emerald-500/10 px-2 py-0.5 font-mono text-[9px] text-emerald-300 ring-1 ring-emerald-500/25">
                {data.quarterCloseStatus}
              </span>
            </header>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <Kpi
                label="Ahorro Δ"
                value={formatHeroVes(data.calculoAhorroFinal)}
                unit="VES"
                accent
                icon={compact ? undefined : TrendingDown}
              />
              <Kpi label="Escrow" value={`${data.escrowExecutionPct}%`} />
              <Kpi label="Contratos" value={String(data.contracts.length)} />
            </div>

            {!compact ? (
              <>
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-[9px] uppercase tracking-wide text-slate-500">
                    <span>Ejecución presupuestaria</span>
                    <span>{data.executionPct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400"
                      style={{ width: `${data.executionPct}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-5 gap-1.5" aria-hidden>
                  {data.contracts.slice(0, 10).map((c) => (
                    <span
                      key={c.id}
                      title={c.title}
                      className={`aspect-square rounded-md border ${
                        c.status === 'ok'
                          ? 'border-emerald-500/35 bg-emerald-500/20'
                          : 'border-amber-500/40 bg-amber-500/20'
                      }`}
                    />
                  ))}
                </div>

                <div className="mt-4 flex h-1.5 overflow-hidden rounded-full">
                  <span className="w-[70%] bg-emerald-500" />
                  <span className="w-[20%] bg-sky-500" />
                  <span className="w-[10%] bg-violet-500" />
                </div>
                <p className="mt-1 text-[9px] uppercase tracking-wide text-slate-600">
                  Reparto EGS 70 · 20 · 10
                </p>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        <Link
          to={EGS_VIAL_CONSOLE_PATH}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-400 no-underline hover:text-sky-300"
        >
          Abrir consola
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          to={EGS_VIAL_PRODUCT_PATH}
          className="text-sm text-slate-500 no-underline hover:text-slate-300"
        >
          Detalle del servicio
        </Link>
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  unit,
  accent,
  icon: Icon,
}: {
  label: string;
  value: string;
  unit?: string;
  accent?: boolean;
  icon?: typeof TrendingDown;
}) {
  return (
    <div
      className={`rounded-xl border p-2.5 ${
        accent ? 'border-emerald-500/25 bg-emerald-500/10' : 'border-white/10 bg-white/[0.03]'
      }`}
    >
      {Icon ? <Icon className="mb-1 h-3.5 w-3.5 text-emerald-400" /> : null}
      <p className="text-[9px] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-0.5 font-mono text-sm font-semibold tabular-nums text-white sm:text-base">
        {value}
        {unit ? <span className="ml-1 text-[9px] font-normal text-slate-500">{unit}</span> : null}
      </p>
    </div>
  );
}
