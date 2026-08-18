import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Youtube } from 'lucide-react';

import { AgigovLogo } from './AgigovLogo.js';

const SOCIAL = [
  { href: 'https://github.com/armadaai-sas', label: 'GitHub', Icon: Github },
  { href: 'https://www.linkedin.com/company/agigov', label: 'LinkedIn', Icon: Linkedin },
  { href: 'https://x.com/agigov', label: 'X', Icon: Twitter },
  { href: 'https://www.youtube.com/@agigov', label: 'YouTube', Icon: Youtube },
] as const;

/** Footer institucional — marca, redes, 3 columnas (sin Acceso). */
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

      <div className="site-footer-inner site-footer-inner--three">
        <div className="site-footer-col">
          <p className="site-footer-heading">Producto</p>
          <ul>
            <li>
              <Link to="/#os">OS</Link>
            </li>
            <li>
              <Link to="/#consola">Consola</Link>
            </li>
            <li>
              <Link to="/#modelos">Modelos</Link>
            </li>
            <li>
              <Link to="/#pruebalo">Pruébalo</Link>
            </li>
          </ul>
        </div>

        <div className="site-footer-col">
          <p className="site-footer-heading">Comunidad</p>
          <ul>
            <li>
              <Link to="/#desarrolladores">Desarrolladores</Link>
            </li>
            <li>
              <a href="https://github.com/armadaai-sas/Armada-VZLA" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <Link to="/institucional#protocolo">Documentación</Link>
            </li>
          </ul>
        </div>

        <div className="site-footer-col">
          <p className="site-footer-heading">Ayuda</p>
          <ul>
            <li>
              <Link to="/ayuda">Centro de ayuda</Link>
            </li>
            <li>
              <Link to="/aprender/glosario">Glosario</Link>
            </li>
            <li>
              <Link to="/#contacto">Contacto</Link>
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
