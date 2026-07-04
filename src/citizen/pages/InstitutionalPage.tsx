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
import { PolicyComparator } from '../components/PolicyComparator.js';
import { PilotStatusSection } from '../components/PilotStatusSection.js';
import { InstitutionalStoryActs } from '../components/institutional/InstitutionalStoryActs.js';

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
            descentralizado, transparente y verificable. Diez modelos operativos agrupados en tres
            audiencias: gubernamental, empresarial y ciudadano.
          </p>
          <p className="mt-4">
            <HelpTopicLink topic="institucional" />
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/institucional#desplegar" className="ds-btn-app">
              Desplegar AGIGOV
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/desarrolladores" className="ds-btn-secondary ds-btn-app-shape">
              Portal desarrolladores
            </Link>
            <Link to="/modelos" className="ds-btn-secondary ds-btn-app-shape">
              Ver catálogo de modelos
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
          El marco poético del protocolo AGIGOV — instituciones al servicio de la vida, no de la
          opacidad. Cinco actos que articulan el sueño antes del despliegue técnico.
        </p>
        <div className="mt-8">
          <InstitutionalStoryActs />
        </div>
        <p className="mt-6 text-sm text-agigov-text-muted">
          Para activar el modelo EGS en su jurisdicción,{' '}
          <Link to="/modelos/egs" className="text-sky-300 hover:text-sky-200">
            revise la ficha del servicio
          </Link>
          .
        </p>
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
              Acompañamiento para incorporar el modelo AGIGOV en tu jurisdicción: carta
              institucional, adhesión al protocolo, despliegue multi-sig y publicación de gestión
              verificable.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-agigov-text-muted">
              <li>· Evaluación de readiness institucional</li>
              <li>· Ratificación de carta y política de participación</li>
              <li>· Conexión con sandbox AGIGOV-SBX para pruebas controladas</li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/participar" className="ds-btn-app">
                Iniciar solicitud
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/institucional#protocolo" className="ds-btn-secondary ds-btn-app-shape">
                Ver protocolo
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
              Documentación del protocolo AGIGOV
            </h2>
            <p className="agigov-lead mt-2">
              Especificación técnica del protocolo global: API pública, agentes institucionales,
              firmas Ed25519, IAP y seguridad PQC. Cada jurisdicción despliega su instancia
              AGIGOV-[ISO] sobre el mismo protocolo.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-agigov-text-muted">
              <li>· API pública en <code className="text-sky-400">:3001/api/public/*</code></li>
              <li>· Handshake inter-nodo <code className="text-sky-400">/api/public/health</code></li>
              <li>· Documentación en <code className="text-sky-400">docs/AGIGOV/</code> y AGENTS.md</li>
            </ul>
            <Link to="/gestion" className="agigov-link mt-4 inline-flex items-center gap-1 text-sm">
              Probar con gestión pública
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-10 grid gap-4 sm:grid-cols-2">
        {pillars.map(({ icon, title, text }) => (
          <PillarCard key={title} icon={icon} title={title} text={text} />
        ))}
      </section>

      <PolicyComparator />

      <PilotStatusSection />

      <section id="whitepaper" className="agigov-card mb-10 scroll-mt-28">
        <div className="flex items-start gap-3">
          <div className="agigov-pillar-icon shrink-0">
            <ScrollText className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-agigov-text">White paper AGIGOV</h2>
            <p className="agigov-lead mt-2">
              Marco conceptual de Gobernanza 2.0: Estado verificable, participación continua y economía
              trazada. Base normativa antes de desplegar AGIGOV-[ISO] en cualquier jurisdicción.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-agigov-text-muted">
              <li>· Principios de transparencia selectiva y human-in-the-loop</li>
              <li>· Arquitectura de agentes institucionales (centinela → ledger → comunicador)</li>
              <li>· Adhesión a red global sin perder soberanía territorial</li>
            </ul>
            <p className="mt-4 font-mono text-xs text-agigov-text-muted">docs/AGIGOV/WHITEPAPER.md</p>
          </div>
        </div>
      </section>

      <section id="documentacion" className="agigov-card mb-10 scroll-mt-28">
        <h2 className="font-display text-xl font-bold text-agigov-text">Documentación</h2>
        <p className="agigov-lead mt-2">
          Especificación técnica, carta institucional y guías de implementación en{' '}
          <code className="text-agigov-primary">docs/AGIGOV/</code>.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DocLink icon={FileCheck} title="Carta institucional" note="Marco genérico — v0.1" />
          <DocLink icon={ScrollText} title="Política de participación" note="Pipeline ciudadano" />
          <DocLink icon={Network} title="Red AGIGOV-SBX" note="Sandbox interop entre jurisdicciones" />
        </div>
      </section>

      <section className="agigov-card mb-10">
        <h2 className="font-semibold text-agigov-text">Carta institucional</h2>
        <p className="agigov-lead mt-2">
          La carta institucional (v0.1) define principios, DAO, participación, seguridad PQC
          y adhesión a la red global. Ratificación en demo multi-sig — producción requiere
          firmas humanas reales.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/proyectos" className="ds-btn-secondary ds-btn-app-shape">
            Proyectos financiados
          </Link>
          <Link to="/propuestas" className="ds-btn-secondary ds-btn-app-shape">
            Ver propuestas
          </Link>
        </div>
      </section>

      <section className="agigov-card mb-10 border-l-4 border-sky-500/40">
        <h2 className="font-semibold text-agigov-text">Modelos del sistema</h2>
        <ul className="mt-4 space-y-3 text-sm text-agigov-text-muted">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
            <Link to="/modelos/set" className="text-sky-300 hover:text-sky-200">
              Sistema Electoral Tokenizado (SET)
            </Link>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
            <Link to="/modelos/dao-ciudadano" className="text-sky-300 hover:text-sky-200">
              Prosperidad Compartida (DAO)
            </Link>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
            <Link to="/modelos" className="text-sky-300 hover:text-sky-200">
              Catálogo completo · gubernamental · empresarial · ciudadano
            </Link>
          </li>
        </ul>
        <Link to="/modelos" className="ds-btn-accent mt-6">
          Explorar modelos
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
    <div className="agigov-card">
      <Icon className="mb-3 h-6 w-6 text-agigov-accent-soft" />
      <p className="font-semibold text-agigov-text">{title}</p>
      <p className="mt-1 text-sm text-agigov-text-muted">{note}</p>
      <p className="mt-3 font-mono text-[10px] text-agigov-text-muted/50">docs/AGIGOV/</p>
    </div>
  );
}
