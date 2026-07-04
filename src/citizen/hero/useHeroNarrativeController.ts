import { useEffect, type RefObject } from 'react';
import { useMotionValueEvent, useScroll } from 'motion/react';

import { usePlatform } from '../context/PlatformContext.js';
import {
  HERO_CONFIG,
  HERO_STORY_BEATS,
  beatIndexAtProgress,
} from './heroConfig.js';

type Options = {
  trackRef: RefObject<HTMLElement | null>;
  enabled?: boolean;
};

/**
 * Orquestador narrativo — scroll (actos II–III) + reloj de respaldo.
 * Actualiza PlatformContext; degradación elegante si scroll no disponible.
 */
export function useHeroNarrativeController({ trackRef, enabled = true }: Options) {
  const { setHeroNarrative } = usePlatform();
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (!enabled) return;

    if (progress <= 0.012) {
      setHeroNarrative(0, progress, 0);
      return;
    }

    const index = beatIndexAtProgress(progress);
    const segment = (progress * HERO_STORY_BEATS.length) % 1;
    const pathDraw = index >= 1 ? (index === 1 || index === 2 ? segment : 1) : 0;
    setHeroNarrative(index, progress, pathDraw);
  });

  useEffect(() => {
    if (!enabled) return;
    setHeroNarrative(0, 0, 0);
  }, [enabled, setHeroNarrative]);
}

export function heroScrollTrackHeightVh() {
  return HERO_STORY_BEATS.length * HERO_CONFIG.scrollVhPerAct;
}
