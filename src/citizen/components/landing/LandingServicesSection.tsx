import { useRef } from 'react';
import { useInView } from 'motion/react';
import { Landmark, PenLine, Radio, Database } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';
import '../../../styles/landing-below.css';

const ICONS = [PenLine, Landmark, Radio, Database] as const;

/** Servicios — flujo horizontal: firmar → custodiar → vigilar → publicar. */
export function LandingServicesSection() {
  const copy = useLandingCopy();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.25, once: false });

  return (
    <section
      ref={sectionRef}
      id="servicios"
      className={`landing-section landing-section--slide landing-section--services scroll-mt-24 ${inView ? 'is-inview' : ''}`}
      aria-labelledby="landing-services-title"
    >
      <div className="landing-slide-inner">
        <p className="hero-brand-kicker">{copy.LANDING_SERVICES_KICKER}</p>
        <h2 id="landing-services-title" className="landing-slide-title">
          {copy.LANDING_SERVICES_TITLE}
        </h2>
        <p className="landing-slide-lead">{copy.LANDING_SERVICES_LEAD}</p>

        <ol className="landing-flow-rail" aria-label={copy.LANDING_SERVICES_TITLE}>
          {copy.LANDING_SERVICES_ITEMS.map((item, i) => {
            const Icon = ICONS[i]!;
            const last = i === copy.LANDING_SERVICES_ITEMS.length - 1;
            return (
              <li
                key={item.id}
                className="landing-flow-step"
                style={{ ['--step' as string]: i }}
              >
                <div className="landing-flow-step-head">
                  <span className="landing-flow-index">{String(i + 1).padStart(2, '0')}</span>
                  {!last ? <span className="landing-flow-connector" aria-hidden /> : null}
                </div>
                <span className="landing-flow-icon">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="landing-flow-title">{item.title}</h3>
                <p className="landing-flow-body">{item.body}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
