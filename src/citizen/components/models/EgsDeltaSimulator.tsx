import { useMemo, useState } from 'react';

import { useSovereignConfig } from '../../context/PlatformContext.js';

/** Simulador demo de ahorro EGS — no conecta tesorería real. */
export function EgsDeltaSimulator() {
  const { t } = useSovereignConfig();
  const [baseline, setBaseline] = useState(1_000_000);
  const [spent, setSpent] = useState(850_000);
  const [feePct, setFeePct] = useState(10);
  const [citizenPct, setCitizenPct] = useState(70);
  const [operatorPct, setOperatorPct] = useState(20);

  const protocolPct = Math.max(0, 100 - citizenPct - operatorPct);

  const result = useMemo(() => {
    const delta = Math.max(0, baseline - spent);
    const fee = (delta * feePct) / 100;
    const citizen = (delta * citizenPct) / 100;
    const operator = (delta * operatorPct) / 100;
    const protocol = (delta * protocolPct) / 100;
    return { delta, fee, citizen, operator, protocol };
  }, [baseline, spent, feePct, citizenPct, operatorPct, protocolPct]);

  return (
    <section className="agigov-card" id="simulador-delta">
      <h2 className="font-display text-lg font-semibold">{t('egs.simulator.title')}</h2>
      <p className="mt-1 text-sm text-agigov-text-muted">
        Estime ahorro fiscal verificable y reparto referencia 70/20/10 — sin vincular tesorería nacional.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-agigov-text-muted">Línea base presupuestaria (USD)</span>
          <input
            type="number"
            min={0}
            step={10000}
            value={baseline}
            onChange={(e) => setBaseline(Number(e.target.value) || 0)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-agigov-text"
          />
        </label>
        <label className="block text-sm">
          <span className="text-agigov-text-muted">Gasto trazado en el registro (USD)</span>
          <input
            type="number"
            min={0}
            step={10000}
            value={spent}
            onChange={(e) => setSpent(Number(e.target.value) || 0)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-agigov-text"
          />
        </label>
        <label className="block text-sm">
          <span className="text-agigov-text-muted">{t('egs.simulator.feePct')}</span>
          <input
            type="range"
            min={5}
            max={15}
            value={feePct}
            onChange={(e) => setFeePct(Number(e.target.value))}
            className="mt-2 w-full"
          />
          <span className="mt-1 block font-mono text-zinc-600">{feePct}%</span>
        </label>
        <label className="block text-sm">
          <span className="text-agigov-text-muted">{t('egs.simulator.splitPct')}</span>
          <div className="mt-2 flex gap-2">
            <input
              type="number"
              min={0}
              max={100}
              value={citizenPct}
              onChange={(e) => setCitizenPct(Number(e.target.value) || 0)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-2 py-1 text-sm"
              aria-label="Ciudadano %"
            />
            <input
              type="number"
              min={0}
              max={100}
              value={operatorPct}
              onChange={(e) => setOperatorPct(Number(e.target.value) || 0)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-2 py-1 text-sm"
              aria-label="Operador %"
            />
          </div>
          <span className="mt-1 block text-xs text-agigov-text-muted">
            {t('egs.simulator.feeNote', { protocolPct: String(protocolPct), feePct: String(feePct) })}
          </span>
        </label>
      </div>

      <dl className="mt-6 grid gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label={t('egs.simulator.metric')} value={result.delta} highlight />
        <Metric label="Comisión sobre el ahorro" value={result.fee} />
        <Metric label="→ Ciudadano" value={result.citizen} />
        <Metric label="→ Operador" value={result.operator} />
      </dl>
    </section>
  );
}

function Metric({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  const formatted = new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

  return (
    <div>
      <dt className="text-xs text-agigov-text-muted">{label}</dt>
      <dd className={`mt-1 font-mono text-lg ${highlight ? 'text-zinc-900' : 'text-agigov-text'}`}>
        {formatted}
      </dd>
    </div>
  );
}
