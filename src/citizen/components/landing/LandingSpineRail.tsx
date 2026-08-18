import { useEffect, useState, type ComponentType } from 'react';
import { createPortal } from 'react-dom';
import {
  Cpu,
  LayoutDashboard,
  Boxes,
  Workflow,
  ShieldCheck,
  Building2,
  Code2,
  FlaskConical,
  Mail,
} from 'lucide-react';

type ModuleIcon = ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;

/** Módulos del landing — cada uno con identidad visual propia. */
export const LANDING_MODULES = [
  { id: 'os', label: 'OS', Icon: Cpu },
  { id: 'consola', label: 'Consola', Icon: LayoutDashboard },
  { id: 'modelos', label: 'Modelos', Icon: Boxes },
  { id: 'servicios', label: 'Servicios', Icon: Workflow },
  { id: 'seguridad', label: 'Seguridad', Icon: ShieldCheck },
  { id: 'aplicacion', label: 'Aplicación', Icon: Building2 },
  { id: 'desarrolladores', label: 'Desarrolladores', Icon: Code2 },
  { id: 'sandbox', label: 'Sandbox', Icon: FlaskConical },
  { id: 'contacto', label: 'Contacto', Icon: Mail },
] as const satisfies ReadonlyArray<{ id: string; label: string; Icon: ModuleIcon }>;

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
 * Rail de módulos — icono + label con identidad por sección.
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
        {LANDING_MODULES.map((mod, i) => {
          const Icon = mod.Icon;
          return (
            <li
              key={mod.id}
              className={`landing-module-rail-item ${i === active ? 'is-active' : i < active ? 'is-done' : ''}`}
            >
              <a
                href={`#${mod.id}`}
                className="landing-module-rail-link"
                aria-current={i === active ? 'true' : undefined}
                title={mod.label}
              >
                <span className="landing-module-rail-icon" aria-hidden>
                  <Icon className="landing-module-rail-icon-svg" />
                </span>
                <span className="landing-module-rail-label">{mod.label}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </aside>,
    document.body,
  );
}
