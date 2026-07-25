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

/** Piloto institucional EGS — requiere sesión server activa. */
export default function InstitutionPilotPage() {
  const { t } = useSovereignConfig();
  const navigate = useNavigate();
  const { isAuthenticated, session } = useInstitutionAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(INSTITUTION_ROUTES.login, {
        replace: true,
        state: { from: INSTITUTION_ROUTES.pilot },
      });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return (
      <PageShell narrow={false}>
        <LoadingState label={t('auth.redirecting')} />
      </PageShell>
    );
  }

  const verification = session?.verificationStatus ?? 'pending_verification';

  return (
    <PageShell narrow={false} breadcrumbs={breadcrumbsForPath('/institucional/piloto')}>
      <SectionHeader
        eyebrow={t('pilot.wizard.kicker')}
        title={t('pilot.wizard.title')}
        lead={t('pilot.wizard.lead')}
        helpTopic="institucional"
      />
      {verification === 'pending_verification' || verification === 'unverified' ? (
        <p className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90">
          {t('pilot.verify.banner')}
        </p>
      ) : null}
      {verification === 'verified' ? (
        <p className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100/90">
          {t('pilot.verify.verified')}
        </p>
      ) : null}
      {verification === 'rejected' ? (
        <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100/90">
          {t('pilot.verify.rejected')}
        </p>
      ) : null}
      <InstitutionPilotProvider>
        <InstitutionPilotErrorBoundary>
          <InstitutionPilotWizard />
        </InstitutionPilotErrorBoundary>
      </InstitutionPilotProvider>
    </PageShell>
  );
}
