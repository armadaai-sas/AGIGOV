import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ArrowRight, ShieldCheck, TrendingDown } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';
import { useHeroEgsData } from '../../hooks/useHeroEgsData.js';
import { useSovereignConfig } from '../../context/PlatformContext.js';
import { ModelStatusBadge } from '../models/ModelStatusBadge.js';

type Panel = 'overview' | 'metrics' | 'pilot';

const PANEL_MS = 3400;

/** Tarjeta del modelo — datos localizados por país/moneda. */
export function HomeHeroModelCard() {
  const reduceMotion = useReducedMotion();
  const { formatMoney, t } = useSovereignConfig();
  const copy = useLandingCopy();
  const model = copy.HERO_FIRST_MODEL;
  const { data, live } = useHeroEgsData('home-hero-model-card');

  const [panel, setPanel] = useState<Panel>('overview');

  useEffect(() => {
    if (reduceMotion) return;
    const order: Panel[] = ['overview', 'metrics', 'pilot'];
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % order.length;
      setPanel(order[i]!);
    }, PANEL_MS);
    return () => clearInterval(id);
  }, [reduceMotion]);

  const tabs = [
    ['overview', t('model.card.tab.overview')],
    ['metrics', t('model.card.tab.metrics')],
    ['pilot', t('model.card.tab.pilot')],
  ] as const;

  return (
    <div className="hero-model-card-wrap">
      <div className="hero-model-card-glow" aria-hidden />
      <div className="hero-brand-float">
        <div className="hero-model-card">
          <div className="hero-model-card-top">
            <div className="hero-model-card-icon" aria-hidden>
              <TrendingDown className="h-5 w-5 text-slate-700" />
            </div>
            <div className="hero-model-card-live">
              <span className={`hero-model-card-live-dot ${live ? 'is-on' : ''}`} aria-hidden />
              <span className="hero-model-card-live-label">
                {live ? t('model.card.live') : t('model.card.preview')}
              </span>
            </div>
            <ModelStatusBadge modelId="egs" status="disponible" size="sm" />
          </div>

          <div className="hero-model-card-tabs" role="tablist" aria-label={model.name}>
            {tabs.map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={panel === id}
                className={`hero-model-card-tab ${panel === id ? 'is-active' : ''}`}
                onClick={() => setPanel(id)}
              >
                {label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {panel === 'overview' ? (
              <motion.div
                key="overview"
                className="hero-model-card-panel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <p className="hero-model-card-kicker">{model.kicker}</p>
                <h3 className="hero-model-card-name">{model.name}</h3>
                <p className="hero-model-card-sub">{model.subtitle}</p>
                <p className="hero-model-card-desc">{model.description}</p>
              </motion.div>
            ) : null}

            {panel === 'metrics' ? (
              <motion.div
                key="metrics"
                className="hero-model-card-panel"
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <p className="hero-model-card-kicker">
                  {t('model.card.budgetHealth', { code: data.ministryCode })}
                </p>
                <div className="hero-model-card-metrics-grid">
                  <div className="hero-model-card-metric hero-model-card-metric--accent">
                    <p className="hero-model-card-metric-label">{t('hero.console.savings')}</p>
                    <p className="hero-model-card-metric-value">
                      {formatMoney(data.calculoAhorroFinal, { showCode: true })}
                    </p>
                  </div>
                  <div className="hero-model-card-metric">
                    <p className="hero-model-card-metric-label">{t('hero.console.escrow')}</p>
                    <p className="hero-model-card-metric-value">{data.escrowExecutionPct}%</p>
                  </div>
                  <div className="hero-model-card-metric">
                    <p className="hero-model-card-metric-label">
                      Q{data.quarter} {data.fiscalYear}
                    </p>
                    <p className="hero-model-card-metric-value">{data.quarterCloseStatus}</p>
                  </div>
                </div>
                <div className="hero-model-card-bar">
                  <div className="hero-model-card-bar-fill" style={{ width: `${data.executionPct}%` }} />
                </div>
                <p className="hero-model-card-bar-caption">
                  {t('model.card.execution', { pct: data.executionPct })}
                </p>
              </motion.div>
            ) : null}

            {panel === 'pilot' ? (
              <motion.div
                key="pilot"
                className="hero-model-card-panel"
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <p className="hero-model-card-kicker">{t('model.card.pilot.params')}</p>
                <ul className="hero-model-card-pilot-list">
                  <li>
                    <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                    {t('model.card.pilot.90days')}
                  </li>
                  <li>
                    <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                    {t('model.card.pilot.fee')}
                  </li>
                  <li>
                    <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                    {t('model.card.pilot.validated')}
                  </li>
                </ul>
                <p className="hero-model-card-pilot-note">
                  {t('model.card.pilot.note', {
                    contracts: data.contracts.length,
                    releases: data.releaseCount,
                  })}
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="hero-model-card-footer">
            <Link to={model.demoPath} className="hero-brand-btn hero-brand-btn--primary hero-brand-btn--card">
              {model.demoLabel}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
            <Link to={model.path} className="hero-model-card-ghost-link">
              {t('model.card.viewBrief')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
