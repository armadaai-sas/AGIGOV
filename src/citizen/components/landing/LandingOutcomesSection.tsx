import { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { ArrowRight, Building2, Landmark, Users } from 'lucide-react';

import { useSovereignConfig } from '../../context/PlatformContext.js';

type AudienceId = 'government' | 'business' | 'citizen';

type OutcomeFrame = {
  eyebrow: string;
  title: string;
  metric: string;
  metricLabel: string;
  lines: string[];
  badge: string;
};

const AUDIENCE_META: Record<AudienceId, { icon: typeof Landmark; href: string }> = {
  government: {
    icon: Landmark,
    href: '/modelos?audiencia=gubernamental',
  },
  business: {
    icon: Building2,
    href: '/modelos?audiencia=empresarial',
  },
  citizen: {
    icon: Users,
    href: '/modelos?audiencia=ciudadano',
  },
};

function audienceFromQuery(raw: string | null): AudienceId | null {
  if (!raw) return null;
  const v = raw.toLowerCase();
  if (v === 'government' || v === 'gubernamental' || v === 'gov') return 'government';
  if (v === 'business' || v === 'empresarial' || v === 'biz' || v === 'negocios') return 'business';
  if (v === 'citizen' || v === 'ciudadano' || v === 'ciudadanos') return 'citizen';
  return null;
}

export function useOutcomeFrames(audience: AudienceId): OutcomeFrame[] {
  const { t } = useSovereignConfig();
  if (audience === 'government') {
    return [
      {
        eyebrow: t('landing.outcomes.gov.f1.eyebrow'),
        title: t('landing.outcomes.gov.f1.title'),
        metric: t('landing.outcomes.gov.f1.metric'),
        metricLabel: t('landing.outcomes.gov.f1.metricLabel'),
        lines: [t('landing.outcomes.gov.f1.l1'), t('landing.outcomes.gov.f1.l2'), t('landing.outcomes.gov.f1.l3')],
        badge: t('landing.outcomes.gov.f1.badge'),
      },
      {
        eyebrow: t('landing.outcomes.gov.f2.eyebrow'),
        title: t('landing.outcomes.gov.f2.title'),
        metric: t('landing.outcomes.gov.f2.metric'),
        metricLabel: t('landing.outcomes.gov.f2.metricLabel'),
        lines: [t('landing.outcomes.gov.f2.l1'), t('landing.outcomes.gov.f2.l2'), t('landing.outcomes.gov.f2.l3')],
        badge: t('landing.outcomes.gov.f2.badge'),
      },
    ];
  }
  if (audience === 'business') {
    return [
      {
        eyebrow: t('landing.outcomes.biz.f1.eyebrow'),
        title: t('landing.outcomes.biz.f1.title'),
        metric: t('landing.outcomes.biz.f1.metric'),
        metricLabel: t('landing.outcomes.biz.f1.metricLabel'),
        lines: [t('landing.outcomes.biz.f1.l1'), t('landing.outcomes.biz.f1.l2'), t('landing.outcomes.biz.f1.l3')],
        badge: t('landing.outcomes.biz.f1.badge'),
      },
      {
        eyebrow: t('landing.outcomes.biz.f2.eyebrow'),
        title: t('landing.outcomes.biz.f2.title'),
        metric: t('landing.outcomes.biz.f2.metric'),
        metricLabel: t('landing.outcomes.biz.f2.metricLabel'),
        lines: [t('landing.outcomes.biz.f2.l1'), t('landing.outcomes.biz.f2.l2'), t('landing.outcomes.biz.f2.l3')],
        badge: t('landing.outcomes.biz.f2.badge'),
      },
    ];
  }
  return [
    {
      eyebrow: t('landing.outcomes.citizen.f1.eyebrow'),
      title: t('landing.outcomes.citizen.f1.title'),
      metric: t('landing.outcomes.citizen.f1.metric'),
      metricLabel: t('landing.outcomes.citizen.f1.metricLabel'),
      lines: [t('landing.outcomes.citizen.f1.l1'), t('landing.outcomes.citizen.f1.l2'), t('landing.outcomes.citizen.f1.l3')],
      badge: t('landing.outcomes.citizen.f1.badge'),
    },
    {
      eyebrow: t('landing.outcomes.citizen.f2.eyebrow'),
      title: t('landing.outcomes.citizen.f2.title'),
      metric: t('landing.outcomes.citizen.f2.metric'),
      metricLabel: t('landing.outcomes.citizen.f2.metricLabel'),
      lines: [t('landing.outcomes.citizen.f2.l1'), t('landing.outcomes.citizen.f2.l2'), t('landing.outcomes.citizen.f2.l3')],
      badge: t('landing.outcomes.citizen.f2.badge'),
    },
  ];
}

/** Pantalla dinámica de resultado (hero + sección resultados). */
export function OutcomeScreen({
  audience,
  compact = false,
}: {
  audience: AudienceId;
  compact?: boolean;
}) {
  const { t } = useSovereignConfig();
  const reduceMotion = useReducedMotion();
  const frames = useOutcomeFrames(audience);
  const [i, setI] = useState(0);

  useEffect(() => {
    setI(0);
  }, [audience]);

  useEffect(() => {
    const ms = reduceMotion ? 5000 : compact ? 2800 : 3200;
    const id = window.setInterval(() => setI((n) => (n + 1) % frames.length), ms);
    return () => window.clearInterval(id);
  }, [frames.length, reduceMotion, compact]);

  const frame = frames[i]!;

  return (
    <div
      className={`ls-outcome-screen ls-outcome-screen--${audience}${compact ? ' ls-outcome-screen--compact' : ''}`}
      aria-live="polite"
    >
      <div className="ls-outcome-chrome">
        <span className="ls-outcome-dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="ls-outcome-chrome-path">{frame.eyebrow}</span>
        <span className="ls-outcome-chrome-live">{frame.badge}</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${audience}-${i}`}
          className="ls-outcome-frame"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
          transition={{ duration: 0.28 }}
        >
          <p className="ls-outcome-frame-title">{frame.title}</p>
          <div className="ls-outcome-metric">
            <span className="ls-outcome-metric-value">{frame.metric}</span>
            <span className="ls-outcome-metric-label">{frame.metricLabel}</span>
          </div>
          {!compact ? (
            <ul className="ls-outcome-lines">
              {frame.lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          ) : (
            <p className="ls-outcome-compact-line">{frame.lines[0]}</p>
          )}
          <div className="ls-outcome-scan" aria-hidden />
        </motion.div>
      </AnimatePresence>
      <div className="ls-outcome-foot">
        <div className="ls-outcome-frame-pills" role="tablist" aria-label={t('landing.outcomes.framesAria')}>
          {frames.map((_, idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={idx === i}
              className={`ls-outcome-frame-pill${idx === i ? ' is-active' : ''}`}
              onClick={() => setI(idx)}
            />
          ))}
        </div>
        <p className="ls-outcome-trail">{t('landing.outcomes.trail')}</p>
      </div>
    </div>
  );
}

/** Resultados finales del OS — “con esto obtienes esto” por audiencia. */
export function LandingOutcomesSection() {
  const { t } = useSovereignConfig();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.12, once: true });
  const [searchParams] = useSearchParams();
  const fromUrl = audienceFromQuery(searchParams.get('resultado') ?? searchParams.get('audiencia'));
  const [active, setActive] = useState<AudienceId>(fromUrl ?? 'business');

  useEffect(() => {
    if (fromUrl) setActive(fromUrl);
  }, [fromUrl]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.hash !== '#utilidad' && window.location.hash !== '#resultados') return;
    window.requestAnimationFrame(() => {
      document.getElementById('utilidad')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [fromUrl]);

  const audiences: AudienceId[] = ['government', 'business', 'citizen'];

  return (
    <section
      ref={sectionRef}
      id="utilidad"
      className={`ls-section ls-section--focus ls-section--tone ${inView ? 'is-inview' : ''}`}
      aria-labelledby="landing-outcomes-title"
    >
      <div className="ls-inner">
        <header className="ls-head">
          <p className="ls-kicker">{t('landing.outcomes.kicker')}</p>
          <h2 id="landing-outcomes-title" className="ls-title">
            {t('landing.outcomes.title')}
          </h2>
          <p className="ls-lead">{t('landing.outcomes.lead')}</p>
        </header>

        <div className="ls-outcome-tabs" role="tablist" aria-label={t('landing.outcomes.tabsAria')}>
          {audiences.map((id) => {
            const meta = AUDIENCE_META[id];
            const Icon = meta.icon;
            const selected = active === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={selected}
                className={`ls-outcome-tab ${selected ? 'is-active' : ''}`}
                onClick={() => setActive(id)}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {id === 'government'
                  ? t('landing.outcomes.gov.title')
                  : id === 'business'
                    ? t('landing.outcomes.biz.title')
                    : t('landing.outcomes.citizen.title')}
              </button>
            );
          })}
        </div>

        <div className="ls-outcome-layout">
          <div className="ls-outcome-copy">
            <p className="ls-outcome-recipe">{t('landing.outcomes.recipe')}</p>
            <p className="ls-outcome-blurb">
              {active === 'government'
                ? t('landing.outcomes.gov.blurb')
                : active === 'business'
                  ? t('landing.outcomes.biz.blurb')
                  : t('landing.outcomes.citizen.blurb')}
            </p>
            <ul className="ls-outcome-bullets">
              {active === 'government' ? (
                <>
                  <li>{t('landing.outcomes.gov.b1')}</li>
                  <li>{t('landing.outcomes.gov.b2')}</li>
                  <li>{t('landing.outcomes.gov.b3')}</li>
                </>
              ) : active === 'business' ? (
                <>
                  <li>{t('landing.outcomes.biz.b1')}</li>
                  <li>{t('landing.outcomes.biz.b2')}</li>
                  <li>{t('landing.outcomes.biz.b3')}</li>
                </>
              ) : (
                <>
                  <li>{t('landing.outcomes.citizen.b1')}</li>
                  <li>{t('landing.outcomes.citizen.b2')}</li>
                  <li>{t('landing.outcomes.citizen.b3')}</li>
                </>
              )}
            </ul>
            <Link to={AUDIENCE_META[active].href} className="ls-btn ls-btn--primary">
              {t('landing.outcomes.cta')}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <OutcomeScreen audience={active} />
        </div>
      </div>
    </section>
  );
}
