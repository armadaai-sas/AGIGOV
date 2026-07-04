import { LogoCoreMark } from './LogoCoreMark.js';
import {
  easeHeroPhase,
  heroLogoMorphPhase,
} from '../../hero/useHeroScrollChoreography.js';

type Props = {
  phase: number;
};

/** Logo central → morph IAP → sello superior izquierdo al scroll. */
export function LogoCore({ phase }: Props) {
  const t = easeHeroPhase(phase);
  const morph = heroLogoMorphPhase(t);

  const left = `calc(${50 * (1 - t)}% + ${t * 24}px)`;
  const top = `calc(${40 * (1 - t)}% + ${t * 22}px)`;
  const translateX = `${-50 * (1 - t)}%`;
  const translateY = `${-50 * (1 - t)}%`;
  const scale = 1 - t * 0.68;
  const opacity = t > 0.88 ? Math.max(0, 1 - (t - 0.88) / 0.1) : 1;

  return (
    <div
      className="hero-logo-core"
      aria-hidden={t > 0.95}
      style={{
        left,
        top,
        opacity,
        transform: `translate(${translateX}, ${translateY}) scale(${scale})`,
      }}
    >
      <LogoCoreMark morph={morph} className="hero-logo-core-mark" />
    </div>
  );
}
