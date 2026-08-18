import { useRef } from 'react';
import { useInView } from 'motion/react';
import { Landmark, PenLine, Radio, Database } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';
import '../../../styles/landing-below.css';

const ICONS = [PenLine, Landmark, Radio, Database] as const;

/** Diapositiva Servicios — capacidades del OS. */
export function LandingServicesSection() {
  const copy = useLandingCopy();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.2, once: false });

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
        <ul className="landing-services-grid">
          {copy.LANDING_SERVICES_ITEMS.map((item, i) => {
            const Icon = ICONS[i]!;
            return (
              <li key={item.id} className="landing-services-card">
                <span className="landing-services-icon">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="landing-services-card-title">{item.title}</h3>
                <p className="landing-services-card-body">{item.body}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
