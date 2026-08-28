import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

/** Desplaza suavemente al inicio al cambiar de ruta. */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const tryScroll = (attempt = 0) => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
        if (attempt < 8) window.setTimeout(() => tryScroll(attempt + 1), 50);
      };
      tryScroll();
      return;
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return null;
}

/** Entrada suave al navegar — sin remount por ruta. */
export function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  if (pathname === '/') {
    return children;
  }

  return <div className="agigov-page-transition">{children}</div>;
}
