import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Activity } from 'lucide-react';

import { AgigovLogo } from './AgigovLogo.js';
import type { DashboardResponse } from '../api.js';
import '../theme/hero-archive.css';

const AGENTS = [
  { id: 'centinela', label: 'Centinela', role: 'Integridad' },
  { id: 'soberano', label: 'Soberano', role: 'Dictamen' },
  { id: 'logistico', label: 'Logístico', role: 'Recursos' },
  { id: 'comunicador', label: 'Comunicador', role: 'Publicación' },
] as const;

const PIPELINE = ['received', 'validated', 'decided', 'published'] as const;

export function HeroPremium({
  data,
  loading,
}: {
  data: DashboardResponse | null;
  loading: boolean;
}) {
  const ledger = data?.ledgerEntries ?? null;
  const reports = data?.reports.length ?? null;
  const latest = data?.reports[0];

  return (
    <section className="hero-premium mb-16 md:mb-20" aria-labelledby="hero-heading">
      <HeroBackdrop />

      <div className="hero-premium-inner">
        {/* Narrative column */}
        <div className="hero-premium-copy">
          <nav className="hero-breadcrumb" aria-label="Jurisdicción">
            <span>AGIGOV</span>
            <ChevronRight className="h-3 w-3 opacity-40" aria-hidden />
            <span className="text-sky-300">AGIGOV-VEN</span>
            <ChevronRight className="h-3 w-3 opacity-40" aria-hidden />
            <span className="text-amber-200/90">MAR_NORTH_01</span>
          </nav>

          <div className="mt-6 flex items-center gap-4">
            <AgigovLogo size="lg" />
            <div className="hero-live-pill">
              <span className="hero-live-dot" aria-hidden />
              Piloto activo
            </div>
          </div>

          <p className="hero-telemetry-tag mt-8">Governanza · Inteligencia · Datos verificables</p>

          <h1 id="hero-heading" className="hero-headline mt-3">
            <span className="hero-headline-human">
              El Estado que puedes
              <em className="not-italic text-sky-300"> verificar</em>.
            </span>
            <span className="hero-headline-sub">
              IA institucional, telemetría pública y participación real — sin opacidad, sin PII expuesta.
            </span>
          </h1>

          <p className="hero-friendly mt-6 max-w-lg">
            <strong className="font-medium text-white">AGIGOV</strong> es el protocolo global.
            Aquí exploras <strong className="text-amber-100/90">Venezuela (VEN)</strong>: gestión en
            ledger, propuestas ciudadanas y proyectos DAO en un solo lugar navegable.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link to="/institucional" className="hero-cta-primary">
              Explorar AGIGOV-VEN
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/gestion" className="hero-cta-ghost">
              <Activity className="h-4 w-4" />
              Ver telemetría
            </Link>
          </div>

          <ul className="hero-trust-row mt-8" aria-label="Garantías del protocolo">
            {['Multifirma', 'Registro inmutable', 'Decisión humana', 'Primero offline'].map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>

        {/* Telemetry console */}
        <aside className="hero-console" aria-label="Consola de telemetría pública">
          <div className="hero-console-scan" aria-hidden />
          <header className="hero-console-header">
            <div>
              <p className="hero-console-label">Telemetría pública</p>
              <p className="hero-console-title">Nodo · AGIGOV-VEN</p>
            </div>
          <span className="hero-console-badge">{loading ? 'SYNC' : 'EN VIVO'}</span>
          </header>

          <div className="hero-metrics">
            <MetricBlock
              label="Ledger entries"
              value={ledger !== null ? ledger.toLocaleString('es-VE') : '—'}
              unit="rows"
              accent="cyan"
            />
            <MetricBlock
              label="Reportes"
              value={reports !== null ? String(reports) : '—'}
              unit="pub"
              accent="gold"
            />
          </div>

          <div className="hero-sparkline-wrap" aria-hidden>
            <p className="hero-console-label mb-2">Actividad agregada</p>
            <SparklineBars seed={ledger ?? 42} />
          </div>

          <div className="hero-pipeline-mini">
            <p className="hero-console-label mb-3">Pipeline institucional</p>
            <div className="hero-pipeline-track">
              {PIPELINE.map((step, i) => (
                <div key={step} className="hero-pipeline-node">
                  <span
                    className={`hero-pipeline-dot ${i <= 2 ? 'hero-pipeline-dot--active' : ''}`}
                  />
                  <span className="hero-pipeline-name">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-agents">
            <p className="hero-console-label mb-3">Enjambre · agentes</p>
            <ul className="hero-agent-list">
              {AGENTS.map((a) => (
                <li key={a.id} className="hero-agent-item">
                  <span className="hero-agent-led" aria-hidden />
                  <span className="hero-agent-name">{a.label}</span>
                  <span className="hero-agent-role">{a.role}</span>
                </li>
              ))}
            </ul>
          </div>

          {latest ? (
            <div className="hero-console-footer">
              <p className="hero-console-label">Última publicación</p>
              <p className="mt-1 line-clamp-2 text-sm leading-snug text-slate-300">
                {latest.summary}
              </p>
              <p className="hero-mono mt-2 truncate">{latest.processId}</p>
            </div>
          ) : (
            <div className="hero-console-footer">
              <p className="text-sm text-slate-500">
                {loading ? 'Sincronizando ledger…' : 'Activa la API para telemetría en vivo.'}
              </p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

function MetricBlock({
  label,
  value,
  unit,
  accent,
}: {
  label: string;
  value: string;
  unit: string;
  accent: 'cyan' | 'gold';
}) {
  return (
    <div className={`hero-metric hero-metric--${accent}`}>
      <p className="hero-console-label">{label}</p>
      <p className="hero-metric-value">
        {value}
        <span className="hero-metric-unit">{unit}</span>
      </p>
    </div>
  );
}

function SparklineBars({ seed }: { seed: number }) {
  const bars = Array.from({ length: 24 }, (_, i) => {
    const h = 20 + ((seed * (i + 7)) % 70);
    return h;
  });

  return (
    <div className="hero-sparkline">
      {bars.map((h, i) => (
        <span key={i} className="hero-sparkline-bar" style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}

function HeroBackdrop() {
  return (
    <div className="hero-backdrop" aria-hidden>
      <svg className="hero-constellation" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="hero-aurora" cx="50%" cy="0%" r="80%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.12" />
            <stop offset="45%" stopColor="#6366f1" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#050810" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="800" height="600" fill="url(#hero-aurora)" />
        {[
          [120, 180, 280, 120],
          [280, 120, 480, 200],
          [480, 200, 620, 140],
          [200, 320, 400, 280],
          [400, 280, 580, 360],
          [120, 180, 200, 320],
        ].map(([x1, y1, x2, y2], i) => (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="rgba(56,189,248,0.15)"
            strokeWidth="1"
          />
        ))}
        {[
          [120, 180],
          [280, 120],
          [480, 200],
          [620, 140],
          [200, 320],
          [400, 280],
          [580, 360],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="3" fill="rgba(34,211,238,0.5)" className="hero-node" />
        ))}
      </svg>
    </div>
  );
}
