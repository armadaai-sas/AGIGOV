import { useRef } from 'react';
import { useInView } from 'motion/react';
import { Boxes, Cloud, Settings2, Rocket, Server } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';

const STEP_ICONS = [Boxes, Cloud, Settings2, Rocket] as const;

/** Construir → Cloud|Local → Configurar → Desplegar (colores AGIGOV). */
export function LandingProcessSection() {
  const copy = useLandingCopy();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.12, once: true });

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

        <ol className="ls-process" aria-label={copy.LANDING_PROCESS_TITLE}>
          {copy.LANDING_PROCESS_STEPS.map((step, i) => {
            const Icon = STEP_ICONS[i]!;
            const last = i === copy.LANDING_PROCESS_STEPS.length - 1;
            return (
              <li key={step.id} className="ls-process-item">
                <div className="ls-process-rail" aria-hidden>
                  <span className="ls-process-node">
                    <Icon className="h-4 w-4" />
                  </span>
                  {!last ? <span className="ls-process-line" /> : null}
                </div>
                <div className="ls-process-body">
                  <p className="ls-process-index">{String(i + 1).padStart(2, '0')}</p>
                  <h3 className="ls-process-title">{step.title}</h3>
                  <p className="ls-process-text">{step.body}</p>
                  {step.id === 'where' ? (
                    <ul className="ls-process-where">
                      <li>
                        <Cloud className="h-3.5 w-3.5" aria-hidden />
                        <span>{copy.LANDING_PROCESS_CLOUD}</span>
                      </li>
                      <li>
                        <Server className="h-3.5 w-3.5" aria-hidden />
                        <span>{copy.LANDING_PROCESS_LOCAL}</span>
                      </li>
                    </ul>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
