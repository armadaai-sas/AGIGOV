import { useSovereignConfig } from '../../context/PlatformContext.js';
import {
  InstitutionBaselineStep,
  InstitutionDashboardStep,
  InstitutionIngestStep,
  InstitutionModelStep,
  InstitutionQCloseStep,
  InstitutionReconcileStep,
} from './InstitutionPilotSteps.js';
import { InstitutionProfileStep } from './InstitutionProfileStep.js';
import { InstitutionPilotStepper } from './InstitutionPilotStepper.js';
import { useInstitutionPilot } from '../../institutional/InstitutionPilotContext.js';

/** Wizard piloto institucional — 7 pasos end-to-end. */
export function InstitutionPilotWizard() {
  const { t } = useSovereignConfig();
  const { activeStep, session, hydrating } = useInstitutionPilot();

  return (
    <div className="inst-pilot-wizard">
      <InstitutionPilotStepper />
      {hydrating ? (
        <p className="mb-4 flex items-center gap-2 text-sm text-agigov-text-muted">
          <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-sky-400" />
          {t('pilot.wizard.hydrating')}
        </p>
      ) : null}
      {session.slug ? (
        <p className="mb-4 text-sm text-sky-400">
          Tenant: <span className="font-mono">{session.slug}</span>
          {session.ministryCode ? (
            <span className="text-agigov-text-muted">
              {' '}
              · {session.ministryCode}
            </span>
          ) : null}
        </p>
      ) : null}

      {activeStep === 0 ? <InstitutionProfileStep /> : null}
      {activeStep === 1 ? <InstitutionModelStep /> : null}
      {activeStep === 2 ? <InstitutionBaselineStep /> : null}
      {activeStep === 3 ? <InstitutionIngestStep /> : null}
      {activeStep === 4 ? <InstitutionReconcileStep /> : null}
      {activeStep === 5 ? <InstitutionQCloseStep /> : null}
      {activeStep === 6 ? <InstitutionDashboardStep /> : null}

      {activeStep > 6 ? (
        <div className="agigov-card text-sm text-agigov-text-muted">{t('pilot.wizard.step.soon')}</div>
      ) : null}
    </div>
  );
}
