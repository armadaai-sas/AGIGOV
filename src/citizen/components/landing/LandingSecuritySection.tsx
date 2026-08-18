import { useRef } from 'react';
import { useInView } from 'motion/react';
import { ShieldCheck, Snowflake, KeyRound } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';
import '../../../styles/landing-below.css';

const ICONS = [KeyRound, Snowflake, ShieldCheck] as const;

/** Diapositiva Seguridad — firmas, FREEZE, rastro. */
export function LandingSecuritySection() {
  const copy = useLandingCopy();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.2, once: false });

  return (
    <section
      ref={sectionRef}
      id="seguridad"
      className={`landing-section landing-section--slide landing-section--security scroll-mt-24 ${inView ? 'is-inview' : ''}`}
      aria-labelledby="landing-security-title"
    >
      <div className="landing-slide-inner">
        <p className="hero-brand-kicker">{copy.LANDING_SECURITY_KICKER}</p>
        <h2 id="landing-security-title" className="landing-slide-title">
          {copy.LANDING_SECURITY_TITLE}
        </h2>
        <p className="landing-slide-lead">{copy.LANDING_SECURITY_LEAD}</p>
        <ul className="landing-security-grid">
          {copy.LANDING_SECURITY_ITEMS.map((item, i) => {
            const Icon = ICONS[i]!;
            return (
              <li key={item.id} className="landing-security-card">
                <span className="landing-security-icon">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="landing-security-card-title">{item.title}</h3>
                <p className="landing-security-card-body">{item.body}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
