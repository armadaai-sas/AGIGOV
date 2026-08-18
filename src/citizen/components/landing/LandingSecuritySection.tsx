import { useRef } from 'react';
import { useInView } from 'motion/react';
import { ShieldCheck, Snowflake, KeyRound } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';
import '../../../styles/landing-below.css';

const ICONS = [KeyRound, Snowflake, ShieldCheck] as const;

/** Seguridad — cabecera centrada + capas en una columna (sin hueco lateral). */
export function LandingSecuritySection() {
  const copy = useLandingCopy();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.25, once: false });

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

        <ol className="landing-defense-stack" aria-label={copy.LANDING_SECURITY_TITLE}>
          {copy.LANDING_SECURITY_ITEMS.map((item, i) => {
            const Icon = ICONS[i]!;
            return (
              <li
                key={item.id}
                className="landing-defense-layer"
                style={{ ['--step' as string]: i }}
              >
                <span className="landing-defense-rail" aria-hidden>
                  <span className="landing-defense-orb" />
                  {i < copy.LANDING_SECURITY_ITEMS.length - 1 ? (
                    <span className="landing-defense-line" />
                  ) : null}
                </span>
                <div className="landing-defense-body">
                  <span className="landing-defense-icon">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="landing-defense-index">Capa {String(i + 1).padStart(2, '0')}</p>
                    <h3 className="landing-defense-title">{item.title}</h3>
                    <p className="landing-defense-text">{item.body}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
