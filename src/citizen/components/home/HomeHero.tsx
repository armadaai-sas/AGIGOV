import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { Compass, Rocket, Sparkles } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';
import { HomeHeroTitleAura } from './HomeHeroTitleAura.js';
import { HomeHeroOsDiagram } from './HomeHeroOsDiagram.js';

const GATE_ICONS = {
  explore: Compass,
  deploy: Rocket,
  discover: Sparkles,
} as const;

/** Hero: tres puertas OS (Explorar · Desplegar · Descubrir) + diagrama. */
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

          <motion.div className="ls-hero-gates" role="navigation" aria-label={copy.HERO_GATES_ARIA} {...enter(0.12)}>
            {copy.HERO_GATES.map((gate) => {
              const Icon = GATE_ICONS[gate.id];
              return (
                <Link key={gate.id} to={gate.path} className={`ls-hero-gate ls-hero-gate--${gate.id}`}>
                  <span className="ls-hero-gate-icon" aria-hidden>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="ls-hero-gate-copy">
                    <span className="ls-hero-gate-label">{gate.label}</span>
                    <span className="ls-hero-gate-hint">{gate.hint}</span>
                  </span>
                  <span className="ls-hero-gate-go" aria-hidden>
                    →
                  </span>
                </Link>
              );
            })}
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
