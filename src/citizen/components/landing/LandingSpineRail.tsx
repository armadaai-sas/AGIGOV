import { useEffect, useState } from 'react';

const SECTIONS = [
  { id: 'os', label: 'OS' },
  { id: 'consola', label: 'Consola' },
  { id: 'modelos', label: 'Modelos' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'seguridad', label: 'Seguridad' },
  { id: 'aplicacion', label: 'Aplicación' },
  { id: 'desarrolladores', label: 'Desarrolladores' },
  { id: 'pruebalo', label: 'Pruébalo' },
  { id: 'contacto', label: 'Contacto' },
] as const;

/** Timeline vertical izquierda — una entrada por diapositiva del landing. */
export function LandingSpineRail() {
  const [active, setActive] = useState(0);
  const last = SECTIONS.length - 1;
  const progress = last <= 0 ? 0 : (active / last) * 100;

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
      { threshold: [0.15, 0.35, 0.55, 0.75], rootMargin: '-12% 0px -40% 0px' },
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <aside className="landing-spine" aria-label="Progreso de la página">
      <div className="landing-spine-line" aria-hidden>
        <div className="landing-spine-progress" style={{ height: `${progress}%` }} />
      </div>
      <ol className="landing-spine-dots">
        {SECTIONS.map((s, i) => (
          <li
            key={s.id}
            className={`landing-spine-dot ${i === active ? 'is-active' : i < active ? 'is-done' : ''}`}
          >
            <a href={`#${s.id}`} className="landing-spine-hit" title={s.label}>
              <span className="landing-spine-orb" />
              <span className="landing-spine-label">{s.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </aside>
  );
}
