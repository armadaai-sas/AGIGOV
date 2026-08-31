import { Link } from 'react-router-dom';

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
    <PageShell shell narrow>
      <div className="inst-auth-page">
        <header className="inst-auth-page-head">
          <p className="inst-auth-kicker">{t('auth.kicker')}</p>
          <h1 className="inst-auth-title">{t('auth.title')}</h1>
          <p className="inst-auth-lead">{t('auth.lead')}</p>
        </header>

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
    </PageShell>
  );
}
