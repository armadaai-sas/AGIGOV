import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';
import { HomeHeroModelCard } from './HomeHeroModelCard.js';
import './hero-console.css';

/** Pantalla 3 — título + CTA + tarjeta flotante. */
export function HomeHeroCtaStage() {
  const copy = useLandingCopy();

  return (
    <div id="hero-cta" className="hero-cta-stage scroll-mt-0">
      <div className="hero-cta-stage-bg" aria-hidden />

      <div className="hero-cta-layout">
        <div className="hero-cta-copy">
          <p className="hero-brand-kicker">{copy.HERO_CTA_STAGE_KICKER}</p>
          <h2 className="landing-display-title hero-cta-title">{copy.HERO_CTA_STAGE_TITLE}</h2>
          <p className="landing-lead hero-cta-lead">{copy.HERO_CTA_STAGE_LEAD}</p>

          <div className="hero-cta-actions">
            <Link to={copy.HERO_CTA_PRIMARY.path} className="hero-brand-btn hero-brand-btn--primary">
              {copy.HERO_CTA_PRIMARY.label}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link to={copy.HERO_CTA_SECONDARY.path} className="hero-brand-btn hero-brand-btn--ghost">
              {copy.HERO_CTA_SECONDARY.label}
            </Link>
          </div>

          <p className="hero-cta-micro">{copy.HERO_CTA_MICRO}</p>
          <p className="hero-cta-trust">{copy.HERO_TRUST_LINE}</p>
        </div>

        <div className="hero-cta-visual">
          <HomeHeroModelCard />
        </div>
      </div>
    </div>
  );
}
