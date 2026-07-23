import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { breadcrumbsForPath } from '../components/AppBreadcrumbs.js';
import { InstitutionPilotErrorBoundary } from '../components/institutional/InstitutionPilotErrorBoundary.js';
import { InstitutionPilotWizard } from '../components/institutional/InstitutionPilotWizard.js';
import { LoadingState, PageShell, SectionHeader } from '../components/PageShell.js';
import { useSovereignConfig } from '../context/PlatformContext.js';
import { InstitutionPilotProvider } from '../institutional/InstitutionPilotContext.js';
import { useInstitutionAuth } from '../institutional/useInstitutionAuth.js';
import { INSTITUTION_ROUTES } from '../platform/institutionalRoutes.js';

/** Piloto institucional EGS — requiere registro + sesión activa. */
export default function InstitutionPilotPage() {
  const { t } = useSovereignConfig();
  const navigate = useNavigate();
  const { isRegistered, isAuthenticated } = useInstitutionAuth();

  useEffect(() => {
    if (!isRegistered) {
      navigate(INSTITUTION_ROUTES.register, { replace: true });
      return;
    }
    if (!isAuthenticated) {
      navigate(INSTITUTION_ROUTES.login, { replace: true, state: { from: INSTITUTION_ROUTES.pilot } });
    }
  }, [isRegistered, isAuthenticated, navigate]);

  if (!isRegistered || !isAuthenticated) {
    return (
      <PageShell narrow={false}>
        <LoadingState label={t('auth.redirecting')} />
      </PageShell>
    );
  }

  return (
    <PageShell narrow={false} breadcrumbs={breadcrumbsForPath('/institucional/piloto')}>
      <SectionHeader
        eyebrow={t('pilot.wizard.kicker')}
        title={t('pilot.wizard.title')}
        lead={t('pilot.wizard.lead')}
        helpTopic="institucional"
      />
      <InstitutionPilotProvider>
        <InstitutionPilotErrorBoundary>
          <InstitutionPilotWizard />
        </InstitutionPilotErrorBoundary>
      </InstitutionPilotProvider>
    </PageShell>
  );
}
