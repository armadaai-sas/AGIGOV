import { useRef } from 'react';
import { useInView } from 'motion/react';
import { Landmark, Shield, ShoppingCart, ArrowRight } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';
import '../../../styles/landing-below.css';

const ICONS = [Landmark, Shield, ShoppingCart] as const;

/** Aplicación — tres roles institucionales con resultado claro. */
export function LandingApplicationSection() {
  const copy = useLandingCopy();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.25, once: false });

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

        <ul className="landing-roles-grid" aria-label={copy.LANDING_APPLICATION_TITLE}>
          {copy.LANDING_APPLICATION_ITEMS.map((item, i) => {
            const Icon = ICONS[i]!;
            return (
              <li
                key={item.id}
                className="landing-role-panel"
                style={{ ['--step' as string]: i }}
              >
                <div className="landing-role-top">
                  <span className="landing-role-icon">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="landing-role-index">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="landing-role-title">{item.title}</h3>
                <p className="landing-role-body">{item.body}</p>
                <p className="landing-role-outcome">
                  <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span>{item.outcome}</span>
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
