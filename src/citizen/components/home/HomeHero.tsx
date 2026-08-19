import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';
import { HomeHeroTitleAura } from './HomeHeroTitleAura.js';
import { HomeHeroOsDiagram } from './HomeHeroOsDiagram.js';

/** Hero: título + subtítulo + CTAs de impacto + diagrama. */
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
        <div className="ls-hero-stack">
          <HomeHeroTitleAura />
          <motion.h1 id="home-hero-title" className="ls-hero-title" {...enter(0)}>
            {copy.HERO_CINEMATIC_TITLE}
          </motion.h1>
          <motion.p className="ls-hero-sub" {...enter(0.05)}>
            {copy.HERO_CINEMATIC_SUBLINE}
          </motion.p>
          <motion.div className="ls-hero-ctas" {...enter(0.1)}>
            <a href="#construir" className="ls-btn ls-btn--primary ls-btn--impact">
              {copy.LANDING_PROCESS_CTA}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a href="#desplegar" className="ls-btn ls-btn--ghost">
              {copy.LANDING_DEPLOY_CTA}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a href="#operacion" className="ls-btn ls-btn--ghost">
              {copy.LANDING_HOW_KICKER}
            </a>
          </motion.div>
        </div>
      </div>

      <motion.div className="ls-stage ls-stage--hero" {...enter(0.14)}>
        <div className="ls-inner ls-inner--stage">
          <HomeHeroOsDiagram />
        </div>
      </motion.div>
    </section>
  );
}
