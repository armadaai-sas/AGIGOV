import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { HERO_CONFIG, HERO_STORY_BEATS } from '../../hero/heroConfig.js';
import {
  easeHeroPhase,
  heroNarrativeMorphPhase,
} from '../../hero/useHeroScrollChoreography.js';

const BEAT_MS = HERO_CONFIG.beatSec * 1000;

type Props = {
  phase: number;
};

/** Intro — actos I–V rotativos; se desvanece al iniciar el scroll. */
export function HeroNarrative({ phase }: Props) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const beat = HERO_STORY_BEATS[index]!;
  const t = easeHeroPhase(phase);
  const fade = 1 - heroNarrativeMorphPhase(t);
  const shiftY = heroNarrativeMorphPhase(t) * -28;

  useEffect(() => {
    if (reduced || fade < 0.1) return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_STORY_BEATS.length);
    }, BEAT_MS);
    return () => window.clearInterval(id);
  }, [reduced, fade]);

  return (
    <div
      className="hero-narrative"
      aria-live="polite"
      style={{
        opacity: fade,
        transform: `translateY(${shiftY}px)`,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="hero-narrative-beat"
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: reduced ? 0.01 : 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="hero-narrative-act">
            {beat.act}
            <span className="hero-narrative-sep" aria-hidden>
              ·
            </span>
            {beat.theme}
          </p>
          <p className="hero-narrative-line hero-narrative-line--hero">{beat.line}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
