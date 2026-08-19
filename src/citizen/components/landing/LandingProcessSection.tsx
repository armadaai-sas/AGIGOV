import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'motion/react';
import { ArrowRight, Boxes, Cloud, Settings2, Server } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';

const STEP_ICONS = [Boxes, Cloud, Settings2] as const;

/** Construir — elige modelo + Cloud|Local + configurar. CTA: Construir. */
export function LandingProcessSection() {
  const copy = useLandingCopy();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.12, once: true });
  const [where, setWhere] = useState<'cloud' | 'local'>('cloud');
  const [active, setActive] = useState(0);

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
          <ol className="ls-process" aria-label={copy.LANDING_PROCESS_TITLE}>
            {copy.LANDING_PROCESS_STEPS.map((step, i) => {
              const Icon = STEP_ICONS[i]!;
              const last = i === copy.LANDING_PROCESS_STEPS.length - 1;
              const selected = i === active;
              return (
                <li key={step.id}>
                  <button
                    type="button"
                    className={`ls-process-item--btn${selected ? ' is-active' : ''}`}
                    onClick={() => setActive(i)}
                    aria-pressed={selected}
                    aria-label={`${step.title}. ${step.body}`}
                  >
                    <span className="ls-process-rail" aria-hidden>
                      <span className="ls-process-node">
                        <Icon className="h-4 w-4" />
                      </span>
                      {!last ? <span className="ls-process-line" /> : null}
                    </span>
                    <span className="ls-process-body">
                      <span className="ls-process-index">{String(i + 1).padStart(2, '0')}</span>
                      <span className="ls-process-title">{step.title}</span>
                      <span className="ls-process-text">{step.body}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

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
