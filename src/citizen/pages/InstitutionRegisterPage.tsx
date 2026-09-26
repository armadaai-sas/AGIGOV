import { InstitutionAlreadyLoggedIn } from '../components/institutional/InstitutionAlreadyLoggedIn.js';
import { InstitutionRegistrationForm } from '../components/institutional/InstitutionRegistrationForm.js';
import { AuthStage } from '../components/institutional/AuthStage.js';
import { LoadingState } from '../components/PageShell.js';
import { useSovereignConfig } from '../context/PlatformContext.js';
import { useInstitutionAuth } from '../institutional/useInstitutionAuth.js';

/** Alta — tarjeta de cuenta. El escritorio se elige dentro del formulario. */
export default function InstitutionRegisterPage() {
  const { t } = useSovereignConfig();
  const { isAuthenticated, authReady } = useInstitutionAuth();

  return (
    <AuthStage mode="register">
      {!authReady ? (
        <LoadingState label={t('auth.redirecting')} />
      ) : isAuthenticated ? (
        <InstitutionAlreadyLoggedIn />
      ) : (
        <InstitutionRegistrationForm mode="trial" />
      )}
    </AuthStage>
  );
}
