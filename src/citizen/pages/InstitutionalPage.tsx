import { Link } from 'react-router-dom';
import {
  Shield,
  Globe,
  Vote,
  Coins,
  Users,
  FileCheck,
  ArrowRight,
  ScrollText,
  Code2,
  Network,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { AgigovLogo } from '../components/AgigovLogo.js';
import { breadcrumbsForPath } from '../components/AppBreadcrumbs.js';
import { PageShell } from '../components/PageShell.js';
import { HelpTopicLink } from '../components/HelpTopicLink.js';
import { PillarCard } from '../components/QuickActionCard.js';
import { PilotStatusSection } from '../components/PilotStatusSection.js';
import { InstitutionalStoryActs } from '../components/institutional/InstitutionalStoryActs.js';
import { INSTITUTION_ROUTES } from '../platform/institutionalRoutes.js';

const pillars = [
  {
    icon: Shield,
    title: 'Estado transparente',
    text: 'Gestión publicada en ledger verificable. Sin opacidad burocrática.',
  },
  {
    icon: Vote,
    title: 'Política 2.0',
    text: 'Participación, campañas y voto tokenizado con ciberseguridad.',
  },
  {
    icon: Coins,
    title: 'Economía compartida',
    text: 'Tokens, DAO y proyectos visibles para la prosperidad de todos.',
  },
  {
    icon: Globe,
    title: 'Despliegue jurisdiccional',
    text: 'Cada Estado adopta AGIGOV-[ISO] con carta propia sin perder interoperabilidad del protocolo.',
  },
] as const;

export default function InstitutionalPage() {
  return (
    <PageShell narrow={false} breadcrumbs={breadcrumbsForPath('/institucional')}>
      <section className="agigov-hero mb-10">
        <div className="agigov-hero-glow" />
        <div className="agigov-hero-glow-gold" />
        <div className="relative z-10">
          <AgigovLogo size="md" showWordmark />
          <h1 className="mt-6 font-display text-3xl font-bold text-agigov-text md:text-4xl">
            Modelo AGIGOV · Gobernanza 2.0
          </h1>
          <p className="mt-2 text-lg text-agigov-text-muted">
            Protocolo global replicable como AGIGOV-[ISO]
          </p>
          <p className="agigov-lead mt-4 max-w-2xl">
            Un modelo unificado de <strong className="text-agigov-text">Estado, política y economía</strong>,
            descentralizado, transparente y verificable.
          </p>
          <p className="mt-4">
            <HelpTopicLink topic="institucional" />
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/institucional#desplegar" className="ds-btn-app">
              Desplegar AGIGOV
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/modelos" className="ds-btn-secondary ds-btn-app-shape">
              Ver modelos
            </Link>
          </div>
        </div>
      </section>

      <section id="vision" className="agigov-card mb-10 scroll-mt-28 border border-sky-500/15">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-agigov-text-muted">
          Narrativa institucional
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold text-agigov-text">
          La visión · Actos I–V
        </h2>
        <p className="agigov-lead mt-3 max-w-2xl">
          Cinco actos que articulan el marco del protocolo antes del despliegue técnico.
        </p>
        <div className="mt-8">
          <InstitutionalStoryActs />
        </div>
      </section>

      <section id="desplegar" className="agigov-card mb-10 scroll-mt-28 border border-agigov-primary/15">
        <div className="flex items-start gap-3">
          <div className="agigov-pillar-icon shrink-0">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-agigov-text">
              Concierge para gobiernos e instituciones
            </h2>
            <p className="agigov-lead mt-2">
              Carta institucional, adhesión al protocolo, multi-sig y gestión verificable.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-agigov-text-muted">
              <li>· Evaluación de readiness institucional</li>
              <li>· Ratificación de carta y política de participación</li>
              <li>· Sandbox AGIGOV-SBX para pruebas controladas</li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to={INSTITUTION_ROUTES.register} className="ds-btn-app">
                Registro institucional
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to={INSTITUTION_ROUTES.login} className="ds-btn-secondary ds-btn-app-shape">
                Ya tengo cuenta
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="protocolo" className="agigov-card mb-10 scroll-mt-28">
        <div className="flex items-start gap-3">
          <div className="agigov-pillar-icon shrink-0">
            <Code2 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-agigov-text">
              Protocolo y documentación
            </h2>
            <p className="agigov-lead mt-2">
              API pública, agentes, firmas Ed25519, IAP y preparación PQC. Carta institucional y
              white paper en <code className="text-agigov-primary">docs/AGIGOV/</code>.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <DocLink icon={FileCheck} title="Carta institucional" note="Marco genérico — v0.1" />
              <DocLink icon={ScrollText} title="White paper" note="docs/AGIGOV/WHITEPAPER.md" />
              <DocLink icon={Network} title="Red AGIGOV-SBX" note="Sandbox interop" />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/desarrolladores" className="ds-btn-secondary ds-btn-app-shape">
                Portal desarrolladores
              </Link>
              <Link to="/gestion" className="agigov-link inline-flex items-center gap-1 text-sm">
                Probar gestión pública
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10 grid gap-4 sm:grid-cols-2">
        {pillars.map(({ icon, title, text }) => (
          <PillarCard key={title} icon={icon} title={title} text={text} />
        ))}
      </section>

      <PilotStatusSection />

      <section className="agigov-card mb-10">
        <h2 className="font-semibold text-agigov-text">Modelos del sistema</h2>
        <p className="agigov-lead mt-2">
          Diez modelos en tres audiencias: gubernamental, empresarial y ciudadano.
        </p>
        <Link to="/modelos" className="ds-btn-app mt-6 inline-flex">
          Explorar catálogo
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </PageShell>
  );
}

function DocLink({
  icon: Icon,
  title,
  note,
}: {
  icon: LucideIcon;
  title: string;
  note: string;
}) {
  return (
    <div className="rounded-xl border border-agigov-border bg-agigov-surface-elevated/60 p-4">
      <Icon className="mb-2 h-5 w-5 text-agigov-accent-soft" />
      <p className="font-semibold text-agigov-text">{title}</p>
      <p className="mt-1 text-sm text-agigov-text-muted">{note}</p>
    </div>
  );
}
