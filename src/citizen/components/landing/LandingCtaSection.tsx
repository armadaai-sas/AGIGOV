import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { LANDING_CTA_LEAD, LANDING_CTA_TITLE } from '../../hero/landingCopy.js';

/** CTA final landing — catálogo + EGS ganar-ganar. */
export function LandingCtaSection() {
  return (
    <section
      className="landing-section landing-section--cta"
      aria-labelledby="landing-cta-title"
    >
      <div className="landing-section-inner landing-section-inner--cta">
        <h3 id="landing-cta-title" className="landing-section-cta-title">
          {LANDING_CTA_TITLE}
        </h3>
        <p className="landing-section-lead landing-section-lead--light mt-4 max-w-xl text-center">
          {LANDING_CTA_LEAD}
        </p>
        <div className="landing-section-cta-actions">
          <Link to="/modelos" className="ui-btn-primary ui-btn-lg">
            Explorar modelos
            <ArrowRight className="h-5 w-5" aria-hidden />
          </Link>
          <Link to="/modelos/egs" className="ui-btn-secondary ui-btn-lg">
            Ver Efficiency Gain Share
          </Link>
        </div>
      </div>
    </section>
  );
}
