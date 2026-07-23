import { Check } from 'lucide-react';

import type { MessageKey } from '../../../i18n/index.js';
import { useSovereignConfig } from '../../context/PlatformContext.js';
import { useInstitutionPilot, PILOT_WIZARD_STEPS } from '../../institutional/InstitutionPilotContext.js';

const STEP_KEYS: MessageKey[] = [
  'pilot.wizard.step.profile',
  'pilot.wizard.step.model',
  'pilot.wizard.step.baseline',
  'pilot.wizard.step.ingest',
  'pilot.wizard.step.reconcile',
  'pilot.wizard.step.close',
  'pilot.wizard.step.dashboard',
];

export function InstitutionPilotStepper() {
  const { t } = useSovereignConfig();
  const { activeStep, setActiveStep, session, isStepComplete } = useInstitutionPilot();

  return (
    <ol className="inst-pilot-steps" aria-label={t('pilot.wizard.title')}>
      {PILOT_WIZARD_STEPS.map((id, i) => {
        const done = isStepComplete(i);
        const current = i === activeStep;
        const clickable = i <= session.maxStepReached;
        const key = STEP_KEYS[i]!;
        return (
          <li key={id}>
            <button
              type="button"
              disabled={!clickable}
              className={`inst-pilot-step ${done ? 'is-done' : ''} ${current ? 'is-active' : ''} ${!clickable ? 'is-upcoming' : ''}`}
              aria-current={current ? 'step' : undefined}
              onClick={() => clickable && setActiveStep(i)}
            >
              <span className="inst-pilot-step-mark" aria-hidden>
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span className="inst-pilot-step-label">{t(key)}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
