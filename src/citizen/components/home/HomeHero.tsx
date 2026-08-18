import { motion, useReducedMotion } from 'motion/react';

import { AgigovLogo } from '../AgigovLogo.js';
import { useLandingCopy } from '../../hero/useLandingCopy.js';
import { HomeHeroTitleAura } from './HomeHeroTitleAura.js';
import { HomeHeroOsDiagram } from './HomeHeroOsDiagram.js';

/**
 * Hero: marca + título + subtítulo + diagrama.
 * CTAs viven en #sandbox — no en la primera vista.
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
    <section id="os" className="ls-section ls-section--hero" aria-labelledby="home-hero-title">
      <div className="ls-inner">
        <motion.div className="ls-hero-brand" {...enter(0)}>
          <AgigovLogo size="lg" showWordmark tagline={copy.HERO_CINEMATIC_TAGLINE} variant="dark" />
        </motion.div>

        <div className="ls-hero-stack">
          <HomeHeroTitleAura />
          <motion.h1 id="home-hero-title" className="ls-hero-title" {...enter(0.05)}>
            {copy.HERO_CINEMATIC_TITLE}
          </motion.h1>
          <motion.p className="ls-hero-sub" {...enter(0.08)}>
            {copy.HERO_CINEMATIC_SUBLINE}
          </motion.p>
        </div>

        <motion.div className="ls-stage" {...enter(0.12)}>
          <HomeHeroOsDiagram />
        </motion.div>
      </div>
    </section>
  );
}
