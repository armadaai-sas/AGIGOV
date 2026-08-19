import { Link } from 'react-router-dom';
import { Github, Linkedin } from 'lucide-react';

import { AgigovLogo } from './AgigovLogo.js';
import { usePlatform } from '../context/PlatformContext.js';

const DISCORD_URL = 'https://discord.gg/agigov';
const GITHUB_ORG = 'https://github.com/armadaai-sas';
const X_URL = 'https://x.com/agigov';
const LINKEDIN_URL = 'https://www.linkedin.com/company/agigov';

function IconX({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.263 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function IconDiscord({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

const SOCIAL = [
  { href: GITHUB_ORG, label: 'GitHub', Icon: Github },
  { href: LINKEDIN_URL, label: 'LinkedIn', Icon: Linkedin },
  { href: X_URL, label: 'X', Icon: IconX },
  { href: DISCORD_URL, label: 'Discord', Icon: IconDiscord },
] as const;

/** Footer institucional — mapa producto (estructura n8n, colores AGIGOV). */
export function SiteFooter() {
  const { t } = usePlatform();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer site-footer--map" aria-label="Pie de página">
      <div className="site-footer-map">
        <div className="site-footer-brand-col">
          <AgigovLogo size="md" showWordmark variant="dark" />
          <p className="site-footer-tagline">{t('landing.footer.tagline')}</p>
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
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </nav>
        </div>

        <div className="site-footer-cols">
          <div className="site-footer-col">
            <p className="site-footer-heading">{t('landing.footer.product')}</p>
            <ul>
              <li>
                <Link to="/#os">{t('landing.footer.link.os')}</Link>
              </li>
              <li>
                <Link to="/#consola">{t('landing.footer.link.console')}</Link>
              </li>
              <li>
                <Link to="/#alcance">{t('landing.footer.link.scope')}</Link>
              </li>
              <li>
                <Link to="/#construir">{t('landing.footer.link.build')}</Link>
              </li>
              <li>
                <Link to="/#desplegar">{t('landing.footer.link.deploy')}</Link>
              </li>
            </ul>
          </div>

          <div className="site-footer-col">
            <p className="site-footer-heading">{t('landing.footer.models')}</p>
            <ul>
              <li>
                <Link to="/modelos">{t('landing.footer.link.catalog')}</Link>
              </li>
              <li>
                <Link to="/modelos/egs">{t('landing.footer.link.egs')}</Link>
              </li>
              <li>
                <Link to="/modelos/set">{t('landing.footer.link.set')}</Link>
              </li>
              <li>
                <Link to="/modelos/escrow-institucional">{t('landing.footer.link.escrow')}</Link>
              </li>
            </ul>
          </div>

          <div className="site-footer-col">
            <p className="site-footer-heading">{t('landing.footer.deploy')}</p>
            <ul>
              <li>
                <Link to="/#desplegar">{t('landing.footer.link.cloud')}</Link>
              </li>
              <li>
                <Link to="/#desplegar">{t('landing.footer.link.local')}</Link>
              </li>
              <li>
                <Link to="/#seguridad">{t('landing.footer.link.security')}</Link>
              </li>
              <li>
                <Link to="/#seguridad">{t('landing.footer.link.pqc')}</Link>
              </li>
            </ul>
          </div>

          <div className="site-footer-col">
            <p className="site-footer-heading">{t('landing.footer.community')}</p>
            <ul>
              <li>
                <Link to="/#desarrolladores">{t('landing.footer.link.devs')}</Link>
              </li>
              <li>
                <a href={`${GITHUB_ORG}/Armada-VZLA`} target="_blank" rel="noopener noreferrer">
                  {t('landing.footer.link.github')}
                </a>
              </li>
              <li>
                <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer">
                  {t('landing.footer.link.discord')}
                </a>
              </li>
              <li>
                <Link to="/institucional#protocolo">{t('landing.footer.link.docs')}</Link>
              </li>
            </ul>
          </div>

          <div className="site-footer-col">
            <p className="site-footer-heading">{t('landing.footer.help')}</p>
            <ul>
              <li>
                <Link to="/ayuda">{t('landing.footer.link.help')}</Link>
              </li>
              <li>
                <Link to="/aprender/glosario">{t('landing.footer.link.glossary')}</Link>
              </li>
              <li>
                <Link to="/#contacto">{t('landing.footer.link.contact')}</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="site-footer-bottom">
        <p>{t('landing.footer.legal', { year: String(year) })}</p>
      </div>
    </footer>
  );
}
