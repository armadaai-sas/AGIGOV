import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'motion/react';
import { Building2, Users, ShieldCheck, Orbit } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';

const WHY_ICONS = [Building2, Users, ShieldCheck, Orbit] as const;

/** Ciudadano + Estado — para qué sirve el OS. */
export function LandingWhySection() {
  const copy = useLandingCopy();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.12, once: true });

  return (
    <section
      ref={sectionRef}
      id="alcance"
      className={`ls-section ls-section--alt ls-section--focus ls-section--tone ls-section--tone-sky ${inView ? 'is-inview' : ''}`}
      aria-labelledby="landing-why-title"
    >
      <div className="ls-inner">
        <header className="ls-head">
          <p className="ls-kicker">{copy.LANDING_WHY_KICKER}</p>
          <h2 id="landing-why-title" className="ls-title">
            {copy.LANDING_WHY_TITLE}
          </h2>
          <p className="ls-lead">{copy.LANDING_WHY_LEAD}</p>
        </header>

        <ul className="ls-grid ls-grid--4" aria-label={copy.LANDING_WHY_TITLE}>
          {copy.LANDING_WHY_ITEMS.map((item, i) => {
            const Icon = WHY_ICONS[i]!;
            return (
              <li key={item.id} className="ls-card">
                <div className="ls-card-head">
                  <span className="ls-card-icon">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                </div>
                <h3 className="ls-card-title">{item.title}</h3>
                <p className="ls-card-desc">{item.body}</p>
              </li>
            );
          })}
        </ul>

        <p className="ls-flow-foot">{copy.LANDING_WHY_FOOT}</p>
        <div className="ls-actions" style={{ marginTop: '1.25rem' }}>
          <Link to="/gestion" className="ls-btn ls-btn--ghost">
            Ver gestión pública
          </Link>
          <Link to="/participar" className="ls-btn ls-btn--ghost">
            Participar
          </Link>
        </div>
      </div>
    </section>
  );
}
