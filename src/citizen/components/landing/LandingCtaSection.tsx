import { Link } from 'react-router-dom';
import { LayoutDashboard, Boxes } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';
import { LandingDeployCta } from './LandingDeployCta.js';

/** Sandbox — CTAs de conversión (fuera del hero). */
export function LandingCtaSection() {
  const copy = useLandingCopy();

  return (
    <section id="sandbox" className="ls-section ls-section--alt ls-section--focus ls-section--tone ls-section--tone-cyan" aria-labelledby="landing-cta-title">
      <div className="ls-inner">
        <div className="ls-cta">
          <header className="ls-head">
            <p className="ls-kicker">{copy.LANDING_CTA_ACTION}</p>
            <h2 id="landing-cta-title" className="ls-title">
              {copy.LANDING_CTA_TITLE}
            </h2>
            <p className="ls-lead">{copy.LANDING_CTA_LEAD}</p>
            <div className="ls-actions">
              <LandingDeployCta to={copy.HERO_CTA_PRIMARY.path} impact />
              <a href="#consola" className="ls-btn ls-btn--ghost">
                <LayoutDashboard className="h-4 w-4" aria-hidden />
                <span>{copy.LANDING_CTA_SEE_CONSOLE}</span>
              </a>
              <Link to="/modelos" className="ls-btn ls-btn--ghost">
                <Boxes className="h-4 w-4" aria-hidden />
                <span>{copy.LANDING_MODELS_CATALOG}</span>
              </Link>
            </div>
          </header>
        </div>
      </div>
    </section>
  );
}
