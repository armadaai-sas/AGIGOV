import { Navigate } from 'react-router-dom';

import { breadcrumbsForPath } from '../components/AppBreadcrumbs.js';
import { InstitutionLoginForm } from '../components/institutional/InstitutionLoginForm.js';
import { PageShell, SectionHeader } from '../components/PageShell.js';
import { useSovereignConfig } from '../context/PlatformContext.js';
import { useInstitutionAuth } from '../institutional/useInstitutionAuth.js';
import { INSTITUTION_ROUTES } from '../platform/institutionalRoutes.js';

/** Inicio de sesión institucional — paso 2 tras registro. */
export default function InstitutionAccessPage() {
  const { t } = useSovereignConfig();
  const { isAuthenticated } = useInstitutionAuth();

  if (isAuthenticated) {
    return <Navigate to={INSTITUTION_ROUTES.pilot} replace />;
  }

  return (
    <PageShell narrow={false} breadcrumbs={breadcrumbsForPath('/institucional/acceso')}>
      <SectionHeader
        eyebrow={t('auth.kicker')}
        title={t('auth.title')}
        lead={t('auth.lead')}
        helpTopic="institucional"
      />
      <InstitutionLoginForm />
    </PageShell>
  );
}
