import { useEffect, useState, type RefObject } from 'react';
import { useMotionValueEvent, useScroll } from 'motion/react';

import { usePlatform } from '../context/PlatformContext.js';

/** Porción del track de scroll que completa la coreografía (Actos I–III). */
const CHOREOGRAPHY_FRACTION = 0.88;

/** Altura del track sticky del hero (vh) — una pantalla completa. */
export function heroOrchestratorTrackHeightVh() {
  return 100;
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

/**
 * Scroll → fase 0–1: logo al ancla, narrativa fade-out, panel global fade-in.
 */
export function useHeroScrollChoreography(trackRef: RefObject<HTMLElement | null>) {
  const { setHeroChoreographyPhase } = usePlatform();
  const [phase, setPhase] = useState(0);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end start'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const next = clamp01(progress / CHOREOGRAPHY_FRACTION);
    setPhase(next);
    setHeroChoreographyPhase(next);
  });

  useEffect(() => {
    setHeroChoreographyPhase(0);
    return () => setHeroChoreographyPhase(0);
  }, [setHeroChoreographyPhase]);

  return phase;
}

export function easeHeroPhase(phase: number) {
  const t = clamp01(phase);
  return 1 - (1 - t) ** 3;
}

/** Fase 0–1 del morph hexágono → nódulo IAP (~300ms de scroll percibido). */
export function heroLogoMorphPhase(t: number) {
  return clamp01((t - 0.03) / 0.16);
}

export function heroNarrativeMorphPhase(t: number) {
  return clamp01((t - 0.18) / 0.52);
}
