import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'motion/react';
import { ArrowRight, Boxes, Cloud, Settings2, Server } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';

const STEP_ICONS = [Boxes, Cloud, Settings2] as const;

/** Construir — pasos aislados (sin CSS compartido de timeline). */
export function LandingProcessSection() {
  const copy = useLandingCopy();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.12, once: true });
  const [where, setWhere] = useState<'cloud' | 'local'>('cloud');
  const [active, setActive] = useState(0);
  const steps = copy.LANDING_PROCESS_STEPS;
  const current = steps[active]!;
  const CurrentIcon = STEP_ICONS[active]!;

  return (
    <section
      ref={sectionRef}
      id="construir"
      className={`ls-section ls-section--alt ls-section--focus ${inView ? 'is-inview' : ''}`}
      aria-labelledby="landing-process-title"
    >
      <div className="ls-inner">
        <header className="ls-head">
          <p className="ls-kicker">{copy.LANDING_PROCESS_KICKER}</p>
          <h2 id="landing-process-title" className="ls-title">
            {copy.LANDING_PROCESS_TITLE}
          </h2>
          <p className="ls-lead">{copy.LANDING_PROCESS_LEAD}</p>
        </header>

        <div className="ls-build">
          <div className="ls-build-main">
            <div className="ls-build-steps" role="tablist" aria-label={copy.LANDING_PROCESS_TITLE}>
              {steps.map((step, i) => {
                const Icon = STEP_ICONS[i]!;
                const selected = i === active;
                return (
                  <button
                    key={step.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    className={`ls-build-step${selected ? ' is-active' : ''}`}
                    onClick={() => setActive(i)}
                  >
                    <span className="ls-build-step-icon" aria-hidden>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="ls-build-step-meta">
                      <span className="ls-build-step-index">{String(i + 1).padStart(2, '0')}</span>
                      <span className="ls-build-step-label">{step.title}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="ls-build-stage" role="tabpanel">
              <span className="ls-build-stage-icon" aria-hidden>
                <CurrentIcon className="h-6 w-6" />
              </span>
              <p className="ls-build-stage-index">
                {String(active + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
              </p>
              <h3 className="ls-build-stage-title">{current.title}</h3>
              <p className="ls-build-stage-text">{current.body}</p>
            </div>
          </div>

          <div className="ls-build-panel">
            <p className="ls-build-panel-label">{copy.LANDING_PROCESS_WHERE_LABEL}</p>
            <div className="ls-build-toggle" role="group" aria-label={copy.LANDING_PROCESS_WHERE_LABEL}>
              <button
                type="button"
                className={`ls-build-toggle-btn${where === 'cloud' ? ' is-active' : ''}`}
                onClick={() => {
                  setWhere('cloud');
                  setActive(1);
                }}
              >
                <Cloud className="h-4 w-4" aria-hidden />
                {copy.LANDING_PROCESS_CLOUD_SHORT}
              </button>
              <button
                type="button"
                className={`ls-build-toggle-btn${where === 'local' ? ' is-active' : ''}`}
                onClick={() => {
                  setWhere('local');
                  setActive(1);
                }}
              >
                <Server className="h-4 w-4" aria-hidden />
                {copy.LANDING_PROCESS_LOCAL_SHORT}
              </button>
            </div>
            <p className="ls-build-panel-hint">
              {where === 'cloud' ? copy.LANDING_PROCESS_CLOUD : copy.LANDING_PROCESS_LOCAL}
            </p>

            <Link to={copy.HERO_CTA_PRIMARY.path} className="ls-btn ls-btn--primary ls-btn--impact">
              {copy.LANDING_PROCESS_CTA}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <p className="ls-build-micro">{copy.LANDING_PROCESS_CTA_MICRO}</p>
            <div className="ls-build-links">
              <Link to="/modelos" className="ls-build-link">
                {copy.LANDING_MODELS_CATALOG}
              </Link>
              <a href="#desplegar" className="ls-build-link">
                {copy.LANDING_PROCESS_NEXT_DEPLOY}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
