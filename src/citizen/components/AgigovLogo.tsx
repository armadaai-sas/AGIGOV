import { useId } from 'react';

type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const sizes: Record<LogoSize, string> = {
  xs: 'h-6 w-6',
  sm: 'h-9 w-9',
  md: 'h-11 w-11',
  lg: 'h-14 w-14',
  xl: 'h-16 w-16',
};

/** Marca AGIGOV — sobria, imponente; acento mínimo de fuerza en el isotipo. */
export function AgigovLogo({
  size = 'md',
  showWordmark = false,
  tagline,
  showVenBadge = false,
  variant = 'light',
  className,
}: {
  size?: LogoSize;
  showWordmark?: boolean;
  tagline?: string;
  showVenBadge?: boolean;
  /** `light` = fondo claro · `dark` = fondo oscuro (legacy) */
  variant?: 'dark' | 'light';
  className?: string;
}) {
  const uid = useId().replace(/:/g, '');
  const coreGrad = `agigov-core-${uid}`;
  const wordmarkClass = variant === 'light' ? 'text-zinc-950' : 'text-white';
  const taglineClass = variant === 'light' ? 'text-zinc-500' : 'text-zinc-400';

  return (
    <div className={`flex items-center gap-2.5 ${className ?? ''}`.trim()}>
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
            <linearGradient id={coreGrad} x1="16" y1="8" x2="32" y2="40">
              <stop offset="0%" stopColor="#1a3a8f" />
              <stop offset="55%" stopColor="#0f2557" />
              <stop offset="100%" stopColor="#091a3d" />
            </linearGradient>
          </defs>
          <circle cx="24" cy="24" r="20" stroke="#d4d4d8" strokeWidth="0.75" fill="#fafafa" />
          <path
            d="M24 10l10.5 6v12L24 34l-10.5-6V16L24 10z"
            fill={`url(#${coreGrad})`}
          />
          <path
            d="M24 10l10.5 6v12L24 34l-10.5-6V16L24 10z"
            stroke="#061028"
            strokeWidth="0.35"
            strokeOpacity="0.22"
            fill="none"
          />
          <path
            d="M24 10v4.5M24 33.5V34"
            stroke="#ffffff"
            strokeWidth="0.65"
            strokeLinecap="round"
            strokeOpacity="0.35"
          />
          <circle cx="24" cy="22" r="1.75" fill="#ffffff" opacity="0.88" />
        </svg>
      </div>

      {showWordmark ? (
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p
              className={`font-sans text-lg font-bold tracking-[-0.04em] md:text-xl ${wordmarkClass}`}
            >
              AGIGOV
            </p>
            {showVenBadge ? <span className="agigov-badge-ven">VEN</span> : null}
          </div>
          {tagline ? (
            <p className={`mt-0.5 text-[11px] font-medium uppercase tracking-[0.14em] ${taglineClass}`}>
              {tagline}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
