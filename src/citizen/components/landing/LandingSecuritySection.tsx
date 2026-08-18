import { useRef } from 'react';
import { useInView } from 'motion/react';
import { ShieldCheck, Snowflake, KeyRound } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';

const ICONS = [KeyRound, Snowflake, ShieldCheck] as const;

/** Seguridad — stack centrado, una columna. */
export function LandingSecuritySection() {
  const copy = useLandingCopy();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.15, once: true });

  return (
    <section
      ref={sectionRef}
      id="seguridad"
      className={`ls-section ${inView ? 'is-inview' : ''}`}
      aria-labelledby="landing-security-title"
    >
      <div className="ls-inner">
        <header className="ls-head">
          <p className="ls-kicker">{copy.LANDING_SECURITY_KICKER}</p>
          <h2 id="landing-security-title" className="ls-title">
            {copy.LANDING_SECURITY_TITLE}
          </h2>
          <p className="ls-lead">{copy.LANDING_SECURITY_LEAD}</p>
        </header>

        <ol className="ls-stack" aria-label={copy.LANDING_SECURITY_TITLE}>
          {copy.LANDING_SECURITY_ITEMS.map((item, i) => {
            const Icon = ICONS[i]!;
            const last = i === copy.LANDING_SECURITY_ITEMS.length - 1;
            return (
              <li key={item.id} className="ls-stack-item">
                <span className="ls-stack-rail" aria-hidden>
                  <span className="ls-stack-orb" />
                  {!last ? <span className="ls-stack-line" /> : null}
                </span>
                <div className="ls-stack-body">
                  <span className="ls-stack-icon">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="ls-stack-index">Capa {String(i + 1).padStart(2, '0')}</p>
                    <h3 className="ls-stack-title">{item.title}</h3>
                    <p className="ls-stack-text">{item.body}</p>
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
