import { useEffect, useState } from 'react';

const CYCLE_MS = 4000;

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Pulso cíclico 4s — sincroniza diagrama cinético y canvas generativo. */
export function useDataPulseCycle(enabled = true) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!enabled || prefersReducedMotion()) {
      setPhase(0);
      return;
    }

    let frame = 0;
    const started = performance.now();

    const tick = (now: number) => {
      setPhase(((now - started) % CYCLE_MS) / CYCLE_MS);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [enabled]);

  return phase;
}

export function pulseSegmentActive(pulsePhase: number, index: number, total = 3) {
  const width = 1 / total;
  const start = index * width;
  const local = (pulsePhase - start + 1) % 1;
  return local < width ? local / width : 0;
}
