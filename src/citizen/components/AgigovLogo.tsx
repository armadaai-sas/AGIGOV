import { useId } from 'react';

type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

const sizes: Record<LogoSize, string> = {
  sm: 'h-9 w-9',
  md: 'h-11 w-11',
  lg: 'h-14 w-14',
  xl: 'h-[5.5rem] w-[5.5rem]',
};

/** Marca AGIGOV — órbita + núcleo hexagonal (favicon-safe, sin badges en wordmark). */
export function AgigovLogo({
  size = 'md',
  showWordmark = false,
  tagline,
  showVenBadge = false,
}: {
  size?: LogoSize;
  showWordmark?: boolean;
  /** @deprecated Sin subtítulos — solo logo + nombre */
  tagline?: string;
  showVenBadge?: boolean;
}) {
  const uid = useId().replace(/:/g, '');
  const orbitGrad = `agigov-orbit-${uid}`;
  const coreGrad = `agigov-core-${uid}`;
  const glowGrad = `agigov-glow-${uid}`;

  return (
    <div className="flex items-center gap-3">
      <div className={`relative shrink-0 ${sizes[size]}`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          role="img"
          aria-label="AGIGOV"
        >
          <defs>
            <linearGradient id={orbitGrad} x1="0" y1="24" x2="48" y2="24">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.35" />
            </linearGradient>
            <linearGradient id={coreGrad} x1="14" y1="10" x2="34" y2="38">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
            <radialGradient id={glowGrad} cx="24" cy="24" r="20">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle cx="24" cy="24" r="22" fill={`url(#${glowGrad})`} />
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke={`url(#${orbitGrad})`}
            strokeWidth="1.25"
            fill="none"
            strokeDasharray="4 3"
            opacity="0.8"
          />
          <path
            d="M24 10l10.5 6v12L24 34l-10.5-6V16L24 10z"
            fill={`url(#${coreGrad})`}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="0.75"
          />
          <circle cx="24" cy="22" r="2.75" fill="#f8fafc" opacity="0.95" />
        </svg>
      </div>

      {showWordmark ? (
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-display text-lg font-semibold tracking-[-0.03em] text-agigov-text md:text-xl">
              AGIGOV
            </p>
            {showVenBadge ? <span className="agigov-badge-ven">VEN</span> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
