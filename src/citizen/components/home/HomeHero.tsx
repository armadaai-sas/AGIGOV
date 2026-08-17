import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';

import { AgigovLogo } from '../AgigovLogo.js';
import { useLandingCopy } from '../../hero/useLandingCopy.js';
import { usePlatform } from '../../context/PlatformContext.js';
import { HomeHeroMobileCta } from './HomeHeroMobileCta.js';
import { HomeHeroWorkflowDemo } from './HomeHeroWorkflowDemo.js';

/** Hero AGIGOV — layout calm + preview de producto; flujos solo institucionales. */
export function HomeHero() {
  const copy = useLandingCopy();
  const { t } = usePlatform();

  return (
    <section className="hero-landing-track hero-landing-track--light" aria-labelledby="home-hero-title">
      <HomeHeroMobileCta />

      <div id="hero-demo" className="hero-cinematic-stage hero-cinematic-stage--flow scroll-mt-0">
        <div className="hero-cinematic-stage-bg" aria-hidden />

        <div className="hero-cinematic-inner hero-cinematic-inner--flow">
          <div className="hero-cinematic-brand">
            <AgigovLogo size="lg" showWordmark tagline={copy.HERO_CINEMATIC_TAGLINE} variant="light" />
          </div>

          <h1 id="home-hero-title" className="landing-display-title hero-cinematic-title">
            {copy.HERO_CINEMATIC_TITLE}
          </h1>
          <p className="hero-cinematic-subline">{copy.HERO_CINEMATIC_SUBLINE}</p>

          <div className="hero-cinematic-actions">
            <Link to={copy.HERO_CTA_PRIMARY.path} className="hero-brand-btn hero-brand-btn--primary">
              {copy.HERO_CTA_PRIMARY.label}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link to={copy.HERO_CTA_SECONDARY.path} className="hero-brand-btn hero-brand-btn--outline">
              {copy.HERO_CTA_SECONDARY.label}
            </Link>
          </div>

          <HomeHeroWorkflowDemo />

          <p className="hero-cinematic-trust">{copy.HERO_TRUST_LINE}</p>
        </div>

        <a href="#gobernanza-2" className="hero-trust-scroll-hint hero-cinematic-scroll" aria-label={t('hero.scroll.next')}>
          <ChevronDown className="h-5 w-5" aria-hidden />
        </a>
      </div>
    </section>
  );
}
