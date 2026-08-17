import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, ChevronDown } from 'lucide-react';

import { AgigovLogo } from '../AgigovLogo.js';
import { HeroSlideRail } from '../HeroSlideRail.js';
import { useLandingCopy } from '../../hero/useLandingCopy.js';
import { usePlatform } from '../../context/PlatformContext.js';
import { HERO_SLIDES } from '../../hero/heroFilmConfig.js';
import { HomeHeroMobileCta } from './HomeHeroMobileCta.js';
import { HomeHeroCaseRail } from './HomeHeroCaseRail.js';
import { HomeHeroConsoleDemo } from './HomeHeroConsoleDemo.js';
import './hero-console.css';

/** Hero AGIGOV — dark navy, visual-first, consola dinámica (Railway scale). */
export function HomeHero() {
  const copy = useLandingCopy();
  const { t } = usePlatform();
  const reduceMotion = useReducedMotion();
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => setSlide((n) => (n + 1) % HERO_SLIDES.length), 4500);
    return () => clearInterval(id);
  }, [reduceMotion]);

  const enter = (delay: number) =>
    reduceMotion
      ? undefined
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section className="hero-landing-track hero-landing-track--navy" aria-labelledby="home-hero-title">
      <HomeHeroMobileCta />

      <div id="hero-demo" className="hero-cinematic-stage hero-cinematic-stage--navy scroll-mt-0">
        <HeroSlideRail activeIndex={slide} />
        <div className="hero-cinematic-stage-scrim" aria-hidden />

        <div className="hero-cinematic-inner hero-cinematic-inner--navy">
          <motion.div className="hero-cinematic-brand" {...enter(0)}>
            <AgigovLogo size="lg" showWordmark tagline={copy.HERO_CINEMATIC_TAGLINE} variant="dark" />
          </motion.div>

          <motion.h1
            id="home-hero-title"
            className="landing-display-title hero-cinematic-title hero-cinematic-title--navy"
            {...enter(0.06)}
          >
            {copy.HERO_CINEMATIC_TITLE}
          </motion.h1>

          <motion.p className="hero-cinematic-subline hero-cinematic-subline--navy" {...enter(0.1)}>
            {copy.HERO_CINEMATIC_SUBLINE}
          </motion.p>

          <motion.div className="hero-cinematic-actions" {...enter(0.14)}>
            <Link to={copy.HERO_CTA_PRIMARY.path} className="hero-brand-btn hero-brand-btn--primary hero-brand-btn--navy">
              {copy.HERO_CTA_PRIMARY.label}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link to={copy.HERO_CTA_SECONDARY.path} className="hero-brand-btn hero-brand-btn--ghost-navy">
              {copy.HERO_CTA_SECONDARY.label}
            </Link>
          </motion.div>

          <motion.div className="hero-product-stage" {...enter(0.2)}>
            <HomeHeroCaseRail />
            <div className="hero-product-frame">
              <HomeHeroConsoleDemo />
            </div>
            <p className="hero-cinematic-live-caption hero-cinematic-live-caption--navy">
              <span className="hero-cinematic-live-dot hero-cinematic-live-dot--on" aria-hidden />
              {copy.HERO_CINEMATIC_LIVE_CAPTION}
            </p>
          </motion.div>

          <motion.p className="hero-cinematic-trust hero-cinematic-trust--navy" {...enter(0.28)}>
            {copy.HERO_TRUST_LINE}
          </motion.p>
        </div>

        <a
          href="#gobernanza-2"
          className="hero-trust-scroll-hint hero-cinematic-scroll hero-cinematic-scroll--navy"
          aria-label={t('hero.scroll.next')}
        >
          <ChevronDown className="h-5 w-5" aria-hidden />
        </a>
      </div>
    </section>
  );
}
