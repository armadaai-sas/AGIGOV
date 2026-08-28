import { useReducedMotion } from 'motion/react';

/** Aura detrás del título — trazo zinc sutil (sin cyan marketing). */
export function HomeHeroTitleAura() {
  const reduceMotion = useReducedMotion();

  return (
    <div className={`hero-title-aura ${reduceMotion ? '' : 'is-alive'}`} aria-hidden>
      <div className="hero-title-aura-glow" />
      <div className="hero-title-aura-glow hero-title-aura-glow--soft" />
      <svg className="hero-title-aura-svg" viewBox="0 0 640 220" fill="none">
        <defs>
          <linearGradient id="hero-aura-stroke" x1="0" y1="0" x2="640" y2="220">
            <stop offset="0%" stopColor="#18181b" stopOpacity="0" />
            <stop offset="45%" stopColor="#52525b" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#18181b" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          className="hero-title-aura-path"
          d="M40 160 C120 40, 220 200, 320 90 S520 40, 600 130"
          stroke="url(#hero-aura-stroke)"
          strokeWidth="1.5"
        />
        <path
          className="hero-title-aura-path hero-title-aura-path--delay"
          d="M80 40 C180 120, 260 20, 360 140 S500 180, 580 70"
          stroke="url(#hero-aura-stroke)"
          strokeWidth="1.25"
          opacity="0.7"
        />
        <circle className="hero-title-aura-node" cx="120" cy="78" r="4" fill="#a1a1aa" />
        <circle className="hero-title-aura-node" cx="320" cy="90" r="5" fill="#71717a" />
        <circle className="hero-title-aura-node" cx="480" cy="120" r="4" fill="#a1a1aa" />
        <circle className="hero-title-aura-node" cx="560" cy="88" r="3.5" fill="#d4d4d8" />
      </svg>
    </div>
  );
}
