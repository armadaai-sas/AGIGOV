/** Ilustración vectorial optimizada (Fase G3) — ciudad, gobierno transparente, comunidad. */
export function CityProsperityIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Ciudad moderna con gobierno transparente y comunidad próspera"
    >
      <defs>
        <linearGradient id="w-sky" x1="240" y1="0" x2="240" y2="360">
          <stop offset="0%" stopColor="#0c1929" />
          <stop offset="100%" stopColor="#060a12" />
        </linearGradient>
        <linearGradient id="w-glass" x1="240" y1="140" x2="240" y2="320">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#0369a1" stopOpacity="0.06" />
        </linearGradient>
        <linearGradient id="w-ground" x1="240" y1="280" x2="240" y2="360">
          <stop offset="0%" stopColor="#1e293b" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="480" height="360" fill="url(#w-sky)" />
      <circle cx="380" cy="72" r="36" fill="#fcd34d" fillOpacity="0.12" />
      <circle cx="380" cy="72" r="12" fill="#fcd34d" fillOpacity="0.85" />

      {/* Edificios laterales simplificados */}
      <rect x="48" y="205" width="52" height="115" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      <rect x="112" y="175" width="44" height="145" rx="4" fill="#243044" stroke="#334155" strokeWidth="1" />

      {/* Edificio gobierno transparente */}
      <rect x="168" y="145" width="144" height="175" rx="6" fill="url(#w-glass)" stroke="#22d3ee" strokeWidth="1.5" strokeOpacity="0.45" />
      <path d="M228 118 L240 104 L252 118 V142 H216 V118 Z" fill="#0369a1" fillOpacity="0.45" stroke="#38bdf8" strokeWidth="1" />
      <rect x="188" y="168" width="104" height="6" rx="2" fill="#fcd34d" fillOpacity="0.35" />

      <rect x="328" y="190" width="48" height="130" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      <rect x="392" y="215" width="40" height="105" rx="4" fill="#243044" stroke="#334155" strokeWidth="1" />

      {/* Comunidad estilizada */}
      <ellipse cx="148" cy="318" rx="44" ry="7" fill="#000" fillOpacity="0.2" />
      <circle cx="132" cy="300" r="8" fill="#38bdf8" fillOpacity="0.85" />
      <circle cx="160" cy="304" r="7" fill="#fcd34d" fillOpacity="0.85" />
      <ellipse cx="320" cy="318" rx="40" ry="7" fill="#000" fillOpacity="0.18" />
      <circle cx="308" cy="300" r="8" fill="#38bdf8" fillOpacity="0.8" />
      <circle cx="334" cy="304" r="7" fill="#fcd34d" fillOpacity="0.8" />

      <circle cx="56" cy="292" r="12" fill="#059669" fillOpacity="0.28" />
      <circle cx="420" cy="298" r="14" fill="#059669" fillOpacity="0.3" />

      <rect x="0" y="280" width="480" height="80" fill="url(#w-ground)" />

      <path
        d="M96 148 Q240 132 384 148"
        stroke="#22d3ee"
        strokeWidth="1"
        strokeOpacity="0.22"
        strokeDasharray="4 6"
        fill="none"
      />
    </svg>
  );
}
