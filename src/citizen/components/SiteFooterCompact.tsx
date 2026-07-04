import { Link } from 'react-router-dom';

import { AgigovLogo } from './AgigovLogo.js';

/** Pie mínimo en páginas de la app (Fase B). */
export function SiteFooterCompact() {
  return (
    <footer className="site-footer-compact" aria-label="Pie de página">
      <div className="site-footer-compact-inner">
        <Link to="/" className="site-footer-compact-brand">
          <AgigovLogo size="sm" />
          <span>AGIGOV</span>
        </Link>
        <nav className="site-footer-compact-nav" aria-label="Enlaces útiles">
          <Link to="/ayuda">Centro de ayuda</Link>
          <Link to="/aprender/glosario">Glosario</Link>
          <Link to="/institucional#protocolo">Protocolo</Link>
          <Link to="/institucional">Institucional</Link>
        </nav>
        <p className="site-footer-compact-copy">
          © {new Date().getFullYear()} AGIGOV
        </p>
      </div>
    </footer>
  );
}
