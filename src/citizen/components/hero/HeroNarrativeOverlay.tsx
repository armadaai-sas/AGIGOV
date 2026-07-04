import { AnimatePresence, motion } from 'motion/react';

import { useHeroStoryBeat } from '../../hero/useHeroStoryBeat.js';

/** Narrativa flotante — debajo del núcleo, sin tarjeta ni CTAs. */
export function HeroNarrativeOverlay() {
  const { beat, index, scrollProgress } = useHeroStoryBeat();
  const compact = scrollProgress < 0.12;

  return (
    <div className="hero-narrative-overlay">
      <div className="hero-narrative-copy" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            className="hero-narrative-float"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {!compact ? (
              <p className="hero-narrative-act">
                {beat.act}
                <span className="hero-narrative-sep" aria-hidden>
                  ·
                </span>
                {beat.theme}
              </p>
            ) : null}
            <p className={`hero-narrative-line ${compact ? 'hero-narrative-line--hero' : ''}`}>
              {beat.line}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
