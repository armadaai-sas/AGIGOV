import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { InstitutionPilotErrorBoundary } from '../components/institutional/InstitutionPilotErrorBoundary.js';
import { InstitutionPilotWizard } from '../components/institutional/InstitutionPilotWizard.js';
import { LoadingState, PageShell } from '../components/PageShell.js';
import { useSovereignConfig } from '../context/PlatformContext.js';
import { InstitutionPilotProvider } from '../institutional/InstitutionPilotContext.js';
import { useInstitutionAuth } from '../institutional/useInstitutionAuth.js';
import { INSTITUTION_ROUTES } from '../platform/institutionalRoutes.js';

/** Piloto institucional — subir documentos y configurar baseline. */
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
      <PageShell shell narrow>
        <LoadingState label={t('auth.redirecting')} />
      </PageShell>
    );
  }

  const verification = session?.verificationStatus ?? 'pending_verification';

  return (
    <PageShell shell narrow>
      <div className="os-workspace">
        <header className="os-workspace-head os-workspace-head--stack">
          <div className="os-workspace-head-text">
            <p className="os-workspace-section-title">{t('pilot.wizard.kicker')}</p>
            <h1 className="os-workspace-title">{t('pilot.wizard.title')}</h1>
            <p className="os-workspace-sub">{t('pilot.wizard.lead')}</p>
          </div>
        </header>

        {verification !== 'verified' ? (
          <p className="os-panel text-[13px] text-zinc-600">
            {verification === 'rejected' ? t('pilot.verify.rejected') : t('pilot.verify.banner')}
          </p>
        ) : (
          <p className="os-panel text-[13px] text-zinc-600">{t('pilot.verify.verified')}</p>
        )}

        <InstitutionPilotProvider>
          <InstitutionPilotErrorBoundary>
            <InstitutionPilotWizard />
          </InstitutionPilotErrorBoundary>
        </InstitutionPilotProvider>
      </div>
    </PageShell>
  );
}
