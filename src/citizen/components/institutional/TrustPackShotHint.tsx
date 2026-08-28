import { Camera } from 'lucide-react';

import { useInstitutionPilot } from '../../institutional/InstitutionPilotContext.js';

const TRUST_PACK_SHOTS = [
  { step: 0, file: '01-registro.png', label: 'Registro institucional' },
  { step: 3, file: '03-ingesta.png', label: 'Ingesta de hitos' },
  { step: 5, file: '05-qclose.png', label: 'Cierre trimestral' },
] as const;

/**
 * @deprecated Removido del wizard — conservado por si se reutiliza en Trust Pack ops.
 */
export function TrustPackShotHint() {
  const { activeStep, session } = useInstitutionPilot();
  const shot = TRUST_PACK_SHOTS.find((s) => s.step === activeStep);
  if (!shot || !session.slug) return null;

  return (
    <div
      className="mb-4 flex items-start gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3"
      role="note"
    >
      <Camera className="mt-0.5 h-5 w-5 shrink-0 text-zinc-500" aria-hidden />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Captura Trust Pack — {shot.label}
        </p>
        <p className="mt-1 font-mono text-xs text-zinc-600">artifacts/{shot.file}</p>
      </div>
    </div>
  );
}
