import { useEffect, useState } from 'react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';

/** Indicador lateral — progreso en las 3 pantallas del hero. */
export function HomeHeroProgress() {
  const copy = useLandingCopy();
  const screens = [
    { id: 'hero-demo', label: copy.HERO_SCREEN_LABELS[0] },
    { id: 'hero-story', label: copy.HERO_SCREEN_LABELS[1] },
    { id: 'hero-cta', label: copy.HERO_SCREEN_LABELS[2] },
  ] as const;

  const [active, setActive] = useState(0);

  useEffect(() => {
    const nodes = screens.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idx = nodes.findIndex((n) => n.id === entry.target.id);
          if (idx >= 0) setActive(idx);
        }
      },
      { root: null, threshold: 0.45 },
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, [screens]);

  return (
    <nav className="hero-screen-progress" aria-label="Hero progress">
      <ol>
        {screens.map((screen, i) => (
          <li key={screen.id}>
            <a
              href={`#${screen.id}`}
              className={`hero-screen-progress-link ${i === active ? 'is-active' : ''} ${i < active ? 'is-done' : ''}`}
              aria-current={i === active ? 'step' : undefined}
            >
              <span className="hero-screen-progress-dot" aria-hidden />
              <span className="hero-screen-progress-label">{screen.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
