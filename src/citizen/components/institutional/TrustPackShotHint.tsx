import { Camera } from 'lucide-react';

import { useInstitutionPilot } from '../../institutional/InstitutionPilotContext.js';

/** Mapa wizard → captura Operador B (prueba-real-2). */
const SHOT_BY_WIZARD_STEP: Array<{ bStep: number; file: string; tip: string }> = [
  { bStep: 3, file: '03-piloto-slug.png', tip: 'Tras Provisionar: captura el slug' },
  { bStep: 4, file: '04-modelo-egs.png', tip: 'EGS seleccionado + Continuar' },
  { bStep: 5, file: '05-baseline.png', tip: 'Onboard + Ratificar baseline' },
  { bStep: 6, file: '06-ingest.png', tip: '≥3 hitos (demo o CSV)' },
  { bStep: 7, file: '07-centinela.png', tip: 'OK o FREEZE legible' },
  { bStep: 8, file: '08-qclose.png', tip: 'Publicar → published + Δ' },
  { bStep: 9, file: '09-tenant.png', tip: 'Consola / datos del tenant' },
];

/** Hint de captura Trust Pack en el wizard (no sustituye checklist). */
export function TrustPackShotHint() {
  const { activeStep } = useInstitutionPilot();
  const shot = SHOT_BY_WIZARD_STEP[activeStep];
  if (!shot) return null;

  return (
    <aside
      className="mb-4 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3"
      aria-label="Captura Trust Pack"
    >
      <Camera className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" aria-hidden />
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-200/90">
          Trust Pack · paso B{shot.bStep}
        </p>
        <p className="mt-1 text-sm text-agigov-text">{shot.tip}</p>
        <p className="mt-1 font-mono text-xs text-amber-100/80">artifacts/{shot.file}</p>
      </div>
    </aside>
  );
}
