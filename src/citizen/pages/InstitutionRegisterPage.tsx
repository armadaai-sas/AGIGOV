import { InstitutionAlreadyLoggedIn } from '../components/institutional/InstitutionAlreadyLoggedIn.js';
import { InstitutionRegistrationForm } from '../components/institutional/InstitutionRegistrationForm.js';
import { InstitutionTrialSteps } from '../components/institutional/InstitutionTrialSteps.js';
import { LoadingState } from '../components/PageShell.js';
import { PageShell } from '../components/PageShell.js';
import { useSovereignConfig } from '../context/PlatformContext.js';
import { useInstitutionAuth } from '../institutional/useInstitutionAuth.js';

/** Alta para probar EGS — cuenta propia + datos Q1 automáticos. */
export default function InstitutionRegisterPage() {
  const { t } = useSovereignConfig();
  const { isAuthenticated, authReady } = useInstitutionAuth();

  return (
    <PageShell shell narrow>
      <div className="inst-auth-page">
        <header className="inst-auth-page-head">
          <p className="inst-auth-kicker">{t('trial.kicker')}</p>
          <h1 className="inst-auth-title">{t('trial.title')}</h1>
          <p className="inst-auth-lead">{t('trial.lead')}</p>
        </header>

        <InstitutionTrialSteps active={0} />

        {!authReady ? (
          <LoadingState label={t('auth.redirecting')} />
        ) : isAuthenticated ? (
          <InstitutionAlreadyLoggedIn />
        ) : (
          <InstitutionRegistrationForm mode="trial" />
        )}
      </div>
    </PageShell>
  );
}
