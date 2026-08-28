import { InstitutionAlreadyLoggedIn } from '../components/institutional/InstitutionAlreadyLoggedIn.js';
import { InstitutionLoginForm } from '../components/institutional/InstitutionLoginForm.js';
import { PageShell } from '../components/PageShell.js';
import { useSovereignConfig } from '../context/PlatformContext.js';
import { useInstitutionAuth } from '../institutional/useInstitutionAuth.js';

export default function InstitutionAccessPage() {
  const { t } = useSovereignConfig();
  const { isAuthenticated } = useInstitutionAuth();

  return (
    <PageShell shell narrow>
      <div className="os-workspace">
        <header className="os-workspace-head os-workspace-head--stack">
          <div className="os-workspace-head-text">
            <h1 className="os-workspace-title">{t('auth.title')}</h1>
            <p className="os-workspace-sub">{t('auth.lead')}</p>
          </div>
        </header>

        {isAuthenticated ? <InstitutionAlreadyLoggedIn /> : <InstitutionLoginForm />}
      </div>
    </PageShell>
  );
}
