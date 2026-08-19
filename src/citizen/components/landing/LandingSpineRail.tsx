import { useEffect, useState, type ComponentType } from 'react';
import { createPortal } from 'react-dom';
import {
  Cpu,
  LayoutDashboard,
  Compass,
  Boxes,
  Workflow,
  Shield,
  BookOpen,
  Code2,
  FlaskConical,
  Mail,
} from 'lucide-react';

type ModuleIcon = ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;

export const LANDING_MODULES = [
  { id: 'os', label: 'OS', Icon: Cpu },
  { id: 'consola', label: 'Consola', Icon: LayoutDashboard },
  { id: 'alcance', label: 'Alcance', Icon: Compass },
  { id: 'modelos', label: 'Modelos', Icon: Boxes },
  { id: 'operacion', label: 'Operación', Icon: Workflow },
  { id: 'seguridad', label: 'Seguridad', Icon: Shield },
  { id: 'aprender', label: 'Aprende', Icon: BookOpen },
  { id: 'desarrolladores', label: 'Devs', Icon: Code2 },
  { id: 'sandbox', label: 'Sandbox', Icon: FlaskConical },
  { id: 'contacto', label: 'Contacto', Icon: Mail },
] as const satisfies ReadonlyArray<{ id: string; label: string; Icon: ModuleIcon }>;

function activeModuleIndex(): number {
  const mid = window.innerHeight * 0.32;
  let best = 0;
  let bestDist = Number.POSITIVE_INFINITY;

  for (let i = 0; i < LANDING_MODULES.length; i++) {
    const el = document.getElementById(LANDING_MODULES[i]!.id);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    const center = rect.top + rect.height * 0.2;
    const dist = Math.abs(center - mid);
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  }
  return best;
}

/** Rail XL: icono + label siempre visibles. */
export function LandingSpineRail() {
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const last = LANDING_MODULES.length - 1;
  const progress = last <= 0 ? 0 : (active / last) * 100;

  useEffect(() => {
    setMounted(true);
    let raf = 0;
    const tick = () => setActive(activeModuleIndex());
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <aside className="ls-rail" aria-label="Módulos del producto">
      <div className="ls-rail-track" aria-hidden>
        <div className="ls-rail-progress" style={{ height: `${progress}%` }} />
      </div>
      <ol className="ls-rail-list">
        {LANDING_MODULES.map((mod, i) => {
          const Icon = mod.Icon;
          return (
            <li
              key={mod.id}
              className={`ls-rail-item ${i === active ? 'is-active' : i < active ? 'is-done' : ''}`}
            >
              <a
                href={`#${mod.id}`}
                className="ls-rail-link"
                title={mod.label}
                aria-current={i === active ? 'true' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(mod.id)?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  });
                  window.history.replaceState(null, '', `#${mod.id}`);
                }}
              >
                <span className="ls-rail-icon" aria-hidden>
                  <Icon />
                </span>
                <span className="ls-rail-label">{mod.label}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </aside>,
    document.body,
  );
}
