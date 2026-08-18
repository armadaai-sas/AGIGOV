import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Github } from 'lucide-react';

import { AgigovLogo } from '../AgigovLogo.js';
import { useSovereignConfig } from '../../context/PlatformContext.js';
import { useInstitutionAuth } from '../../institutional/useInstitutionAuth.js';
import { INSTITUTION_ROUTES } from '../../platform/institutionalRoutes.js';

const GITHUB_REPO = 'https://github.com/armadaai-sas/Armada-VZLA';

/** Header mínimo: logo · GitHub · Registro (sesión dentro del flujo de registro). */
export function HomeHeroNav() {
  const [scrolled, setScrolled] = useState(false);
  const { t } = useSovereignConfig();
  const { isAuthenticated } = useInstitutionAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`hero-trust-nav hero-trust-nav--navy hero-trust-nav--minimal ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="hero-trust-nav-inner hero-trust-nav-inner--minimal">
        <Link to="/" className="hero-trust-nav-logo" aria-label={t('nav.home')}>
          <AgigovLogo size="sm" showWordmark variant="dark" />
        </Link>

        <div className="hero-trust-nav-actions">
          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-trust-nav-github"
            aria-label="GitHub"
            title="GitHub"
          >
            <Github className="hero-trust-nav-github-icon" aria-hidden />
          </a>
          <Link
            to={isAuthenticated ? INSTITUTION_ROUTES.pilot : INSTITUTION_ROUTES.register}
            className="hero-trust-nav-register"
          >
            {isAuthenticated ? t('nav.myPilot') : t('nav.register')}
          </Link>
        </div>
      </div>
    </header>
  );
}
