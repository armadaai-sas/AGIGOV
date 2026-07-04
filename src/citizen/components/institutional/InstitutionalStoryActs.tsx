import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { HERO_CONFIG, HERO_STORY_BEATS } from '../../hero/heroConfig.js';

const BEAT_MS = HERO_CONFIG.beatSec * 1000;

/** Actos I–V — narrativa institucional (antes en el hero de landing). */
export function InstitutionalStoryActs() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const beat = HERO_STORY_BEATS[index]!;

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_STORY_BEATS.length);
    }, BEAT_MS);
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <div className="institutional-story-acts" aria-live="polite">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="institutional-story-beat"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: reduced ? 0.01 : 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="institutional-story-act">
            {beat.act}
            <span className="hero-narrative-sep" aria-hidden>
              ·
            </span>
            {beat.theme}
          </p>
          <p className="institutional-story-line">{beat.line}</p>
        </motion.div>
      </AnimatePresence>

      <div className="institutional-story-dots" role="tablist" aria-label="Actos narrativos">
        {HERO_STORY_BEATS.map((b, i) => (
          <span
            key={b.act}
            className={`institutional-story-dot ${i === index ? 'is-active' : ''}`}
            aria-current={i === index ? 'step' : undefined}
          />
        ))}
      </div>
    </div>
  );
}
