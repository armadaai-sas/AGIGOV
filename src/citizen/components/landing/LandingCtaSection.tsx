import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';

/** Sandbox — CTAs de conversión (fuera del hero). */
export function LandingCtaSection() {
  const copy = useLandingCopy();

  return (
    <section id="sandbox" className="ls-section ls-section--alt" aria-labelledby="landing-cta-title">
      <div className="ls-inner">
        <div className="ls-cta">
          <header className="ls-head">
            <p className="ls-kicker">{copy.LANDING_CTA_ACTION}</p>
            <h2 id="landing-cta-title" className="ls-title">
              {copy.LANDING_CTA_TITLE}
            </h2>
            <p className="ls-lead">{copy.LANDING_CTA_LEAD}</p>
            <div className="ls-actions">
              <Link to={copy.HERO_CTA_PRIMARY.path} className="ls-btn ls-btn--primary">
                {copy.HERO_CTA_PRIMARY.label}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <a href="#consola" className="ls-btn ls-btn--ghost">
                {copy.LANDING_CTA_SEE_CONSOLE}
              </a>
              <Link to="/modelos" className="ls-btn ls-btn--ghost">
                {copy.LANDING_MODELS_CATALOG}
              </Link>
            </div>
          </header>
        </div>
      </div>
    </section>
  );
}
