import { AgigovLogo } from '../components/AgigovLogo.js';
import { InstitutionAlreadyLoggedIn } from '../components/institutional/InstitutionAlreadyLoggedIn.js';
import { InstitutionRegistrationForm } from '../components/institutional/InstitutionRegistrationForm.js';
import { LoadingState } from '../components/PageShell.js';
import { PageShell } from '../components/PageShell.js';
import { useSovereignConfig } from '../context/PlatformContext.js';
import { useInstitutionAuth } from '../institutional/useInstitutionAuth.js';

/** Alta para probar EGS — cuenta propia + datos Q1 automáticos. */
export default function InstitutionRegisterPage() {
  const { t } = useSovereignConfig();
  const { isAuthenticated, authReady } = useInstitutionAuth();

  return (
    <PageShell shell>
      <div className="inst-auth-split">
        <aside className="inst-auth-aside">
          <AgigovLogo size="sm" variant="light" showWordmark />
          <h1 className="inst-auth-aside-title">{t('trial.title')}</h1>
          <p className="inst-auth-aside-lead">{t('trial.lead')}</p>
        </aside>
      <div className="inst-auth-page">

        {!authReady ? (
          <LoadingState label={t('auth.redirecting')} />
        ) : isAuthenticated ? (
          <InstitutionAlreadyLoggedIn />
        ) : (
          <InstitutionRegistrationForm mode="trial" />
        )}
      </div>
      </div>
    </PageShell>
  );
}
