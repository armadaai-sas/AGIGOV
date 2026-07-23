import { Link } from 'react-router-dom';
import { ArrowRight, Download, TrendingDown } from 'lucide-react';

import { fetchMinistryHealth, type MinistryHealthResponse } from '../../api.js';
import { useCachedFetch } from '../../hooks/useCitizenData.js';
import {
  EGS_VIAL_CONSOLE_PATH,
  EGS_VIAL_PRODUCT_PATH,
} from '../../services/egs-vial-service.js';
import { HeroMeshBackground } from './HeroMeshBackground.js';

const DEMO: MinistryHealthResponse = {
  updatedAt: new Date().toISOString(),
  available: true,
  ministryCode: 'MPPI',
  programName: 'Mantenimiento vial · EGS',
  fiscalYear: 2026,
  quarter: 2,
  quarterCloseStatus: 'PUBLISHED',
  reconcileOk: true,
  discrepancies: [],
  baselineTrimestral: '2400000',
  gastosVerificados: '2220000',
  calculoAhorroFinal: '180000',
  currency: 'VES',
  executionPct: 92,
  escrowExecutionPct: 94,
  split: { reinversion: '126000', meritPool: '36000', agigovFee: '18000' },
  releaseCount: 50,
  contracts: Array.from({ length: 10 }, (_, i) => ({
    id: `EGS-${i + 1}`,
    title: `Tramo ${i + 1}`,
    territoryCode: 'MAR_NORTH_01',
    totalAmount: '240000',
    spentAmount: '220800',
    status: (i === 7 ? 'partial' : 'ok') as 'ok' | 'partial',
    milestonesTotal: 5,
    milestonesReleased: 5,
    escrowStatus: 'ACTIVE',
  })),
  treasuryPayload: null,
  ledgerProcessId: 'demo-q-close',
  published: true,
  pilotBanner: '',
};

const TRUST = ['Centinela', 'Human-in-the-loop', 'Ledger publicado', 'Offline-first'] as const;

function formatVes(value: string): string {
  const n = parseFloat(value);
  return Number.isNaN(n) ? value : n.toLocaleString('es-VE', { maximumFractionDigits: 0 });
}

function useHeroEgsData() {
  const health = useCachedFetch('hero-egs-preview', () => fetchMinistryHealth('MPPI'), 30_000);
  const live = Boolean(health.data);
  const data = health.data ?? DEMO;
  const loading = !health.data && health.state !== 'error';
  const status = loading ? 'SYNC' : live ? 'EN VIVO' : 'VISTA PREVIA';
  return { data, live, status };
}

/** Hero landing — producto EGS + consola en acción. */
export function HeroProductReveal() {
  return (
    <div className="hero-landing">
      <HeroMeshBackground dark />
      <div className="hero-landing-glow" aria-hidden />

      <div className="hero-landing-inner">
        <div className="hero-landing-copy">
          <p className="hero-landing-eyebrow">AGIGOV-VEN · Servicio EGS · MPPI</p>

          <h1 className="hero-landing-title">
            Presupuesto que se <span className="text-emerald-300">ejecuta</span> con prueba
          </h1>

          <p className="hero-landing-lead">
            Cierre trimestral automático, hitos en Smart Escrow y ahorro verificable por
            centinela. Mismo techo presupuestario, más obra publicada — fee AGIGOV solo sobre
            ahorro real.
          </p>

          <div className="hero-landing-actions">
            <Link to={EGS_VIAL_PRODUCT_PATH} className="hero-landing-cta-primary">
              Explorar servicio EGS
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link to="/transparencia" className="hero-landing-cta-secondary">
              <Download className="h-4 w-4" aria-hidden />
              Contrato de Eficiencia Pública
            </Link>
          </div>

          <ul className="hero-landing-trust" aria-label="Garantías del servicio">
            {TRUST.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="hero-landing-mockup-mobile">
            <HeroConsoleMockup variant="compact" />
          </div>
        </div>

        <div className="hero-landing-mockup-desktop">
          <HeroConsoleMockup variant="full" />
        </div>
      </div>
    </div>
  );
}

function HeroConsoleMockup({ variant }: { variant: 'compact' | 'full' }) {
  const { data, live, status } = useHeroEgsData();
  const compact = variant === 'compact';

  return (
    <div
      className={`hero-console-mockup ${compact ? 'hero-console-mockup--compact' : 'hero-console-mockup--full'}`}
      aria-label="Vista previa consola Salud del Ministerio"
    >
      <div className="hero-console-mockup-window">
        <div className="hero-console-mockup-titlebar">
          <div className="hero-console-mockup-dots" aria-hidden>
            <span />
            <span />
            <span />
          </div>
          <span className="hero-console-mockup-path">AGIGOV / VEN / Consola EGS</span>
          <span className={`hero-console-mockup-badge ${live ? 'is-live' : ''}`}>{status}</span>
        </div>

        <div className={`hero-console-mockup-body ${compact ? 'is-compact' : ''}`}>
          <header className="hero-console-mockup-header">
            <div>
              <p className="hero-console-mockup-kicker">Salud del Ministerio</p>
              <p className="hero-console-mockup-heading">
                {data.ministryCode} · {data.fiscalYear} Q{data.quarter}
              </p>
            </div>
            {!compact ? (
              <span className="hero-console-mockup-pill">{data.quarterCloseStatus}</span>
            ) : null}
          </header>

          <div className="hero-console-mockup-kpis">
            <div className="hero-console-mockup-kpi hero-console-mockup-kpi--accent">
              {!compact ? <TrendingDown className="h-4 w-4 text-emerald-400" /> : null}
              <p className="hero-console-mockup-kpi-label">Ahorro verificado</p>
              <p className="hero-console-mockup-kpi-value">
                {formatVes(data.calculoAhorroFinal)}
                <span className="hero-console-mockup-kpi-unit">VES</span>
              </p>
            </div>
            <div className="hero-console-mockup-kpi">
              <p className="hero-console-mockup-kpi-label">Escrow</p>
              <p className="hero-console-mockup-kpi-value">{data.escrowExecutionPct}%</p>
            </div>
            <div className="hero-console-mockup-kpi">
              <p className="hero-console-mockup-kpi-label">Contratos</p>
              <p className="hero-console-mockup-kpi-value">{data.contracts.length}</p>
            </div>
          </div>

          {!compact ? (
            <>
              <div className="hero-console-mockup-progress">
                <div className="hero-console-mockup-progress-labels">
                  <span>Baseline</span>
                  <span>Ejecución {data.executionPct}%</span>
                </div>
                <div className="hero-console-mockup-progress-track">
                  <div
                    className="hero-console-mockup-progress-fill"
                    style={{ width: `${Math.min(100, data.executionPct)}%` }}
                  />
                </div>
              </div>

              <div className="hero-console-mockup-grid" aria-hidden>
                {data.contracts.slice(0, 10).map((c) => (
                  <span
                    key={c.id}
                    className={`hero-console-mockup-cell hero-console-mockup-cell--${c.status}`}
                    title={c.title}
                  />
                ))}
              </div>

              <div className="hero-console-mockup-split">
                <span className="w-[70%]" />
                <span className="w-[20%]" />
                <span className="w-[10%]" />
              </div>
              <p className="hero-console-mockup-caption">Reparto EGS 70 / 20 / 10</p>
            </>
          ) : null}
        </div>
      </div>

      <Link to={EGS_VIAL_CONSOLE_PATH} className="hero-console-mockup-link">
        Abrir consola operativa
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  );
}
