import { useRef } from 'react';
import { useInView } from 'motion/react';
import { Landmark, Shield, ShoppingCart } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';
import '../../../styles/landing-below.css';

const ICONS = [Landmark, Shield, ShoppingCart] as const;

/** Diapositiva Aplicación — para qué sirve en la institución. */
export function LandingApplicationSection() {
  const copy = useLandingCopy();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.2, once: false });

  return (
    <section
      ref={sectionRef}
      id="aplicacion"
      className={`landing-section landing-section--slide landing-section--application scroll-mt-24 ${inView ? 'is-inview' : ''}`}
      aria-labelledby="landing-application-title"
    >
      <div className="landing-slide-inner">
        <p className="hero-brand-kicker">{copy.LANDING_APPLICATION_KICKER}</p>
        <h2 id="landing-application-title" className="landing-slide-title">
          {copy.LANDING_APPLICATION_TITLE}
        </h2>
        <p className="landing-slide-lead">{copy.LANDING_APPLICATION_LEAD}</p>
        <ul className="landing-application-grid">
          {copy.LANDING_APPLICATION_ITEMS.map((item, i) => {
            const Icon = ICONS[i]!;
            return (
              <li key={item.id} className="landing-application-card">
                <span className="landing-application-icon">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="landing-application-card-title">{item.title}</h3>
                <p className="landing-application-card-body">{item.body}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
