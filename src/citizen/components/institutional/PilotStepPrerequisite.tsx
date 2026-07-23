import { AlertTriangle } from 'lucide-react';

import { useSovereignConfig } from '../../context/PlatformContext.js';
import { useInstitutionPilot } from '../../institutional/InstitutionPilotContext.js';

/** Aviso cuando un paso requiere completar otro antes. */
export function PilotStepPrerequisite({
  targetStep,
  message,
}: {
  targetStep: number;
  message: string;
}) {
  const { setActiveStep } = useInstitutionPilot();
  const { t } = useSovereignConfig();

  return (
    <div
      className="mb-4 flex gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm"
      role="status"
    >
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden />
      <div>
        <p className="text-amber-100/90">{message}</p>
        <button
          type="button"
          className="mt-2 text-sky-400 underline-offset-2 hover:text-sky-300 hover:underline"
          onClick={() => setActiveStep(targetStep)}
        >
          {t('pilot.gate.goto')}
        </button>
      </div>
    </div>
  );
}
