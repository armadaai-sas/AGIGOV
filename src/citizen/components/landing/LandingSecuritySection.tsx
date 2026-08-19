import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'motion/react';
import { ArrowRight, Atom, KeyRound, Radio, ShieldCheck } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';

const ICONS = [KeyRound, Radio, ShieldCheck, Atom] as const;

/** Seguridad — capas en grid (distinto del flujo dinámico de Operación). */
export function LandingSecuritySection() {
  const copy = useLandingCopy();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.15, once: true });

  return (
    <section
      ref={sectionRef}
      id="seguridad"
      className={`ls-section ls-section--security ${inView ? 'is-inview' : ''}`}
      aria-labelledby="landing-security-title"
    >
      <div className="ls-inner">
        <header className="ls-head">
          <p className="ls-kicker ls-kicker--security">{copy.LANDING_SECURITY_KICKER}</p>
          <h2 id="landing-security-title" className="ls-title">
            {copy.LANDING_SECURITY_TITLE}
          </h2>
          <p className="ls-lead">{copy.LANDING_SECURITY_LEAD}</p>
        </header>

        <ul className="ls-sec-grid" aria-label={copy.LANDING_SECURITY_TITLE}>
          {copy.LANDING_SECURITY_ITEMS.map((item, i) => {
            const Icon = ICONS[i]!;
            return (
              <li key={item.id} className="ls-sec-card">
                <span className="ls-sec-card-icon" aria-hidden>
                  <Icon className="h-5 w-5" />
                </span>
                <p className="ls-sec-card-index">Capa {String(i + 1).padStart(2, '0')}</p>
                <h3 className="ls-sec-card-title">{item.title}</h3>
                <p className="ls-sec-card-text">{item.body}</p>
              </li>
            );
          })}
        </ul>

        <div className="ls-actions ls-actions--security">
          <Link to="/institucional" className="ls-btn ls-btn--ghost">
            {copy.LANDING_SECURITY_CTA}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <a href="#construir" className="ls-btn ls-btn--primary">
            {copy.LANDING_PROCESS_CTA}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
