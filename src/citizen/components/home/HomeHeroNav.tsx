import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Github } from 'lucide-react';

import { AgigovLogo } from '../AgigovLogo.js';
import { useSovereignConfig } from '../../context/PlatformContext.js';
import { useInstitutionAuth } from '../../institutional/useInstitutionAuth.js';
import { INSTITUTION_ROUTES } from '../../platform/institutionalRoutes.js';

const GITHUB_REPO = 'https://github.com/armadaai-sas/Armada-VZLA';

/** Header fijo: logo · GitHub · Registro. */
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
    <header className={`ls-nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="ls-nav-bar">
        <Link to="/" className="ls-nav-logo" aria-label={t('nav.home')}>
          <AgigovLogo size="sm" showWordmark variant="dark" />
        </Link>

        <div className="ls-nav-actions">
          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="ls-nav-github"
            aria-label="GitHub"
            title="GitHub"
          >
            <Github className="h-[1.15rem] w-[1.15rem]" aria-hidden />
          </a>
          <Link
            to={isAuthenticated ? INSTITUTION_ROUTES.pilot : INSTITUTION_ROUTES.register}
            className="ls-nav-register"
          >
            {isAuthenticated ? t('nav.myPilot') : t('nav.register')}
          </Link>
        </div>
      </div>
    </header>
  );
}
