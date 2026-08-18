import { useRef } from 'react';
import { useInView } from 'motion/react';
import { Landmark, PenLine, Radio, Database } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';

const FLOW_ICONS = [PenLine, Landmark, Radio, Database] as const;

/**
 * Operación — un solo flujo (4 pasos).
 * Capas y roles van como pie quieto, no como bloques competidores.
 */
export function LandingHowSection() {
  const copy = useLandingCopy();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.12, once: true });

  return (
    <section
      ref={sectionRef}
      id="operacion"
      className={`ls-section ls-section--alt ls-section--focus ${inView ? 'is-inview' : ''}`}
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

        <ol className="ls-flow" aria-label={copy.LANDING_HOW_TITLE}>
          {copy.LANDING_SERVICES_ITEMS.map((item, i) => {
            const Icon = FLOW_ICONS[i]!;
            const last = i === copy.LANDING_SERVICES_ITEMS.length - 1;
            return (
              <li key={item.id} className="ls-flow-item">
                <div className="ls-flow-rail" aria-hidden>
                  <span className="ls-flow-node">
                    <Icon className="h-4 w-4" />
                  </span>
                  {!last ? <span className="ls-flow-line" /> : null}
                </div>
                <div className="ls-flow-body">
                  <p className="ls-flow-index">{String(i + 1).padStart(2, '0')}</p>
                  <h3 className="ls-flow-title">{item.title}</h3>
                  <p className="ls-flow-text">{item.body}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <p className="ls-flow-foot">
          <span>{copy.LANDING_HOW_GUARD}</span>
          <span className="ls-flow-foot-sep" aria-hidden>
            ·
          </span>
          <span>{copy.LANDING_HOW_ROLES}</span>
        </p>
      </div>
    </section>
  );
}
