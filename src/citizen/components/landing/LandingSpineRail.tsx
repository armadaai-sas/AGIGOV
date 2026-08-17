import { useEffect, useState } from 'react';

const SECTIONS = [
  { id: 'hero-demo', label: 'Producto' },
  { id: 'gobernanza-2', label: 'Por qué' },
  { id: 'modelo', label: 'Modelos' },
  { id: 'landing-cta', label: 'Acción' },
] as const;

/** Línea vertical tipo Railway — organiza la landing a la izquierda. */
export function LandingSpineRail() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    if (els.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible?.target?.id) return;
        const idx = SECTIONS.findIndex((s) => s.id === visible.target.id);
        if (idx >= 0) setActive(idx);
      },
      { threshold: [0.2, 0.45, 0.7], rootMargin: '-15% 0px -35% 0px' },
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <aside className="landing-spine" aria-hidden>
      <div className="landing-spine-line" />
      <ol className="landing-spine-dots">
        {SECTIONS.map((s, i) => (
          <li key={s.id} className={`landing-spine-dot ${i === active ? 'is-active' : i < active ? 'is-done' : ''}`}>
            <a href={`#${s.id}`} className="landing-spine-hit" title={s.label}>
              <span className="landing-spine-orb" />
            </a>
          </li>
        ))}
      </ol>
    </aside>
  );
}
