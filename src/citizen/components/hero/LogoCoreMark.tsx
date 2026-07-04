import { useId } from 'react';

type Props = {
  className?: string;
  /** 0 = hexágono cerrado · 1 = nódulo IAP abierto con líneas de luz. */
  morph?: number;
};

/** Núcleo AGIGOV — morph hexágono → nódulo de red al scroll. */
export function LogoCoreMark({ className = '', morph = 0 }: Props) {
  const uid = useId().replace(/:/g, '');
  const coreGrad = `hero-core-${uid}`;
  const t = Math.min(1, Math.max(0, morph));
  const cx = 24;
  const cy = 22.5;
  const open = t * 3.2;

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-hidden
    >
      <defs>
        <linearGradient id={coreGrad} x1="14" y1="10" x2="34" y2="38">
          <stop offset="0%" stopColor="var(--hero-accent, #0052ff)" />
          <stop offset="100%" stopColor="#0040cc" />
        </linearGradient>
        <radialGradient id={`${coreGrad}-glow`} cx="24" cy="22" r="18">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.15 * t} />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="24" cy="22" r="18" fill={`url(#${coreGrad}-glow)`} />

      {RAY_ANGLES.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const len = 8 + t * 14;
        return (
          <line
            key={deg}
            x1={cx}
            y1={cy}
            x2={cx + Math.cos(rad) * len}
            y2={cy + Math.sin(rad) * len}
            stroke="#38bdf8"
            strokeWidth="0.45"
            strokeLinecap="round"
            opacity={t * 0.42}
          />
        );
      })}

      <path
        d={`M24 ${9 - open} L${35.5 + t * 0.6} ${15.6 + open * 0.4} V${32.4 - open * 0.2} L24 ${39 + open * 0.5} L${12.5 - t * 0.6} ${32.4 - open * 0.2} V${15.6 + open * 0.4} Z`}
        fill={`url(#${coreGrad})`}
        fillOpacity={1 - t * 0.12}
      />
      <circle cx={cx} cy={cy} r={2.25 + t * 0.5} fill="#f8fafc" opacity={0.95 - t * 0.15} />
    </svg>
  );
}

const RAY_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];
