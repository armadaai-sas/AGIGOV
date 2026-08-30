import { Check } from 'lucide-react';

import { agigovIconProps } from '../icons/agigovIcon.js';
import {
  MODEL_PROCESS_STEPS,
  modelProcessLiveLabel,
  modelProcessStepIndex,
  type ModelProcessStepId,
} from '../../platform/modelProcess.js';

type Props = {
  currentStep: ModelProcessStepId;
  /** Override del mensaje dinámico bajo la barra. */
  liveLabel?: string;
  compact?: boolean;
};

/** Barra de proceso en vivo — estilo tracking logístico (Amazon-like). */
export function ModelProcessTracker({ currentStep, liveLabel, compact = false }: Props) {
  const activeIndex = modelProcessStepIndex(currentStep);
  const statusText = liveLabel ?? modelProcessLiveLabel(currentStep);

  return (
    <section
      className={`model-process-tracker ${compact ? 'model-process-tracker--compact' : ''}`}
      aria-label="Progreso del modelo"
    >
      <p className="model-process-tracker-live" role="status">
        {statusText}
      </p>
      <ol className="model-process-tracker-steps">
        {MODEL_PROCESS_STEPS.map((step, index) => {
          const done = index < activeIndex;
          const active = index === activeIndex;
          const pending = index > activeIndex;

          return (
            <li
              key={step.id}
              className={`model-process-tracker-step ${done ? 'is-done' : ''} ${active ? 'is-active' : ''} ${pending ? 'is-pending' : ''}`}
            >
              <span className="model-process-tracker-node" aria-hidden>
                {done ? <Check {...agigovIconProps('sm')} /> : <span className="model-process-tracker-dot" />}
              </span>
              <span className="model-process-tracker-label">{step.label}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
