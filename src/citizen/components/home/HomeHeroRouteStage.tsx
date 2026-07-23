import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, CheckCircle2, ChevronDown, Layers, LayoutGrid, TrendingDown } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';
import { usePlatform } from '../../context/PlatformContext.js';

const ICONS = [Layers, LayoutGrid, TrendingDown, CheckCircle2] as const;
const STEP_MS = 3200;

/** Timeline interactiva — auto-avanza y responde al clic. */
export function HomeHeroRouteDemo() {
  const reduceMotion = useReducedMotion();
  const copy = useLandingCopy();
  const { t } = usePlatform();
  const steps = copy.HERO_ROUTE_STEPS;
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => {
      setActive((n) => (n + 1) % steps.length);
    }, STEP_MS);
    return () => clearInterval(id);
  }, [reduceMotion, steps.length]);

  const step = steps[active]!;
  const Icon = ICONS[active] ?? Layers;

  return (
    <div className="hero-route-demo">
      <div className="hero-route-demo-why">
        <p className="hero-route-demo-why-kicker">{copy.HERO_ROUTE_WHY_KICKER}</p>
        <p className="hero-route-demo-why-text">{copy.HERO_ROUTE_WHY}</p>
      </div>

      <div className="hero-route-demo-track-wrap">
        <ol className="hero-route-demo-steps" aria-label="AGIGOV route">
          {steps.map((s, i) => {
            const StepIcon = ICONS[i] ?? Layers;
            const isActive = i === active;
            const isDone = i < active;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  className={`hero-route-demo-step-btn ${isActive ? 'is-active' : ''} ${isDone ? 'is-done' : ''}`}
                  onClick={() => setActive(i)}
                  aria-pressed={isActive}
                >
                  <span className="hero-route-demo-step-icon">
                    <StepIcon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="hero-route-demo-step-label">{s.label}</span>
                </button>
              </li>
            );
          })}
        </ol>
        <p className="hero-route-demo-step-counter" aria-live="polite">
          {t('common.step', { current: active + 1, total: steps.length })}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          className="hero-route-demo-panel"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
        >
          <div className="hero-route-demo-panel-head">
            <div className="hero-route-demo-panel-icon">
              <Icon className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <p className="hero-route-demo-panel-kicker">{step.hint}</p>
              <h3 className="hero-route-demo-panel-title">{step.label}</h3>
            </div>
            <span className="hero-route-demo-panel-stat">{step.stat}</span>
          </div>
          <p className="hero-route-demo-panel-detail">{step.detail}</p>
          <Link to={step.path} className="hero-route-demo-panel-link">
            {t('route.explore')}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/** Pantalla 2 — ruta interactiva + por qué. */
export function HomeHeroRouteStage() {
  const copy = useLandingCopy();

  return (
    <div id="hero-story" className="hero-route-stage scroll-mt-0">
      <div className="hero-route-inner">
        <p className="hero-brand-kicker">{copy.HERO_ROUTE_WHY_KICKER}</p>
        <h2 className="landing-display-title hero-route-title">{copy.HERO_ROUTE_TITLE}</h2>
        <p className="landing-lead hero-route-lead">{copy.HERO_ROUTE_LEAD}</p>

        <HomeHeroRouteDemo />
      </div>

      <a href="#hero-cta" className="hero-trust-scroll-hint" aria-label="Next">
        <ChevronDown className="h-5 w-5" aria-hidden />
      </a>
    </div>
  );
}
