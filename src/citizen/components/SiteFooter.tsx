import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';

import { AgigovLogo } from './AgigovLogo.js';
import { usePlatform } from '../context/PlatformContext.js';
import { INSTITUTION_ROUTES } from '../platform/institutionalRoutes.js';

const GITHUB_ORG = 'https://github.com/armadaai-sas';

type Props = {
  minimal?: boolean;
};

/** Footer — mapa completo o fila mínima en landing. */
export function SiteFooter({ minimal = false }: Props) {
  const { t } = usePlatform();
  const year = new Date().getFullYear();

  if (minimal) {
    return (
      <footer className="site-footer site-footer--minimal" aria-label="Pie de página">
        <div className="site-footer-map ls-min-inner">
          <AgigovLogo size="md" showWordmark variant="light" />
          <p className="site-footer-tagline">{t('landing.footer.tagline')}</p>
          <nav className="site-footer-links-row" aria-label="Enlaces">
            <Link to={INSTITUTION_ROUTES.desk}>{t('landing.footer.link.desk')}</Link>
            <Link to="/modelos">{t('landing.footer.link.modelsAll')}</Link>
            <Link to="/descargar">{t('landing.footer.link.desktop')}</Link>
            <Link to="/ayuda">{t('landing.footer.link.help')}</Link>
            <Link to="/desarrolladores">{t('landing.footer.link.devs')}</Link>
            <Link to={INSTITUTION_ROUTES.register}>{t('landing.footer.link.deploy')}</Link>
            <a href={GITHUB_ORG} target="_blank" rel="noopener noreferrer">
              {t('landing.footer.link.github')}
            </a>
          </nav>
          <div className="site-footer-bottom">
            <p>{t('landing.footer.legal', { year: String(year) })}</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="site-footer site-footer--map" aria-label="Pie de página">
      <div className="site-footer-map">
        <div className="site-footer-brand-col">
          <AgigovLogo size="md" showWordmark variant="light" />
          <p className="site-footer-tagline">{t('landing.footer.tagline')}</p>
          <nav className="site-footer-social" aria-label="Código y comunidad">
            <a
              href={GITHUB_ORG}
              target="_blank"
              rel="noopener noreferrer"
              className="site-footer-social-link"
              aria-label={t('landing.footer.link.github')}
            >
              <Github className="h-4 w-4" />
            </a>
          </nav>
        </div>

        <div className="site-footer-cols">
          <div className="site-footer-col">
            <p className="site-footer-heading">{t('landing.footer.product')}</p>
            <ul>
              <li>
                <Link to={INSTITUTION_ROUTES.desk}>{t('landing.footer.link.desk')}</Link>
              </li>
              <li>
                <Link to="/modelos/egs/espacio">{t('landing.footer.link.egsConsole')}</Link>
              </li>
              <li>
                <Link to="/gestion">{t('landing.footer.link.ledger')}</Link>
              </li>
            </ul>
          </div>

          <div className="site-footer-col">
            <p className="site-footer-heading">{t('landing.footer.models')}</p>
            <ul>
              <li>
                <Link to="/modelos">{t('landing.footer.link.modelsAll')}</Link>
              </li>
              <li>
                <Link to="/modelos/egs">{t('landing.footer.link.egs')}</Link>
              </li>
            </ul>
          </div>

          <div className="site-footer-col">
            <p className="site-footer-heading">{t('landing.footer.citizen')}</p>
            <ul>
              <li>
                <Link to="/participar">{t('landing.footer.link.participate')}</Link>
              </li>
              <li>
                <Link to="/propuestas">{t('landing.footer.link.proposals')}</Link>
              </li>
            </ul>
          </div>

          <div className="site-footer-col">
            <p className="site-footer-heading">{t('landing.footer.start')}</p>
            <ul>
              <li>
                <Link to={INSTITUTION_ROUTES.register}>{t('landing.footer.link.deploy')}</Link>
              </li>
              <li>
                <Link to={INSTITUTION_ROUTES.login}>{t('landing.footer.link.access')}</Link>
              </li>
              <li>
                <Link to="/#contacto">{t('landing.footer.link.contact')}</Link>
              </li>
            </ul>
          </div>

          <div className="site-footer-col">
            <p className="site-footer-heading">{t('landing.footer.resources')}</p>
            <ul>
              <li>
                <Link to="/descargar">App de escritorio</Link>
              </li>
              <li>
                <Link to="/ayuda">{t('landing.footer.link.help')}</Link>
              </li>
              <li>
                <Link to="/desarrolladores">{t('landing.footer.link.devs')}</Link>
              </li>
              <li>
                <Link to="/aprender/glosario">{t('landing.footer.link.glossary')}</Link>
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
