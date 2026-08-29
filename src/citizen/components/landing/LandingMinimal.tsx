import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Apple,
  Building2,
  ChevronRight,
  LayoutDashboard,
  Mail,
  Monitor,
  Package,
  Plug,
  Rocket,
  Terminal,
  UserPlus,
} from 'lucide-react';

import { AgigovLogo } from '../AgigovLogo.js';
import { INSTITUTION_ROUTES } from '../../platform/institutionalRoutes.js';
import { AGIGOV_MODELS } from '../../platform/agigovModels.js';
import { getEffectiveModelStatus } from '../../platform/modelStatusSync.js';
import {
  LANDING_UTILITY_GENERAL,
  MODEL_OUTCOME_COPIES,
} from '../../content/landingOutcomes.js';
import { modelWorkspacePath } from '../../platform/modelWorkspace.js';
import { prefetchRoute } from '../../platform/routePrefetch.js';

export type LandingRow = {
  to: string;
  label: string;
  meta: string;
  icon: LucideIcon;
  external?: boolean;
};

/** Barra superior — logo + 2 acciones. */
export function LandingNav() {
  return (
    <header className="ls-min-nav">
      <div className="ls-min-inner ls-min-nav-inner">
        <Link to="/" className="ls-min-logo" aria-label="AGIGOV inicio">
          <AgigovLogo size="md" showWordmark variant="light" />
        </Link>
        <nav className="ls-min-nav-actions" aria-label="Acceso rápido">
          <Link to={INSTITUTION_ROUTES.desk} className="ls-min-nav-link">
            Escritorio
          </Link>
          <Link to={INSTITUTION_ROUTES.register} className="ls-min-btn">
            Comenzar
          </Link>
        </nav>
      </div>
    </header>
  );
}

const HERO_TITLE_ROTOR = [
  '2.0',
  'verificable',
  'evidencia publicada',
  'ciudadanos',
  'confianza',
  'transparencia',
] as const;

const ROTOR_MS = 3200;

function LandingHeroTitleRotor() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % HERO_TITLE_ROTOR.length),
      ROTOR_MS,
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="ls-min-title-rotor" aria-live="polite">
      {HERO_TITLE_ROTOR[index]}
    </span>
  );
}

/** Hero — una promesa, dos CTAs. */
export function LandingHero() {
  return (
    <section className="ls-min-hero" aria-labelledby="landing-title">
      <div className="ls-min-inner">
        <h1 id="landing-title" className="ls-min-title">
          <span className="ls-min-title-base">Gobernanza</span>
          <LandingHeroTitleRotor />
        </h1>
        <p className="ls-min-lead">
          Modelos operativos con evidencia publicada — no un chatbot.
        </p>
        <div className="ls-min-hero-cta">
          <Link to={INSTITUTION_ROUTES.desk} className="ls-min-btn">
            <LayoutDashboard className="h-4 w-4" aria-hidden />
            Abrir escritorio
          </Link>
          <Link to="/modelos" className="ls-min-btn ls-min-btn--ghost">
            <Package className="h-4 w-4" aria-hidden />
            Ver modelos
          </Link>
        </div>
      </div>
    </section>
  );
}

type SectionProps = {
  id: string;
  title: string;
  lead?: string;
  rows: LandingRow[];
};

export function LandingSection({ id, title, lead, rows }: SectionProps) {
  return (
    <section id={id} className="ls-min-section" aria-labelledby={`${id}-title`}>
      <div className="ls-min-inner">
        <header className="ls-min-section-head">
          <h2 id={`${id}-title`} className="ls-min-section-title">
            {title}
          </h2>
          {lead ? <p className="ls-min-section-lead">{lead}</p> : null}
        </header>
        <LandingRowList rows={rows} />
      </div>
    </section>
  );
}

export function LandingRowList({ rows }: { rows: LandingRow[] }) {
  return (
    <ul className="ls-min-list">
      {rows.map((row) => {
        const Icon = row.icon;
        const isExternal =
          row.external ?? (row.to.startsWith('mailto:') || row.to.startsWith('http'));
        const inner = (
          <>
            <span className="ls-min-row-icon" aria-hidden>
              <Icon className="h-4 w-4" />
            </span>
            <span className="ls-min-row-body">
              <span className="ls-min-row-name">{row.label}</span>
              <span className="ls-min-row-meta">{row.meta}</span>
            </span>
            <ChevronRight className="ls-min-row-chevron h-4 w-4" aria-hidden />
          </>
        );

        return (
          <li key={`${row.to}-${row.label}`}>
            {isExternal ? (
              <a href={row.to} className="ls-min-row">
                {inner}
              </a>
            ) : (
              <Link
                to={row.to}
                className="ls-min-row"
                onMouseEnter={() => prefetchRoute(row.to)}
                onFocus={() => prefetchRoute(row.to)}
              >
                {inner}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}

const WHAT_IS_ROWS: LandingRow[] = [
  {
    to: '/escritorio',
    label: 'Escritorio de trabajo',
    meta: 'Sus espacios — ordenados y claros',
    icon: LayoutDashboard,
  },
  {
    to: '/gestion',
    label: 'Registro publicado',
    meta: 'Telemetría verificable sin datos personales',
    icon: Package,
  },
  {
    to: '/institucional',
    label: 'Institucional',
    meta: 'Registro, piloto y soporte humano',
    icon: Building2,
  },
];

export function LandingWhatSection() {
  return (
    <LandingSection
      id="que-es"
      title="Quiénes somos"
      lead="Somos AGIGOV — multi-agente de modelos verificables para el Estado y la ciudadanía."
      rows={WHAT_IS_ROWS}
    />
  );
}

function LandingOutcomeList() {
  const items = MODEL_OUTCOME_COPIES.map((copy) => {
    const model = AGIGOV_MODELS.find((m) => m.id === copy.modelId);
    if (!model || getEffectiveModelStatus(model.id, model.status) === 'roadmap') {
      return null;
    }
    const Icon = model.icon;
    return (
      <li key={copy.modelId}>
        <Link
          to={model.productPath}
          className="ls-min-outcome"
          onMouseEnter={() => prefetchRoute(model.productPath)}
          onFocus={() => prefetchRoute(model.productPath)}
        >
          <span className="ls-min-row-icon" aria-hidden>
            <Icon className="h-4 w-4" />
          </span>
          <span className="ls-min-outcome-body">
            <span className="ls-min-outcome-name">{model.shortName}</span>
            <span className="ls-min-outcome-line">
              <span className="ls-min-outcome-kicker">Hoy</span> {copy.today}
            </span>
            <span className="ls-min-outcome-line ls-min-outcome-line--gain">
              <span className="ls-min-outcome-kicker">Obtiene</span> {copy.outcome}
            </span>
            <span className="ls-min-outcome-benefit">
              Ciudadano: {copy.citizen} · Estado: {copy.state}
            </span>
          </span>
          <ChevronRight className="ls-min-row-chevron h-4 w-4 shrink-0" aria-hidden />
        </Link>
      </li>
    );
  }).filter((item): item is JSX.Element => item !== null);

  return <ul className="ls-min-list ls-min-list--outcomes">{items}</ul>;
}

/** Utilidad general + por modelo (hoy → resultado). */
export function LandingUtilitySection() {
  return (
    <section id="utilidad" className="ls-min-section" aria-labelledby="utilidad-title">
      <div className="ls-min-inner">
        <header className="ls-min-section-head">
          <h2 id="utilidad-title" className="ls-min-section-title">
            {LANDING_UTILITY_GENERAL.title}
          </h2>
          <p className="ls-min-section-lead">{LANDING_UTILITY_GENERAL.lead}</p>
        </header>
        <header className="ls-min-subsection-head">
          <h3 className="ls-min-subsection-title">Qué hace · Qué obtienes</h3>
          <p className="ls-min-subsection-lead">Por modelo — hoy tiene X, despliega y obtiene Y.</p>
        </header>
        <LandingOutcomeList />
      </div>
    </section>
  );
}

export function LandingModelsSection() {
  const deployable = AGIGOV_MODELS.filter(
    (m) => getEffectiveModelStatus(m.id, m.status) !== 'roadmap',
  ).slice(0, 6);

  const rows: LandingRow[] = deployable.map((model) => {
    const Icon = model.icon;
    return {
      to: model.productPath,
      label: model.shortName,
      meta: model.tagline,
      icon: Icon,
    };
  });

  rows.push({
    to: '/modelos',
    label: 'Ver catálogo completo',
    meta: 'Gobierno · empresa · ciudadano',
    icon: Package,
  });

  return (
    <LandingSection
      id="modelos"
      title="Modelos operativos"
      lead="Elija según el resultado que necesita — cada ficha detalla agentes, flujo y evidencia."
      rows={rows}
    />
  );
}

export function LandingStartSection() {
  const rows: LandingRow[] = [
    {
      to: INSTITUTION_ROUTES.desk,
      label: 'Abrir escritorio',
      meta: 'Inicio del ambiente de trabajo',
      icon: LayoutDashboard,
    },
    {
      to: modelWorkspacePath('egs'),
      label: 'Desplegar EGS',
      meta: 'Reparto del ahorro por eficiencia',
      icon: Rocket,
    },
    {
      to: INSTITUTION_ROUTES.register,
      label: 'Crear cuenta',
      meta: 'Institución o integrador',
      icon: UserPlus,
    },
    {
      to: '/desarrolladores',
      label: 'Conectar API',
      meta: 'Documentación y health del nodo',
      icon: Plug,
    },
    {
      to: 'mailto:info@armadaai.co',
      label: 'Contacto',
      meta: 'Piloto guiado con el equipo',
      icon: Mail,
    },
  ];

  return (
    <LandingSection
      id="empezar"
      title="Empezar"
      lead="Desde el primer clic: orden, simpleza y estructura."
      rows={rows}
    />
  );
}

const PLATFORM_ICONS = [
  { Icon: Monitor, label: 'Windows' },
  { Icon: Apple, label: 'macOS' },
  { Icon: Terminal, label: 'Linux' },
] as const;

/** Franja compacta antes del footer — descarga desktop. */
export function LandingDownloadStrip() {
  return (
    <section className="ls-min-download" aria-labelledby="landing-download-title">
      <div className="ls-min-inner">
        <div className="ls-min-download-inner">
          <div className="ls-min-download-copy">
            <p id="landing-download-title" className="ls-min-download-title">
              App de escritorio
            </p>
            <p className="ls-min-download-meta">Windows · macOS · Linux</p>
          </div>
          <div className="ls-min-download-actions">
            <Link to="/descargar" className="ls-min-btn ls-min-btn--compact">
              Descargar
            </Link>
            <div className="ls-min-platform-icons" aria-hidden>
              {PLATFORM_ICONS.map(({ Icon, label }) => (
                <span key={label} className="ls-min-platform-icon" title={label}>
                  <Icon className="h-3.5 w-3.5" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
