import { InstitutionAlreadyLoggedIn } from '../components/institutional/InstitutionAlreadyLoggedIn.js';
import { InstitutionRegistrationForm } from '../components/institutional/InstitutionRegistrationForm.js';
import { PageShell } from '../components/PageShell.js';
import { useSovereignConfig } from '../context/PlatformContext.js';
import { useInstitutionAuth } from '../institutional/useInstitutionAuth.js';

export default function InstitutionRegisterPage() {
  const { t } = useSovereignConfig();
  const { isAuthenticated, authReady } = useInstitutionAuth();

  return (
    <PageShell shell narrow>
      <div className="os-workspace">
        <header className="os-workspace-head os-workspace-head--stack">
          <div className="os-workspace-head-text">
            <h1 className="os-workspace-title">{t('reg.title')}</h1>
            <p className="os-workspace-sub">{t('reg.lead')}</p>
          </div>
        </header>

        {!authReady ? (
          <p className="inst-auth-card inst-auth-card--busy">{t('auth.redirecting')}</p>
        ) : isAuthenticated ? (
          <InstitutionAlreadyLoggedIn />
        ) : (
          <InstitutionRegistrationForm />
        )}
      </div>
    </PageShell>
  );
}
