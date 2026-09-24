import { Link } from 'react-router-dom';

import { AgigovLogo } from '../components/AgigovLogo.js';
import { InstitutionAlreadyLoggedIn } from '../components/institutional/InstitutionAlreadyLoggedIn.js';
import { InstitutionLoginForm } from '../components/institutional/InstitutionLoginForm.js';
import { LoadingState } from '../components/PageShell.js';
import { PageShell } from '../components/PageShell.js';
import { useSovereignConfig } from '../context/PlatformContext.js';
import { useInstitutionAuth } from '../institutional/useInstitutionAuth.js';
import { INSTITUTION_ROUTES } from '../platform/institutionalRoutes.js';

export default function InstitutionAccessPage() {
  const { t } = useSovereignConfig();
  const { isAuthenticated, authReady } = useInstitutionAuth();

  return (
    <PageShell shell>
      <div className="inst-auth-split">
        <aside className="inst-auth-aside">
          <AgigovLogo size="sm" variant="light" showWordmark />
          <h1 className="inst-auth-aside-title">{t('auth.title')}</h1>
          <p className="inst-auth-aside-lead">{t('auth.lead')}</p>
        </aside>
      <div className="inst-auth-page">

        {!authReady ? (
          <LoadingState label={t('auth.redirecting')} />
        ) : isAuthenticated ? (
          <InstitutionAlreadyLoggedIn />
        ) : (
          <>
            <p className="inst-auth-trial-cta">
              {t('trial.newUser')}{' '}
              <Link to={INSTITUTION_ROUTES.register}>{t('trial.cta')}</Link>
            </p>
            <InstitutionLoginForm />
          </>
        )}
      </div>
      </div>
    </PageShell>
  );
}
