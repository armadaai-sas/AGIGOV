import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  CheckCircle2,
  FileCheck,
  Landmark,
  LayoutDashboard,
  Package,
  ShieldCheck,
  TrendingDown,
} from 'lucide-react';

import { useHeroEgsData } from '../../hooks/useHeroEgsData.js';
import { useSovereignConfig } from '../../context/PlatformContext.js';

type DemoScene = 'overview' | 'contract' | 'result';

const SCENE_MS: Record<DemoScene, number> = {
  overview: 3200,
  contract: 3400,
  result: 3800,
};

const CURSOR_PATH: Record<DemoScene, { x: number; y: number }> = {
  overview: { x: 78, y: 82 },
  contract: { x: 70, y: 88 },
  result: { x: 50, y: 48 },
};

const NAV = [
  { icon: Package, label: 'Servicio' },
  { icon: LayoutDashboard, label: 'Consola', active: true },
  { icon: ShieldCheck, label: 'Docs' },
] as const;

/** Demo cinematográfica — misma densidad que la consola operativa real. */
export function HomeHeroConsoleDemo() {
  const reduceMotion = useReducedMotion();
  const { formatMoney, sovereign, t } = useSovereignConfig();
  const { data, live } = useHeroEgsData('home-hero-egs-demo');

  const [scene, setScene] = useState<DemoScene>('overview');
  const [clickPulse, setClickPulse] = useState(false);

  const focusContract =
    data.contracts.find((c) => c.status === 'partial') ?? data.contracts[3] ?? data.contracts[0]!;

  const displayContracts = [
    data.contracts[0],
    data.contracts[1],
    data.contracts[2],
    focusContract,
  ].filter((c): c is (typeof data.contracts)[number] => Boolean(c));

  useEffect(() => {
    const order: DemoScene[] = ['overview', 'contract', 'result'];
    let i = 0;
    let clickTimer: ReturnType<typeof setTimeout> | undefined;
    let sceneTimer: ReturnType<typeof setTimeout>;

    const advance = () => {
      const current = order[i]!;
      if (!reduceMotion && (current === 'overview' || current === 'contract')) {
        clickTimer = setTimeout(() => setClickPulse(true), SCENE_MS[current] - 750);
        setTimeout(() => setClickPulse(false), SCENE_MS[current] - 420);
      }

      sceneTimer = setTimeout(() => {
        i = (i + 1) % order.length;
        setScene(order[i]!);
        advance();
      }, SCENE_MS[current]);
    };

    advance();
    return () => {
      clearTimeout(sceneTimer);
      clearTimeout(clickTimer);
    };
  }, [reduceMotion]);

  const cursor = CURSOR_PATH[scene];
  const badge = live ? t('common.live') : t('common.preview');

  return (
    <div className="hero-console-demo" aria-hidden>
      <div className="hero-console-demo-shell">
        <div className="hero-console-demo-titlebar">
          <div className="hero-console-demo-dots" aria-hidden>
            <span />
            <span />
            <span />
          </div>
          <span className="hero-console-demo-path">
            {t('hero.console.path', { iso: sovereign.iso })}
          </span>
          <span className={`hero-console-demo-badge ${live ? 'hero-console-demo-badge--live' : ''}`}>
            {badge}
          </span>
        </div>

        <div className="hero-console-demo-frame">
          <aside className="hero-console-demo-rail" aria-hidden>
            {NAV.map(({ icon: Icon, label, ...rest }) => {
              const active = 'active' in rest && rest.active === true;
              return (
                <span
                  key={label}
                  className={`hero-console-demo-rail-btn ${active ? 'is-active' : ''}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
              );
            })}
          </aside>

          <div className="hero-console-demo-body">
            <AnimatePresence mode="wait">
              {scene === 'overview' ? (
                <motion.div
                  key="overview"
                  className="hero-console-demo-scene"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.35 }}
                >
                  <header className="hero-console-demo-header">
                    <div>
                      <p className="hero-console-demo-kicker">{t('hero.console.budgetHealth')}</p>
                      <p className="hero-console-demo-heading">
                        {data.ministryCode} · {data.fiscalYear} Q{data.quarter}
                      </p>
                      <p className="hero-console-demo-program">{data.programName}</p>
                    </div>
                    <span className="hero-console-demo-pill">{data.quarterCloseStatus}</span>
                  </header>

                  <div className="hero-console-demo-kpis">
                    <div className="hero-console-demo-kpi hero-console-demo-kpi--accent">
                      <TrendingDown className="hero-console-demo-kpi-icon" aria-hidden />
                      <p className="hero-console-demo-kpi-label">{t('hero.console.savings')}</p>
                      <p className="hero-console-demo-kpi-value">
                        {formatMoney(data.calculoAhorroFinal)}
                        <span className="hero-console-demo-kpi-unit">{sovereign.currency}</span>
                      </p>
                    </div>
                    <div className="hero-console-demo-kpi">
                      <Landmark className="hero-console-demo-kpi-icon hero-console-demo-kpi-icon--sky" aria-hidden />
                      <p className="hero-console-demo-kpi-label">{t('hero.console.escrow')}</p>
                      <p className="hero-console-demo-kpi-value">
                        {data.escrowExecutionPct}%
                        <span className="hero-console-demo-kpi-unit">
                          {data.releaseCount} {t('hero.console.milestones')}
                        </span>
                      </p>
                    </div>
                    <div className="hero-console-demo-kpi">
                      <ShieldCheck className="hero-console-demo-kpi-icon hero-console-demo-kpi-icon--sky" aria-hidden />
                      <p className="hero-console-demo-kpi-label">{t('hero.console.status')}</p>
                      <p className="hero-console-demo-kpi-value">
                        {data.reconcileOk ? t('hero.console.conform') : t('hero.console.blocked')}
                      </p>
                    </div>
                  </div>

                  <div className="hero-console-demo-budget">
                    <BudgetRow
                      label={t('hero.console.baseline')}
                      amount={data.baselineTrimestral}
                      pct={100}
                      tone="sky"
                      formatMoney={formatMoney}
                      currency={sovereign.currency}
                    />
                    <BudgetRow
                      label={t('hero.console.verifiedSpend')}
                      amount={data.gastosVerificados}
                      pct={data.executionPct}
                      tone="emerald"
                      formatMoney={formatMoney}
                      currency={sovereign.currency}
                    />
                  </div>

                  <div className="hero-console-demo-contracts-head">
                    <p className="hero-console-demo-contracts-title">{t('hero.console.contracts')}</p>
                    <div className="hero-console-demo-legend">
                      <span>
                        <i className="hero-console-demo-legend-dot hero-console-demo-legend-dot--ok" />
                        {t('hero.console.validated')}
                      </span>
                      <span>
                        <i className="hero-console-demo-legend-dot hero-console-demo-legend-dot--warn" />
                        {t('hero.console.review')}
                      </span>
                    </div>
                  </div>

                  <div className="hero-console-demo-contracts-grid">
                    {displayContracts.map((c) => (
                      <div
                        key={c.id}
                        className={`hero-console-demo-contract ${
                          c.status === 'partial' ? 'is-warn' : 'is-ok'
                        } ${c.id === focusContract.id ? 'is-focus' : ''}`}
                      >
                        <p className="hero-console-demo-contract-title">{c.title}</p>
                        <p className="hero-console-demo-contract-meta">{c.territoryCode}</p>
                        <p className="hero-console-demo-contract-milestones">
                          {c.milestonesReleased}/{c.milestonesTotal} hitos
                        </p>
                        <p className="hero-console-demo-contract-amount">
                          {formatMoney(c.spentAmount, { showCode: true })}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : null}

              {scene === 'contract' ? (
                <motion.div
                  key="contract"
                  className="hero-console-demo-scene"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.35 }}
                >
                  <p className="hero-console-demo-kicker">{t('hero.console.custody')}</p>
                  <p className="hero-console-demo-heading">{focusContract.title}</p>
                  <p className="hero-console-demo-sub">
                    {focusContract.id} · {focusContract.territoryCode} · {focusContract.escrowStatus}
                  </p>

                  <div className="hero-console-demo-rows">
                    <div className="hero-console-demo-row">
                      <span>{t('hero.console.assigned')}</span>
                      <span>{formatMoney(focusContract.totalAmount, { showCode: true })}</span>
                    </div>
                    <div className="hero-console-demo-row">
                      <span>{t('hero.console.executed')}</span>
                      <span>{formatMoney(focusContract.spentAmount, { showCode: true })}</span>
                    </div>
                    <div className="hero-console-demo-row hero-console-demo-row--accent">
                      <span>{t('hero.console.milestonesReleased')}</span>
                      <span>
                        {focusContract.milestonesReleased}/{focusContract.milestonesTotal}
                      </span>
                    </div>
                  </div>

                  <button type="button" className="hero-console-demo-btn" tabIndex={-1}>
                    {t('hero.console.viewClose')}
                  </button>
                </motion.div>
              ) : null}

              {scene === 'result' ? (
                <motion.div
                  key="result"
                  className="hero-console-demo-scene hero-console-demo-scene--result"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="hero-console-demo-result-icon">
                    <CheckCircle2 className="h-7 w-7 text-emerald-400" aria-hidden />
                  </div>
                  <p className="hero-console-demo-result-title">
                    {t('hero.console.closePublished', { quarter: data.quarter })}
                  </p>
                  <p className="hero-console-demo-result-delta">
                    <span className="text-agigov-text-muted">{t('hero.console.savings')}: </span>
                    {formatMoney(data.calculoAhorroFinal, { showCode: true })}
                  </p>
                  <p className="hero-console-demo-result-hash">
                    <FileCheck className="h-3.5 w-3.5" aria-hidden />
                    {data.ledgerProcessId} {t('hero.console.signedActa')}
                  </p>

                  <div className="hero-console-demo-split-grid">
                    <SplitChip pct={70} label={t('hero.console.split.reinvest')} amount={data.split.reinversion} tone="emerald" formatMoney={formatMoney} currency={sovereign.currency} />
                    <SplitChip pct={20} label={t('hero.console.split.merit')} amount={data.split.meritPool} tone="sky" formatMoney={formatMoney} currency={sovereign.currency} />
                    <SplitChip pct={10} label={t('hero.console.split.fee')} amount={data.split.agigovFee} tone="violet" formatMoney={formatMoney} currency={sovereign.currency} />
                  </div>

                  <div className="hero-console-demo-result-bar">
                    <span style={{ width: '70%' }} />
                    <span style={{ width: '20%' }} />
                    <span style={{ width: '10%' }} />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {!reduceMotion ? (
              <motion.div
                className="hero-console-demo-cursor"
                animate={{ left: `${cursor.x}%`, top: `${cursor.y}%` }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="hero-console-demo-cursor-pointer" />
                {clickPulse ? <span className="hero-console-demo-click-ring" /> : null}
              </motion.div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function BudgetRow({
  label,
  amount,
  pct,
  tone,
  formatMoney,
  currency,
}: {
  label: string;
  amount: string;
  pct: number;
  tone: 'sky' | 'emerald';
  formatMoney: (value: string | number, options?: { showCode?: boolean }) => string;
  currency: string;
}) {
  return (
    <div className="hero-console-demo-budget-row">
      <div className="hero-console-demo-budget-labels">
        <span>{label}</span>
        <span>
          {formatMoney(amount)} {currency} · {pct}%
        </span>
      </div>
      <div className="hero-console-demo-progress-track">
        <div
          className={`hero-console-demo-progress-fill hero-console-demo-progress-fill--${tone}`}
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
    </div>
  );
}

function SplitChip({
  pct,
  label,
  amount,
  tone,
  formatMoney,
  currency,
}: {
  pct: number;
  label: string;
  amount: string;
  tone: 'emerald' | 'sky' | 'violet';
  formatMoney: (value: string | number, options?: { showCode?: boolean }) => string;
  currency: string;
}) {
  return (
    <div className={`hero-console-demo-split-chip hero-console-demo-split-chip--${tone}`}>
      <p className="hero-console-demo-split-pct">{pct}%</p>
      <p className="hero-console-demo-split-label">{label}</p>
      <p className="hero-console-demo-split-amount">
        {formatMoney(amount)} {currency}
      </p>
    </div>
  );
}
