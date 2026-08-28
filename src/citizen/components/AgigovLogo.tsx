import { useId } from 'react';

type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

const sizes: Record<LogoSize, string> = {
  sm: 'h-9 w-9',
  md: 'h-11 w-11',
  lg: 'h-14 w-14',
  xl: 'h-16 w-16',
};

/** Marca AGIGOV — azul solo en el isotipo; wordmark negro o blanco según fondo. */
export function AgigovLogo({
  size = 'md',
  showWordmark = false,
  tagline,
  showVenBadge = false,
  variant = 'light',
}: {
  size?: LogoSize;
  showWordmark?: boolean;
  tagline?: string;
  showVenBadge?: boolean;
  /** `light` = fondo claro · `dark` = fondo oscuro (legacy) */
  variant?: 'dark' | 'light';
}) {
  const uid = useId().replace(/:/g, '');
  const coreGrad = `agigov-core-${uid}`;
  const wordmarkClass = variant === 'light' ? 'text-zinc-900' : 'text-white';
  const taglineClass = variant === 'light' ? 'text-zinc-500' : 'text-zinc-400';

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
            <linearGradient id={coreGrad} x1="14" y1="10" x2="34" y2="38">
              <stop offset="0%" stopColor="#0052ff" />
              <stop offset="100%" stopColor="#003db8" />
            </linearGradient>
          </defs>
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="#e4e4e7"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M24 10l10.5 6v12L24 34l-10.5-6V16L24 10z"
            fill={`url(#${coreGrad})`}
          />
          <circle cx="24" cy="22" r="2.5" fill="#ffffff" opacity="0.95" />
        </svg>
      </div>

      {showWordmark ? (
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className={`font-sans text-lg font-semibold tracking-[-0.02em] md:text-xl ${wordmarkClass}`}>
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
