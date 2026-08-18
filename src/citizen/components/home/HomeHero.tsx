import { motion, useReducedMotion } from 'motion/react';

import { AgigovLogo } from '../AgigovLogo.js';
import { useLandingCopy } from '../../hero/useLandingCopy.js';
import { HomeHeroTitleAura } from './HomeHeroTitleAura.js';
import { HomeHeroOsDiagram } from './HomeHeroOsDiagram.js';
import './hero-console.css';

/**
 * Hero page 1: marca + título + subtítulo + diagrama.
 * CTAs viven en #sandbox / #consola — no en la primera vista.
 */
export function HomeHero() {
  const copy = useLandingCopy();
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
      <div id="os" className="hero-cinematic-stage hero-cinematic-stage--navy hero-cinematic-stage--sell scroll-mt-0">
        <div className="hero-cinematic-stage-scrim" aria-hidden />

        <div className="hero-cinematic-inner hero-cinematic-inner--navy hero-cinematic-inner--wide">
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
            <motion.p className="hero-cinematic-subline" {...enter(0.08)}>
              {copy.HERO_CINEMATIC_SUBLINE}
            </motion.p>
          </div>

          <motion.div className="landing-wide-stage" {...enter(0.12)}>
            <HomeHeroOsDiagram />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
