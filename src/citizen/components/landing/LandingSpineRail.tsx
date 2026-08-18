import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/** Módulos del landing — cada uno es una “página” full-viewport. */
export const LANDING_MODULES = [
  { id: 'os', label: 'OS' },
  { id: 'consola', label: 'Consola' },
  { id: 'modelos', label: 'Modelos' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'seguridad', label: 'Seguridad' },
  { id: 'aplicacion', label: 'Aplicación' },
  { id: 'desarrolladores', label: 'Desarrolladores' },
  { id: 'sandbox', label: 'Sandbox' },
  { id: 'contacto', label: 'Contacto' },
] as const;

function activeModuleIndex(): number {
  const mid = window.innerHeight * 0.35;
  let best = 0;
  let bestDist = Number.POSITIVE_INFINITY;

  for (let i = 0; i < LANDING_MODULES.length; i++) {
    const el = document.getElementById(LANDING_MODULES[i]!.id);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    const center = rect.top + rect.height * 0.25;
    const dist = Math.abs(center - mid);
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  }
  return best;
}

/**
 * Rail de módulos tipo Railway — fijo al viewport (portal a body),
 * scroll-spy por geometría (no depende de IntersectionObserver + lazy).
 */
export function LandingSpineRail() {
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const last = LANDING_MODULES.length - 1;
  const progress = last <= 0 ? 0 : (active / last) * 100;

  useEffect(() => {
    setMounted(true);
    let raf = 0;
    const tick = () => {
      setActive(activeModuleIndex());
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    // Re-scan when lazy sections mount
    const mo = new MutationObserver(onScroll);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      mo.disconnect();
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <aside className="landing-module-rail" aria-label="Módulos del producto">
      <div className="landing-module-rail-track" aria-hidden>
        <div className="landing-module-rail-progress" style={{ height: `${progress}%` }} />
      </div>
      <ol className="landing-module-rail-list">
        {LANDING_MODULES.map((mod, i) => (
          <li
            key={mod.id}
            className={`landing-module-rail-item ${i === active ? 'is-active' : i < active ? 'is-done' : ''}`}
          >
            <a href={`#${mod.id}`} className="landing-module-rail-link" aria-current={i === active ? 'true' : undefined}>
              <span className="landing-module-rail-orb" />
              <span className="landing-module-rail-index">{String(i + 1).padStart(2, '0')}</span>
              <span className="landing-module-rail-label">{mod.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </aside>,
    document.body,
  );
}
