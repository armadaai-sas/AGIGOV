import { AuthStage } from '../components/institutional/AuthStage.js';
import { InstitutionAlreadyLoggedIn } from '../components/institutional/InstitutionAlreadyLoggedIn.js';
import { InstitutionLoginForm } from '../components/institutional/InstitutionLoginForm.js';
import { LoadingState } from '../components/PageShell.js';
import { useSovereignConfig } from '../context/PlatformContext.js';
import { useInstitutionAuth } from '../institutional/useInstitutionAuth.js';

/** Acceso — el mismo relato por rol que el registro. */
export default function InstitutionAccessPage() {
  const { t } = useSovereignConfig();
  const { isAuthenticated, authReady } = useInstitutionAuth();

  return (
    <AuthStage mode="login">
      {!authReady ? (
        <LoadingState label={t('auth.redirecting')} />
      ) : isAuthenticated ? (
        <InstitutionAlreadyLoggedIn />
      ) : (
        <InstitutionLoginForm />
      )}
    </AuthStage>
  );
}
