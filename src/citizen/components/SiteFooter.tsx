import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Youtube } from 'lucide-react';

import { AgigovLogo } from './AgigovLogo.js';

const EXPLORE = [
  { to: '/gestion', label: 'Gestión pública' },
  { to: '/propuestas', label: 'Propuestas' },
  { to: '/proyectos', label: 'Proyectos' },
  { to: '/suministros', label: 'Suministros' },
] as const;

const SOCIAL = [
  { href: 'https://github.com/armadaai-sas', label: 'GitHub', Icon: Github },
  { href: 'https://www.linkedin.com/company/agigov', label: 'LinkedIn', Icon: Linkedin },
  { href: 'https://x.com/agigov', label: 'X', Icon: Twitter },
  { href: 'https://www.youtube.com/@agigov', label: 'YouTube', Icon: Youtube },
] as const;

/** Footer institucional centrado — marca, redes y columnas de rutas. */
export function SiteFooter() {
  return (
    <footer className="site-footer site-footer--institutional" aria-label="Pie de página">
      <div className="site-footer-top">
        <div className="site-footer-brand-block">
          <AgigovLogo size="md" showWordmark variant="dark" />
          <p className="site-footer-tagline">Evidencia publicada. Decisiones trazables.</p>
          <nav className="site-footer-social" aria-label="Redes sociales">
            {SOCIAL.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="site-footer-social-link"
                aria-label={label}
              >
                <Icon className="h-4 w-4" aria-hidden />
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="site-footer-inner site-footer-inner--cols">
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
              <Link to="/#flujo">Cómo funciona</Link>
            </li>
            <li>
              <Link to="/ayuda">Centro de ayuda</Link>
            </li>
            <li>
              <Link to="/aprender/glosario">Glosario</Link>
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
              <Link to="/institucional/registro">Cuenta institucional</Link>
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
        <p>© {new Date().getFullYear()} AGIGOV · Organización oficial · Evidencia publicada</p>
      </div>
    </footer>
  );
}
