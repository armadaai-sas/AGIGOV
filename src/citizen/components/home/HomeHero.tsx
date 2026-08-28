import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';

import { AgigovLogo } from '../AgigovLogo.js';
import { useLandingCopy } from '../../hero/useLandingCopy.js';
import { HomeHeroTitleRotator, type HeroAudience } from './HomeHeroTitleRotator.js';
import { HomeHeroInteractiveStage } from './HomeHeroInteractiveStage.js';
import { HomeHeroGateRail } from './HomeHeroGateRail.js';
import { HomeHeroLivePulse } from './HomeHeroLivePulse.js';

/** Hero: marca → promesa → kernel → resultados → Sandbox + API. */
export function HomeHero() {
  const copy = useLandingCopy();
  const reduceMotion = useReducedMotion();
  const [audience, setAudience] = useState<HeroAudience>('business');
  const onAudienceChange = useCallback((next: HeroAudience) => setAudience(next), []);

  const enter = (delay: number) =>
    reduceMotion
      ? undefined
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.42, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section id="os" className="ls-section ls-section--hero" aria-labelledby="home-hero-title">
      <div className="ls-inner">
        <div className="ls-hero-stack">
          <motion.div className="ls-hero-brand" {...enter(0)}>
            <AgigovLogo size="lg" showWordmark tagline={copy.HERO_CINEMATIC_TAGLINE} variant="light" />
          </motion.div>

          <motion.p className="ls-hero-not-llm" {...enter(0.03)}>
            {copy.HERO_NOT_LLM}
          </motion.p>

          <motion.div className="ls-hero-title-wrap" {...enter(0.06)}>
            <HomeHeroTitleRotator audience={audience} onAudienceChange={onAudienceChange} />
          </motion.div>

          <motion.p className="ls-hero-sub" {...enter(0.1)}>
            {copy.HERO_CINEMATIC_SUBLINE}
          </motion.p>

          <motion.div {...enter(0.14)}>
            <HomeHeroGateRail />
          </motion.div>

          <motion.div {...enter(0.17)}>
            <HomeHeroLivePulse />
          </motion.div>

          <motion.div className="ls-hero-cta" {...enter(0.2)}>
            <Link to={copy.HERO_CTA_PRIMARY.path} className="ls-btn ls-btn--primary ls-btn--impact">
              {copy.HERO_CTA_PRIMARY.label}
              <span aria-hidden> →</span>
            </Link>
            <Link to={copy.HERO_CTA_SECONDARY.path} className="ls-btn ls-btn--secondary">
              {copy.HERO_CTA_SECONDARY.label}
            </Link>
          </motion.div>
        </div>
      </div>

      <motion.div className="ls-stage ls-stage--hero ls-stage--caps" {...enter(0.24)}>
        <div className="ls-inner ls-inner--stage">
          <HomeHeroInteractiveStage audience={audience} onAudienceChange={onAudienceChange} />
        </div>
      </motion.div>
    </section>
  );
}
