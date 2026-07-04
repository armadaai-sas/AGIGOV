import { Link } from 'react-router-dom';

import { AgigovLogo } from './AgigovLogo.js';

const EXPLORE = [
  { to: '/gestion', label: 'Gestión pública' },
  { to: '/propuestas', label: 'Propuestas' },
  { to: '/proyectos', label: 'Proyectos' },
  { to: '/suministros', label: 'Suministros' },
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer" aria-label="Pie de página">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <AgigovLogo size="sm" showWordmark />
          <p className="site-footer-tagline">
            Organización oficial AGIGOV. Modelo genérico e implementaciones nacionales para
            Estado, política y economía verificables.
          </p>
        </div>

        <div className="site-footer-col">
          <p className="site-footer-heading">Modelo</p>
          <ul>
            <li>
              <Link to="/#modelo">Gobernanza 2.0</Link>
            </li>
            <li>
              <Link to="/institucional#protocolo">Protocolo genérico</Link>
            </li>
            <li>
              <Link to="/modelos">Catálogo de modelos</Link>
            </li>
          </ul>
        </div>

        <div className="site-footer-col">
          <p className="site-footer-heading">Aprender</p>
          <ul>
            <li>
              <Link to="/#modelo">Gobernanza 2.0</Link>
            </li>
            <li>
              <Link to="/#flujo">Cómo funciona</Link>
            </li>
            <li>
              <Link to="/ayuda">Centro de ayuda</Link>
            </li>
            <li>
              <Link to="/aprender/glosario">Glosario</Link>
            </li>
            <li>
              <Link to="/#aprender">Guías completas</Link>
            </li>
          </ul>
        </div>

        <div className="site-footer-col">
          <p className="site-footer-heading">Explorar</p>
          <ul>
            {EXPLORE.map(({ to, label }) => (
              <li key={to}>
                <Link to={to}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="site-footer-col">
          <p className="site-footer-heading">Acceso</p>
          <ul>
            <li>
              <Link to="/participar">Enviar propuesta</Link>
            </li>
            <li>
              <Link to="/institucional#concierge">Concierge para gobiernos</Link>
            </li>
            <li>
              <Link to="/institucional#protocolo">Documentación técnica</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="site-footer-bottom">
        <p>© {new Date().getFullYear()} AGIGOV · Evidencia publicada, decisiones trazables</p>
      </div>
    </footer>
  );
}
