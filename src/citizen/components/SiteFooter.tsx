import { Link } from 'react-router-dom';

import { AgigovLogo } from './AgigovLogo.js';
import { IconDiscord, IconGitHub, IconX, IconYouTube } from './SocialBrandIcons.js';
import { usePlatform } from '../context/PlatformContext.js';
import { INSTITUTION_ROUTES } from '../platform/institutionalRoutes.js';
import { SOCIAL_LINKS } from '../platform/socialLinks.js';

const SOCIAL_ITEMS = [
  { href: SOCIAL_LINKS.x, labelKey: 'landing.footer.link.x' as const, Icon: IconX },
  { href: SOCIAL_LINKS.youtube, labelKey: 'landing.footer.link.youtube' as const, Icon: IconYouTube },
  { href: SOCIAL_LINKS.github, labelKey: 'landing.footer.link.github' as const, Icon: IconGitHub },
  { href: SOCIAL_LINKS.discord, labelKey: 'landing.footer.link.discord' as const, Icon: IconDiscord },
];

/** Footer del landing — aislado de estilos globales oscuros. */
export function SiteFooter() {
  const { t } = usePlatform();
  const year = new Date().getFullYear();

  return (
    <footer className="ls-footer" aria-label="Pie de página">
      <div className="ls-footer-rule" aria-hidden />
      <div className="ls-min-inner ls-footer-inner">
        <div className="ls-footer-main">
          <div className="ls-footer-brand">
            <AgigovLogo size="sm" showWordmark variant="light" />
            <p className="ls-footer-tagline">{t('landing.footer.tagline')}</p>
          </div>

          <nav className="ls-footer-links" aria-label="Enlaces">
            <Link to={INSTITUTION_ROUTES.desk}>{t('landing.footer.link.desk')}</Link>
            <Link to="/modelos">{t('landing.footer.link.modelsAll')}</Link>
            <Link to="/descargar">{t('landing.footer.link.desktop')}</Link>
            <Link to="/ayuda">{t('landing.footer.link.help')}</Link>
            <Link to="/desarrolladores">{t('landing.footer.link.devs')}</Link>
          </nav>

          <nav className="ls-footer-social" aria-label={t('landing.footer.community')}>
            {SOCIAL_ITEMS.map(({ href, labelKey, Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="ls-footer-social-link"
                aria-label={t(labelKey)}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </nav>
        </div>

        <p className="ls-footer-legal">{t('landing.footer.legal', { year: String(year) })}</p>
      </div>
    </footer>
  );
}
