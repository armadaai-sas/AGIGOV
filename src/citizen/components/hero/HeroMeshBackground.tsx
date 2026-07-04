/** Malla topográfica IAP — textura sobre fondo claro u oscuro. */
export function HeroMeshBackground({ dark = false }: { dark?: boolean }) {
  const gridStroke = dark ? '#38bdf8' : '#0052ff';
  const gridOpacity = dark ? '0.08' : '0.12';
  const lineOpacity = dark ? '0.06' : '0.07';
  const fadeStops = dark
    ? [
        { offset: '0%', color: '#030508', opacity: '0.35' },
        { offset: '55%', color: '#030508', opacity: '0' },
        { offset: '100%', color: '#0a0f1a', opacity: '0.4' },
      ]
    : [
        { offset: '0%', color: '#f9fafb', opacity: '0.2' },
        { offset: '55%', color: '#f9fafb', opacity: '0' },
        { offset: '100%', color: '#f3f4f6', opacity: '0.35' },
      ];

  return (
    <div className={`hero-mesh-bg ${dark ? 'hero-mesh-bg--dark' : ''}`} aria-hidden>
      <svg className="hero-mesh-svg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="hero-mesh-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path
              d="M0 24h48M24 0v48"
              stroke={gridStroke}
              strokeWidth="0.35"
              strokeOpacity={gridOpacity}
              fill="none"
            />
          </pattern>
          <linearGradient id="hero-mesh-fade" x1="0" y1="0" x2="0" y2="1">
            {fadeStops.map((s) => (
              <stop key={s.offset} offset={s.offset} stopColor={s.color} stopOpacity={s.opacity} />
            ))}
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-mesh-grid)" />
        {TOPO_LINES.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={gridStroke}
            strokeWidth="0.6"
            strokeOpacity={lineOpacity}
          />
        ))}
        <rect width="100%" height="100%" fill="url(#hero-mesh-fade)" />
      </svg>
    </div>
  );
}

const TOPO_LINES = [
  'M-40 180 C 200 140, 420 220, 720 170 S 1240 120, 1520 200',
  'M-40 320 C 260 280, 480 360, 760 310 S 1180 260, 1520 340',
  'M-40 460 C 180 420, 520 500, 800 450 S 1220 400, 1520 480',
  'M-40 600 C 240 560, 560 640, 840 590 S 1260 540, 1520 620',
  'M-40 740 C 200 700, 440 780, 720 730 S 1160 680, 1520 760',
];
