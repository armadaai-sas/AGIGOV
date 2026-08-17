import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';
import '../../../styles/landing-below.css';

/** CTA final — conversión clara, sin relleno. */
export function LandingCtaSection() {
  const copy = useLandingCopy();

  return (
    <section className="landing-section landing-section--cta" aria-labelledby="landing-cta-title">
      <div className="landing-section-cta-panel">
        <div className="landing-section-inner landing-section-inner--cta">
          <p className="hero-brand-kicker">{copy.LANDING_CTA_ACTION}</p>
          <h3 id="landing-cta-title" className="landing-section-cta-title">
            {copy.LANDING_CTA_TITLE}
          </h3>
          <p className="landing-lead landing-section-lead--light mx-auto mt-3 max-w-md text-center">
            {copy.LANDING_CTA_LEAD}
          </p>
          <div className="landing-section-cta-actions">
            <Link to={copy.HERO_CTA_PRIMARY.path} className="hero-brand-btn hero-brand-btn--primary hero-brand-btn--navy">
              {copy.HERO_CTA_PRIMARY.label}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link to="/modelos" className="hero-brand-btn hero-brand-btn--ghost-navy">
              {copy.LANDING_MODELS_CATALOG}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
