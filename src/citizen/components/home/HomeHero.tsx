import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, ChevronDown } from 'lucide-react';

import { AgigovLogo } from '../AgigovLogo.js';
import { useLandingCopy } from '../../hero/useLandingCopy.js';
import { usePlatform } from '../../context/PlatformContext.js';
import { HomeHeroMobileCta } from './HomeHeroMobileCta.js';
import { HomeHeroOsDiagram } from './HomeHeroOsDiagram.js';
import { HomeHeroConsoleDemo } from './HomeHeroConsoleDemo.js';
import './hero-console.css';

/** Hero AGIGOV — venta operativa + diagrama que vende + consola grande completa. */
export function HomeHero() {
  const copy = useLandingCopy();
  const { t } = usePlatform();
  const reduceMotion = useReducedMotion();

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

      <div id="hero-demo" className="hero-cinematic-stage hero-cinematic-stage--navy hero-cinematic-stage--sell scroll-mt-0">
        <div className="hero-cinematic-stage-scrim" aria-hidden />

        <div className="hero-cinematic-inner hero-cinematic-inner--navy hero-cinematic-inner--sell">
          <motion.div className="hero-cinematic-brand" {...enter(0)}>
            <AgigovLogo size="lg" showWordmark tagline={copy.HERO_CINEMATIC_TAGLINE} variant="dark" />
          </motion.div>

          <motion.h1
            id="home-hero-title"
            className="landing-display-title hero-cinematic-title hero-cinematic-title--navy"
            {...enter(0.05)}
          >
            {copy.HERO_CINEMATIC_TITLE}
          </motion.h1>

          <motion.p className="hero-sell-lead" {...enter(0.09)}>
            {copy.HERO_SELL_LEAD}
          </motion.p>

          <motion.ul className="hero-sell-points" {...enter(0.12)}>
            {copy.HERO_SELL_POINTS.map((point) => (
              <li key={point} className="hero-sell-point">
                {point}
              </li>
            ))}
          </motion.ul>

          <motion.div className="hero-cinematic-actions" {...enter(0.15)}>
            <Link to={copy.HERO_CTA_PRIMARY.path} className="hero-brand-btn hero-brand-btn--primary hero-brand-btn--navy">
              {copy.HERO_CTA_PRIMARY.label}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link to={copy.HERO_CTA_SECONDARY.path} className="hero-brand-btn hero-brand-btn--ghost-navy">
              {copy.HERO_CTA_SECONDARY.label}
            </Link>
          </motion.div>

          <motion.div className="hero-product-stage hero-product-stage--sell" {...enter(0.2)}>
            <HomeHeroOsDiagram />

            <div className="hero-console-full">
              <p className="hero-console-full-label">
                <span className="hero-cinematic-live-dot hero-cinematic-live-dot--on" aria-hidden />
                {copy.HERO_CINEMATIC_LIVE_CAPTION}
              </p>
              <div className="hero-product-frame hero-product-frame--full">
                <HomeHeroConsoleDemo />
              </div>
            </div>
          </motion.div>

          <motion.p className="hero-cinematic-trust hero-cinematic-trust--navy" {...enter(0.26)}>
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
