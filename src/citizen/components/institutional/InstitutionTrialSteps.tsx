import { useSovereignConfig } from '../../context/PlatformContext.js';

const STEPS = ['trial.step.account', 'trial.step.data', 'trial.step.console'] as const;

/** Tres pasos del recorrido de prueba — orientación customer-centric. */
export function InstitutionTrialSteps({ active = 0 }: { active?: number }) {
  const { t } = useSovereignConfig();

  return (
    <ol className="inst-trial-steps" aria-label={t('trial.stepsLabel')}>
      {STEPS.map((key, index) => (
        <li
          key={key}
          className={`inst-trial-step${index === active ? ' is-active' : index < active ? ' is-done' : ''}`}
        >
          <span className="inst-trial-step-index" aria-hidden>
            {index + 1}
          </span>
          <span className="inst-trial-step-label">{t(key)}</span>
        </li>
      ))}
    </ol>
  );
}
