import { useRef } from 'react';
import { useInView } from 'motion/react';
import { Bot, ShieldCheck, ArrowRight } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';

/** Copilotos vs OS — contraste visual con “gate” en el centro. */
export function LandingAuthoritySection() {
  const copy = useLandingCopy();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.12, once: true });

  return (
    <section
      ref={sectionRef}
      id="autoridad"
      className={`ls-section ls-section--focus ls-section--tone ls-section--tone-cyan ${inView ? 'is-inview' : ''}`}
      aria-labelledby="landing-authority-title"
    >
      <div className="ls-inner">
        <header className="ls-head">
          <p className="ls-kicker">{copy.LANDING_AUTHORITY_KICKER}</p>
          <h2 id="landing-authority-title" className="ls-title">
            {copy.LANDING_AUTHORITY_TITLE}
          </h2>
          <p className="ls-lead">{copy.LANDING_AUTHORITY_LEAD}</p>
        </header>

        <div className="ls-authority-stage" role="list">
          <article className="ls-authority-col" role="listitem">
            <div className="ls-card-head">
              <span className="ls-card-icon">
                <Bot className="h-5 w-5" aria-hidden />
              </span>
            </div>
            <h3 className="ls-card-title">{copy.LANDING_AUTHORITY_COPILOT_TITLE}</h3>
            <p className="ls-card-desc">{copy.LANDING_AUTHORITY_COPILOT_BODY}</p>
          </article>

          <div className="ls-authority-gate" aria-hidden>
            <span className="ls-authority-gate-label">Centinela</span>
            <ArrowRight className="ls-authority-gate-arrow h-4 w-4" />
            <span className="ls-authority-gate-chip">FREEZE / PERMITIR</span>
          </div>

          <article className="ls-authority-col ls-authority-col--os" role="listitem">
            <div className="ls-card-head">
              <span className="ls-card-icon">
                <ShieldCheck className="h-5 w-5" aria-hidden />
              </span>
            </div>
            <h3 className="ls-card-title">{copy.LANDING_AUTHORITY_OS_TITLE}</h3>
            <p className="ls-card-desc">{copy.LANDING_AUTHORITY_OS_BODY}</p>
          </article>
        </div>

        <p className="ls-flow-foot">{copy.LANDING_AUTHORITY_FOOT}</p>
      </div>
    </section>
  );
}
