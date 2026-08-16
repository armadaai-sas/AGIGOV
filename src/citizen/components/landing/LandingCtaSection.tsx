import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';
import '../../../styles/landing-below.css';

/** CTA final — misma jerarquía de botones que el hero. */
export function LandingCtaSection() {
  const copy = useLandingCopy();

  return (
    <section className="landing-section landing-section--cta" aria-labelledby="landing-cta-title">
      <div className="landing-section-cta-panel">
        <div className="landing-section-inner landing-section-inner--cta">
          <p className="hero-brand-kicker">{copy.LANDING_CTA_ACTION}</p>
          <h3 id="landing-cta-title" className="landing-display-title landing-section-cta-title">
            {copy.LANDING_CTA_TITLE}
          </h3>
          <p className="landing-lead landing-section-lead--light mt-4 max-w-lg text-center">
            {copy.LANDING_CTA_LEAD}
          </p>
          <p className="landing-cta-micro">{copy.LANDING_CTA_MICRO}</p>
          <div className="landing-section-cta-actions">
            <Link to={copy.HERO_CTA_PRIMARY.path} className="hero-brand-btn hero-brand-btn--primary">
              {copy.HERO_CTA_PRIMARY.label}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link to={copy.HERO_CTA_SECONDARY.path} className="hero-brand-btn hero-brand-btn--outline">
              {copy.HERO_CTA_SECONDARY.label}
            </Link>
            <Link to="/institucional" className="hero-brand-btn hero-brand-btn--ghost">
              {copy.LANDING_CTA_CONTACT}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
