import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, ChevronDown } from 'lucide-react';

import { AgigovLogo } from '../AgigovLogo.js';
import { useLandingCopy } from '../../hero/useLandingCopy.js';
import { usePlatform } from '../../context/PlatformContext.js';
import { HomeHeroMobileCta } from './HomeHeroMobileCta.js';
import { HomeHeroTitleAura } from './HomeHeroTitleAura.js';
import { HomeHeroOsDiagram } from './HomeHeroOsDiagram.js';
import { HomeHeroConsoleDemo } from './HomeHeroConsoleDemo.js';
import './hero-console.css';

/**
 * Hero Railway-calm: marca + título grande + aura interactiva + diagrama que vende + consola.
 * Sin muro de texto.
 */
export function HomeHero() {
  const copy = useLandingCopy();
  const { t } = usePlatform();
  const reduceMotion = useReducedMotion();

  const enter = (delay: number) =>
    reduceMotion
      ? undefined
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section className="hero-landing-track hero-landing-track--navy" aria-labelledby="home-hero-title">
      <HomeHeroMobileCta />

      <div id="hero-demo" className="hero-cinematic-stage hero-cinematic-stage--navy hero-cinematic-stage--sell scroll-mt-0">
        <div className="hero-cinematic-stage-scrim" aria-hidden />

        <div className="hero-cinematic-inner hero-cinematic-inner--navy hero-cinematic-inner--sell">
          <motion.div className="hero-cinematic-brand" {...enter(0)}>
            <AgigovLogo size="lg" showWordmark tagline={copy.HERO_CINEMATIC_TAGLINE} variant="dark" />
          </motion.div>

          <div className="hero-title-stack">
            <HomeHeroTitleAura />
            <motion.h1
              id="home-hero-title"
              className="landing-display-title hero-cinematic-title hero-cinematic-title--navy hero-cinematic-title--xl"
              {...enter(0.05)}
            >
              {copy.HERO_CINEMATIC_TITLE}
            </motion.h1>
          </div>

          <motion.div className="hero-cinematic-actions" {...enter(0.1)}>
            <Link to={copy.HERO_CTA_PRIMARY.path} className="hero-brand-btn hero-brand-btn--primary hero-brand-btn--navy">
              {copy.HERO_CTA_PRIMARY.label}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link to={copy.HERO_CTA_SECONDARY.path} className="hero-brand-btn hero-brand-btn--ghost-navy">
              {copy.HERO_CTA_SECONDARY.label}
            </Link>
          </motion.div>

          <motion.div className="hero-product-stage hero-product-stage--sell" {...enter(0.14)}>
            <HomeHeroOsDiagram />
            <div className="hero-product-frame hero-product-frame--full">
              <HomeHeroConsoleDemo />
            </div>
          </motion.div>
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
