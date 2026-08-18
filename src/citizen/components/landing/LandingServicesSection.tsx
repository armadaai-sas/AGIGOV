import { useRef } from 'react';
import { useInView } from 'motion/react';
import { Landmark, PenLine, Radio, Database } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';

const ICONS = [PenLine, Landmark, Radio, Database] as const;

/** Servicios — flujo 1→2→4 cols. */
export function LandingServicesSection() {
  const copy = useLandingCopy();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.15, once: true });

  return (
    <section
      ref={sectionRef}
      id="servicios"
      className={`ls-section ls-section--alt ${inView ? 'is-inview' : ''}`}
      aria-labelledby="landing-services-title"
    >
      <div className="ls-inner">
        <header className="ls-head">
          <p className="ls-kicker">{copy.LANDING_SERVICES_KICKER}</p>
          <h2 id="landing-services-title" className="ls-title">
            {copy.LANDING_SERVICES_TITLE}
          </h2>
          <p className="ls-lead">{copy.LANDING_SERVICES_LEAD}</p>
        </header>

        <ol className="ls-grid ls-grid--4" aria-label={copy.LANDING_SERVICES_TITLE}>
          {copy.LANDING_SERVICES_ITEMS.map((item, i) => {
            const Icon = ICONS[i]!;
            return (
              <li key={item.id}>
                <p className="ls-step-index">{String(i + 1).padStart(2, '0')}</p>
                <span className="ls-step-icon">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="ls-step-title">{item.title}</h3>
                <p className="ls-step-body">{item.body}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
