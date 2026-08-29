import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Apple,
  Building2,
  ChevronRight,
  Code2,
  Github,
  LayoutDashboard,
  Mail,
  Monitor,
  Package,
  Plug,
  Rocket,
  Terminal,
  UserPlus,
  Users,
} from 'lucide-react';

import { AgigovLogo } from '../AgigovLogo.js';
import { useSovereignConfig } from '../../context/PlatformContext.js';
import { INSTITUTION_ROUTES, TEAM_CONTACT_MAILTO } from '../../platform/institutionalRoutes.js';
import { AGIGOV_MODELS } from '../../platform/agigovModels.js';
import { getEffectiveModelStatus } from '../../platform/modelStatusSync.js';
import {
  landingModelOutcomes,
  landingOpenSourceCopy,
  landingRotorWords,
  landingUtilityGeneral,
} from '../../content/landingMinimalCopy.js';
import { modelWorkspacePath } from '../../platform/modelWorkspace.js';
import { prefetchRoute } from '../../platform/routePrefetch.js';

export type LandingRow = {
  to: string;
  label: string;
  meta: string;
  icon: LucideIcon;
  external?: boolean;
};

const ROTOR_MS = 4000;

/** Barra superior — logo + acceso rápido. */
export function LandingNav() {
  const { t } = useSovereignConfig();

  return (
    <header className="ls-min-nav">
      <div className="ls-min-inner ls-min-nav-inner">
        <Link to="/" className="ls-min-logo" aria-label="AGIGOV inicio">
          <AgigovLogo size="md" showWordmark variant="light" />
        </Link>
        <nav className="ls-min-nav-actions" aria-label="Acceso rápido">
          <Link to={INSTITUTION_ROUTES.desk} className="ls-min-nav-link">
            {t('landing.min.nav.desk')}
          </Link>
          <Link to={INSTITUTION_ROUTES.login} className="ls-min-nav-link">
            {t('landing.min.nav.access')}
          </Link>
          <Link to={INSTITUTION_ROUTES.register} className="ls-min-btn">
            {t('landing.min.nav.register')}
          </Link>
        </nav>
      </div>
    </header>
  );
}

function LandingHeroTitleRotor({ words }: { words: readonly string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % words.length), ROTOR_MS);
    return () => window.clearInterval(id);
  }, [words.length]);

  useEffect(() => {
    setIndex(0);
  }, [words]);

  return (
    <span
      key={index}
      className={`ls-min-title-rotor${index === 0 ? ' ls-min-title-rotor--brand' : ''}`}
      aria-live="polite"
    >
      {words[index]}
    </span>
  );
}

function LandingAudienceTriage() {
  const { t } = useSovereignConfig();
  const items = [
    {
      to: INSTITUTION_ROUTES.hub,
      label: t('landing.min.triage.state.label'),
      meta: t('landing.min.triage.state.meta'),
      icon: Building2,
    },
    {
      to: '/gestion',
      label: t('landing.min.triage.citizen.label'),
      meta: t('landing.min.triage.citizen.meta'),
      icon: Users,
    },
    {
      to: '/desarrolladores',
      label: t('landing.min.triage.integrator.label'),
      meta: t('landing.min.triage.integrator.meta'),
      icon: Plug,
    },
  ] as const;

  return (
    <div className="ls-min-triage" aria-labelledby="landing-triage-label">
      <p id="landing-triage-label" className="ls-min-triage-label">
        {t('landing.min.triage.label')}
      </p>
      <ul className="ls-min-triage-list">
        {items.map(({ to, label, meta, icon: Icon }) => (
          <li key={to}>
            <Link
              to={to}
              className="ls-min-triage-card"
              onMouseEnter={() => prefetchRoute(to)}
              onFocus={() => prefetchRoute(to)}
            >
              <span className="ls-min-triage-icon" aria-hidden>
                <Icon className="h-4 w-4" />
              </span>
              <span className="ls-min-triage-body">
                <span className="ls-min-triage-name">{label}</span>
                <span className="ls-min-triage-meta">{meta}</span>
              </span>
              <ChevronRight className="ls-min-triage-chevron h-4 w-4" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Hero — una promesa, triaje y dos CTAs. */
export function LandingHero() {
  const { t } = useSovereignConfig();
  const rotorWords = useMemo(() => landingRotorWords(t), [t]);

  return (
    <section className="ls-min-hero" aria-labelledby="landing-title">
      <div className="ls-min-hero-bg" aria-hidden />
      <div className="ls-min-inner ls-min-hero-inner">
        <h1 id="landing-title" className="ls-min-title">
          <span className="ls-min-title-base">{t('landing.min.hero.titleBase')}</span>
          <LandingHeroTitleRotor words={rotorWords} />
        </h1>
        <p className="ls-min-lead">{t('landing.min.hero.lead')}</p>
        <LandingAudienceTriage />
        <div className="ls-min-hero-cta">
          <Link to={INSTITUTION_ROUTES.desk} className="ls-min-btn ls-min-btn--primary">
            <LayoutDashboard className="h-4 w-4" aria-hidden />
            {t('landing.min.hero.cta.desk')}
          </Link>
          <Link to="/modelos" className="ls-min-btn ls-min-btn--ghost">
            <Package className="h-4 w-4" aria-hidden />
            {t('landing.min.hero.cta.models')}
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
  variant?: 'default' | 'oss';
};

export function LandingSection({ id, title, lead, rows, variant = 'default' }: SectionProps) {
  return (
    <section
      id={id}
      className={`ls-min-section${variant === 'oss' ? ' ls-min-section--oss' : ''}`}
      aria-labelledby={`${id}-title`}
    >
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

export function LandingWhatSection() {
  const { t } = useSovereignConfig();
  const rows: LandingRow[] = [
    {
      to: '/escritorio',
      label: t('landing.min.what.desk.label'),
      meta: t('landing.min.what.desk.meta'),
      icon: LayoutDashboard,
    },
    {
      to: '/gestion',
      label: t('landing.min.what.registry.label'),
      meta: t('landing.min.what.registry.meta'),
      icon: Package,
    },
    {
      to: '/institucional',
      label: t('landing.min.what.institutional.label'),
      meta: t('landing.min.what.institutional.meta'),
      icon: Building2,
    },
  ];

  return (
    <LandingSection
      id="que-es"
      title={t('landing.min.what.title')}
      lead={t('landing.min.what.lead')}
      rows={rows}
    />
  );
}

export function LandingOpenSourceSection() {
  const { t } = useSovereignConfig();
  const copy = landingOpenSourceCopy(t);
  const rows: LandingRow[] = [
    {
      to: copy.repoUrl,
      label: copy.repoLabel,
      meta: copy.repoMeta,
      icon: Github,
      external: true,
    },
    {
      to: copy.devPath,
      label: copy.devLabel,
      meta: copy.devMeta,
      icon: Code2,
    },
  ];

  return (
    <LandingSection
      id="codigo-abierto"
      variant="oss"
      title={copy.title}
      lead={copy.lead}
      rows={rows}
    />
  );
}

function LandingOutcomeList() {
  const { t } = useSovereignConfig();
  const copies = landingModelOutcomes(t);

  const items = copies
    .map((copy) => {
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
                <span className="ls-min-outcome-kicker">{t('landing.min.outcome.kicker.today')}</span>{' '}
                {copy.today}
              </span>
              <span className="ls-min-outcome-line ls-min-outcome-line--gain">
                <span className="ls-min-outcome-kicker">{t('landing.min.outcome.kicker.outcome')}</span>{' '}
                {copy.outcome}
              </span>
              <span className="ls-min-outcome-benefit">
                {t('landing.min.outcome.audience', { citizen: copy.citizen, state: copy.state })}
              </span>
            </span>
            <ChevronRight className="ls-min-row-chevron h-4 w-4 shrink-0" aria-hidden />
          </Link>
        </li>
      );
    })
    .filter((item): item is JSX.Element => item !== null);

  return <ul className="ls-min-list ls-min-list--outcomes">{items}</ul>;
}

/** Utilidad general + por modelo (hoy → resultado). */
export function LandingUtilitySection() {
  const { t } = useSovereignConfig();
  const copy = landingUtilityGeneral(t);

  return (
    <section id="utilidad" className="ls-min-section ls-min-section--utility" aria-labelledby="utilidad-title">
      <div className="ls-min-inner">
        <header className="ls-min-section-head">
          <h2 id="utilidad-title" className="ls-min-section-title">
            {copy.title}
          </h2>
          <p className="ls-min-section-lead">{copy.lead}</p>
        </header>
        <header className="ls-min-subsection-head">
          <h3 className="ls-min-subsection-title">{copy.subsectionTitle}</h3>
          <p className="ls-min-subsection-lead">{copy.subsectionLead}</p>
        </header>
        <LandingOutcomeList />
      </div>
    </section>
  );
}

export function LandingModelsSection() {
  const { t } = useSovereignConfig();
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
    label: t('landing.min.models.catalog.label'),
    meta: t('landing.min.models.catalog.meta'),
    icon: Package,
  });

  return (
    <LandingSection
      id="modelos"
      title={t('landing.min.models.title')}
      lead={t('landing.min.models.lead')}
      rows={rows}
    />
  );
}

export function LandingStartSection() {
  const { t } = useSovereignConfig();
  const rows: LandingRow[] = [
    {
      to: INSTITUTION_ROUTES.desk,
      label: t('landing.min.start.desk.label'),
      meta: t('landing.min.start.desk.meta'),
      icon: LayoutDashboard,
    },
    {
      to: modelWorkspacePath('egs'),
      label: t('landing.min.start.egs.label'),
      meta: t('landing.min.start.egs.meta'),
      icon: Rocket,
    },
    {
      to: INSTITUTION_ROUTES.register,
      label: t('landing.min.start.register.label'),
      meta: t('landing.min.start.register.meta'),
      icon: UserPlus,
    },
    {
      to: '/desarrolladores',
      label: t('landing.min.start.api.label'),
      meta: t('landing.min.start.api.meta'),
      icon: Plug,
    },
    {
      to: TEAM_CONTACT_MAILTO,
      label: t('landing.min.start.contact.label'),
      meta: t('landing.min.start.contact.meta'),
      icon: Mail,
      external: true,
    },
  ];

  return (
    <LandingSection
      id="empezar"
      title={t('landing.min.start.title')}
      lead={t('landing.min.start.lead')}
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
  const { t } = useSovereignConfig();

  return (
    <section className="ls-min-download" aria-labelledby="landing-download-title">
      <div className="ls-min-inner">
        <div className="ls-min-download-inner">
          <div className="ls-min-download-copy">
            <p id="landing-download-title" className="ls-min-download-title">
              {t('landing.min.download.title')}
            </p>
            <p className="ls-min-download-meta">{t('landing.min.download.meta')}</p>
          </div>
          <div className="ls-min-download-actions">
            <Link to="/descargar" className="ls-min-btn ls-min-btn--compact">
              {t('landing.min.download.cta')}
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
