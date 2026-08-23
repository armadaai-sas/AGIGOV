import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';
import { HomeHeroTitleAura } from './HomeHeroTitleAura.js';
import { HomeHeroOsDiagram } from './HomeHeroOsDiagram.js';

/** Hero marketing: marca + promesa + CTAs + diagrama (sin chrome de app). */
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
          <motion.p className="ls-hero-not-llm" {...enter(0)}>
            {copy.HERO_NOT_LLM}
          </motion.p>
          <motion.h1 id="home-hero-title" className="ls-hero-title" {...enter(0.04)}>
            {copy.HERO_CINEMATIC_TITLE}
          </motion.h1>
          <motion.p className="ls-hero-sub" {...enter(0.08)}>
            {copy.HERO_CINEMATIC_SUBLINE}
          </motion.p>
          <motion.div className="ls-hero-cta" {...enter(0.12)}>
            <Link to={copy.HERO_CTA_PRIMARY.path} className="ls-btn ls-btn--primary">
              {copy.HERO_CTA_PRIMARY.label}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link to={copy.HERO_CTA_SECONDARY.path} className="ls-btn ls-btn--ghost">
              {copy.HERO_CTA_SECONDARY.label}
            </Link>
          </motion.div>
          <motion.p className="ls-hero-trust" {...enter(0.16)}>
            {copy.HERO_TRUST_LINE}
          </motion.p>
        </div>
      </div>

      <motion.div className="ls-stage ls-stage--hero" {...enter(0.18)}>
        <div className="ls-inner ls-inner--stage">
          <HomeHeroOsDiagram />
        </div>
      </motion.div>
    </section>
  );
}
