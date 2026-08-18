import { useRef } from 'react';
import { useInView } from 'motion/react';
import { Landmark, Shield, ShoppingCart, ArrowRight } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';

const ICONS = [Landmark, Shield, ShoppingCart] as const;

/** Aplicación — roles 1→2→3. */
export function LandingApplicationSection() {
  const copy = useLandingCopy();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.15, once: true });

  return (
    <section
      ref={sectionRef}
      id="aplicacion"
      className={`ls-section ls-section--alt ${inView ? 'is-inview' : ''}`}
      aria-labelledby="landing-application-title"
    >
      <div className="ls-inner">
        <header className="ls-head">
          <p className="ls-kicker">{copy.LANDING_APPLICATION_KICKER}</p>
          <h2 id="landing-application-title" className="ls-title">
            {copy.LANDING_APPLICATION_TITLE}
          </h2>
          <p className="ls-lead">{copy.LANDING_APPLICATION_LEAD}</p>
        </header>

        <ul className="ls-grid ls-grid--3" aria-label={copy.LANDING_APPLICATION_TITLE}>
          {copy.LANDING_APPLICATION_ITEMS.map((item, i) => {
            const Icon = ICONS[i]!;
            return (
              <li key={item.id} className="ls-role">
                <div className="ls-role-top">
                  <span className="ls-role-icon">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="ls-role-index">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="ls-role-title">{item.title}</h3>
                <p className="ls-role-body">{item.body}</p>
                <p className="ls-role-outcome">
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
