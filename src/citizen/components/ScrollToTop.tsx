import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

/** Desplaza suavemente al inicio al cambiar de ruta. */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, hash]);

  return null;
}

/** Entrada suave al navegar — sin wrapper en home (evita pelear con nav/rail fixed). */
export function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  if (pathname === '/') {
    return children;
  }

  return (
    <div key={pathname} className="agigov-page-transition">
      {children}
    </div>
  );
}
