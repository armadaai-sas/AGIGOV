import { Navigate } from 'react-router-dom';

import { breadcrumbsForPath } from '../components/AppBreadcrumbs.js';
import { InstitutionRegistrationForm } from '../components/institutional/InstitutionRegistrationForm.js';
import { PageShell, SectionHeader } from '../components/PageShell.js';
import { useSovereignConfig } from '../context/PlatformContext.js';
import { useInstitutionAuth } from '../institutional/useInstitutionAuth.js';
import { INSTITUTION_ROUTES } from '../platform/institutionalRoutes.js';

/** Registro institucional — paso 1 para probar el modelo. */
export default function InstitutionRegisterPage() {
  const { t } = useSovereignConfig();
  const { isAuthenticated } = useInstitutionAuth();

  if (isAuthenticated) {
    return <Navigate to={INSTITUTION_ROUTES.pilot} replace />;
  }

  return (
    <PageShell narrow={false} breadcrumbs={breadcrumbsForPath('/institucional/registro')}>
      <SectionHeader
        eyebrow={t('reg.kicker')}
        title={t('reg.title')}
        lead={t('reg.lead')}
        helpTopic="institucional"
      />
      <InstitutionRegistrationForm />
    </PageShell>
  );
}
