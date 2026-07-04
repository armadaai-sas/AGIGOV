import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Cpu,
  Network,
  Scale,
  ShieldCheck,
  TrendingDown,
  Users,
} from 'lucide-react';

import { breadcrumbsForPath } from '../components/AppBreadcrumbs.js';
import { ServiceConnectionPanel } from '../components/services/ServiceConnectionPanel.js';
import { PageShell, SectionHeader } from '../components/PageShell.js';
import {
  EGS_VIAL_CONSOLE_PATH,
  EGS_VIAL_PRODUCT_PATH,
} from '../services/egs-vial-service.js';

const AGENTS = [
  {
    id: 'centinela',
    name: 'Centinela',
    role: 'Validación e integridad',
    detail: 'Reconcilia hitos ↔ escrow antes de calcular Δ. Congela el cierre ante discrepancia.',
  },
  {
    id: 'logistico',
    name: 'Logístico',
    role: 'Ejecución presupuestaria',
    detail: 'QuarterClose, liberaciones Smart Escrow y payload a tesorería.',
  },
  {
    id: 'soberano',
    name: 'Soberano',
    role: 'Marco legal',
    detail: 'Dictamen AEI, acta baseline multi-sig, condiciones de promulgación.',
  },
] as const;

const STACK = [
  { label: 'API pública', desc: 'REST · datos publicados post-validación' },
  { label: 'Postgres + Prisma', desc: 'Ledger transaccional · QuarterClose' },
  { label: 'Panel ciudadano', desc: 'Salud MPPI · contratos · transparencia' },
  { label: 'Agentes IAP', desc: 'Envelopes firmados · anti-replay' },
] as const;

/** Página producto estilo cloud — vende antes de la consola. */
export default function EgsVialProductPage() {
  return (
    <PageShell narrow={false} banner={undefined} breadcrumbs={breadcrumbsForPath(EGS_VIAL_PRODUCT_PATH)}>
      <header className="mb-10 agigov-enter-up">
        <p className="agigov-eyebrow">AGIGOV / VEN / Servicios</p>
        <h1 className="agigov-page-title mt-2 max-w-3xl">
          EGS Piloto Vial — Sistema nervioso del presupuesto ministerial
        </h1>
        <p className="agigov-lead mt-4 max-w-2xl">
          Efficiency Gain Share para mantenimiento vial verificable. Ejecución con evidencia,
          cierre trimestral automático, fee AGIGOV{' '}
          <strong className="text-agigov-text">solo sobre ahorro verificado</strong>.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to={EGS_VIAL_CONSOLE_PATH} className="ui-btn-primary ui-btn-lg">
            Activar consola
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link to="/transparencia" className="ui-btn-secondary ui-btn-lg">
            Documentación legal
          </Link>
        </div>
      </header>

      <section className="mb-10 grid gap-4 lg:grid-cols-2">
        <div className="agigov-card">
          <TrendingDown className="h-6 w-6 text-emerald-400" />
          <h2 className="mt-4 font-display text-lg font-semibold">Qué resuelve</h2>
          <p className="mt-2 text-sm text-agigov-text-muted">
            Demostrar, hito por hito, dónde fue cada bolívar del presupuesto vial — sin planillas
            tardías ni opacidad percibida.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-agigov-text-muted">
            <li>· Baseline ministerial multi-sig</li>
            <li>· 50 hitos verificados (demo: 10 contratos × 5)</li>
            <li>· Δ trimestral publicable (demo: 180.000 VES)</li>
          </ul>
        </div>
        <div className="agigov-card">
          <Scale className="h-6 w-6 text-sky-400" />
          <h2 className="mt-4 font-display text-lg font-semibold">Modelo comercial EGS</h2>
          <p className="mt-2 text-sm text-agigov-text-muted">
            Sin licencia adelantada. Reparto del ahorro verificable Δ:
          </p>
          <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
              <dt className="text-2xl font-bold text-emerald-300">70%</dt>
              <dd className="text-xs text-agigov-text-muted">Re-inversión</dd>
            </div>
            <div className="rounded-lg border border-sky-500/20 bg-sky-500/10 p-3">
              <dt className="text-2xl font-bold text-sky-300">20%</dt>
              <dd className="text-xs text-agigov-text-muted">Incentivos</dd>
            </div>
            <div className="rounded-lg border border-violet-500/20 bg-violet-500/10 p-3">
              <dt className="text-2xl font-bold text-violet-300">10%</dt>
              <dd className="text-xs text-agigov-text-muted">Fee AGIGOV</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-agigov-text-muted">Si Δ = 0, fee AGIGOV = 0.</p>
        </div>
      </section>

      <section className="mb-10">
        <SectionHeader
          eyebrow="Arquitectura"
          title="Qué hace el nodo del servicio"
          lead="Componentes desplegables en el territorio VEN_VIAL_PILOT_01."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STACK.map((item) => (
            <div key={item.label} className="agigov-card text-sm">
              <Cpu className="h-5 w-5 text-sky-400" />
              <p className="mt-3 font-semibold text-agigov-text">{item.label}</p>
              <p className="mt-1 text-agigov-text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="agigov-card mt-4 font-mono text-xs text-agigov-text-muted">
          Escrow → Hitos (IoT + auditores) → Centinela → QuarterClose → Δ → 70/20/10 → Tesorería
        </div>
      </section>

      <section className="mb-10">
        <SectionHeader
          eyebrow="Agentes institucionales"
          title="Automatización verificable — promulgación humana"
          lead="Los agentes preparan y validan; las firmas autorizadas deciden."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {AGENTS.map((agent) => (
            <article key={agent.id} className="agigov-card">
              <Users className="h-5 w-5 text-sky-400" />
              <h3 className="mt-3 font-display font-semibold">{agent.name}</h3>
              <p className="text-xs font-medium uppercase tracking-wide text-sky-300/80">
                {agent.role}
              </p>
              <p className="mt-2 text-sm text-agigov-text-muted">{agent.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <SectionHeader
          eyebrow="Conexión"
          title="Elegir servicio · Conectar · Utilizar"
          lead="Verifique el nodo antes de abrir la consola operativa."
        />
        <ServiceConnectionPanel />
      </section>

      <section className="agigov-card flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-emerald-400" />
          <div>
            <p className="font-display text-lg font-semibold">Listo para operar</p>
            <p className="text-sm text-agigov-text-muted">
              Partida piloto 4.01.02.01.00 · MPPI · Q2 2026
            </p>
          </div>
        </div>
        <Link to={EGS_VIAL_CONSOLE_PATH} className="ui-btn-primary">
          Abrir consola EGS
          <Network className="h-4 w-4" />
        </Link>
      </section>
    </PageShell>
  );
}
