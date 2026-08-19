import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { ArrowRight, Landmark, PenLine, Radio, Database } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';

const FLOW_ICONS = [PenLine, Landmark, Radio, Database] as const;

/** Operación — flujo dinámico único (un paso activo a la vez). */
export function LandingHowSection() {
  const copy = useLandingCopy();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.2, once: false });
  const reduceMotion = useReducedMotion();
  const steps = copy.LANDING_SERVICES_ITEMS;
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!inView || reduceMotion || steps.length < 2) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % steps.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [inView, reduceMotion, steps.length]);

  const current = steps[active]!;
  const CurrentIcon = FLOW_ICONS[active]!;

  return (
    <section
      ref={sectionRef}
      id="operacion"
      className={`ls-section ls-section--alt ls-section--focus ls-section--operacion ${inView ? 'is-inview' : ''}`}
      aria-labelledby="landing-how-title"
    >
      <div className="ls-inner">
        <header className="ls-head">
          <p className="ls-kicker">{copy.LANDING_HOW_KICKER}</p>
          <h2 id="landing-how-title" className="ls-title">
            {copy.LANDING_HOW_TITLE}
          </h2>
          <p className="ls-lead">{copy.LANDING_HOW_LEAD}</p>
        </header>

        <div className="ls-dynflow" aria-label={copy.LANDING_HOW_TITLE}>
          <div className="ls-dynflow-track" role="tablist" aria-label={copy.LANDING_HOW_KICKER}>
            {steps.map((item, i) => {
              const Icon = FLOW_ICONS[i]!;
              const selected = i === active;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  className={`ls-dynflow-tab${selected ? ' is-active' : ''}`}
                  onClick={() => setActive(i)}
                >
                  <span className="ls-dynflow-tab-icon" aria-hidden>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="ls-dynflow-tab-index">{String(i + 1).padStart(2, '0')}</span>
                  <span className="ls-dynflow-tab-label">{item.title}</span>
                </button>
              );
            })}
          </div>

          <div className="ls-dynflow-stage" role="tabpanel">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                className="ls-dynflow-card"
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="ls-dynflow-card-icon" aria-hidden>
                  <CurrentIcon className="h-6 w-6" />
                </span>
                <p className="ls-dynflow-card-index">
                  {String(active + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
                </p>
                <h3 className="ls-dynflow-card-title">{current.title}</h3>
                <p className="ls-dynflow-card-text">{current.body}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="ls-actions">
          <a href="#construir" className="ls-btn ls-btn--primary">
            {copy.LANDING_PROCESS_CTA}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
          <a href="#desplegar" className="ls-btn ls-btn--ghost">
            {copy.LANDING_DEPLOY_CTA}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
