/** Pasos del pipeline operativo de un modelo — estilo tracking logístico. */
export type ModelProcessStepId =
  | 'select'
  | 'connect'
  | 'receive'
  | 'analyze'
  | 'classify'
  | 'report'
  | 'published';

export type ModelProcessStep = {
  id: ModelProcessStepId;
  label: string;
  detail: string;
};

export const MODEL_PROCESS_STEPS: readonly ModelProcessStep[] = [
  { id: 'select', label: 'Modelo', detail: 'Elegiste el modelo operativo' },
  { id: 'connect', label: 'Conectar', detail: 'Sube data o conecta la API' },
  { id: 'receive', label: 'Recibiendo', detail: 'Ingesta verificada en cola' },
  { id: 'analyze', label: 'Analizando', detail: 'Trabajando en tu informe' },
  { id: 'classify', label: 'Tipo de data', detail: 'Clasificación y validación' },
  { id: 'report', label: 'Informe', detail: 'Generando salida verificable' },
  { id: 'published', label: 'Publicado', detail: 'Resultado listo en consola' },
] as const;

export type ModelProcessSignals = {
  modelSelected?: boolean;
  dataConnected?: boolean;
  receiving?: boolean;
  analyzing?: boolean;
  classifying?: boolean;
  reporting?: boolean;
  published?: boolean;
  loading?: boolean;
};

/** Deriva el paso activo desde señales de consola / API. */
export function deriveModelProcessStep(signals: ModelProcessSignals): ModelProcessStepId {
  if (signals.published) return 'published';
  if (signals.reporting) return 'report';
  if (signals.classifying) return 'classify';
  if (signals.analyzing || signals.loading) return 'analyze';
  if (signals.receiving) return 'receive';
  if (signals.dataConnected) return 'connect';
  if (signals.modelSelected) return 'select';
  return 'select';
}

export function modelProcessStepIndex(step: ModelProcessStepId): number {
  return MODEL_PROCESS_STEPS.findIndex((s) => s.id === step);
}

export function modelProcessLiveLabel(step: ModelProcessStepId): string {
  const found = MODEL_PROCESS_STEPS.find((s) => s.id === step);
  if (!found) return 'En proceso';
  if (step === 'analyze') return 'Visualización: trabajando en tu informe…';
  if (step === 'receive') return 'Recibiendo datos verificados…';
  if (step === 'classify') return 'Identificando tipo de data…';
  if (step === 'report') return 'Generando informe…';
  if (step === 'published') return 'Informe publicado';
  return found.detail;
}
