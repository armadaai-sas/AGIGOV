import {
  getModelValidation,
  MODEL_VALIDATION_GENERATED_AT,
  type ValidationStageResult,
} from '../../platform/modelValidationState.js';
import type { ModelStatus } from '../../platform/agigovModels.js';
import {
  getModelStatusSync,
  MODEL_STATUS_LABEL,
} from '../../platform/modelStatusSync.js';
import { ModelStatusBadge } from './ModelStatusBadge.js';

type Props = {
  modelId: string;
  catalogStatus: ModelStatus;
};

const STAGE_META: Record<
  ValidationStageResult,
  { label: string; desc: string; dot: string }
> = {
  pass: { label: 'Pass', desc: 'Evidencia completa en repo', dot: 'bg-zinc-700' },
  partial: { label: 'Parcial', desc: 'Gaps documentados', dot: 'bg-zinc-400' },
  fail: { label: 'Fail', desc: 'Bloqueante para catálogo', dot: 'bg-zinc-500' },
  pending: { label: 'Pendiente', desc: 'Sin auditoría reciente', dot: 'bg-zinc-300' },
};

export function ModelValidationPanel({ modelId, catalogStatus }: Props) {
  const validation = getModelValidation(modelId);
  if (!validation) return null;

  const sync = getModelStatusSync(modelId, catalogStatus);

  return (
    <section className="os-panel" id="validacion">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold">Validación automática</h2>
          <p className="mt-1 text-sm text-agigov-text-muted">
            3 etapas — técnica · operacional · comercial
          </p>
          <p className="mt-1 font-mono text-[10px] text-agigov-text-muted/80">
            Última auditoría: {new Date(MODEL_VALIDATION_GENERATED_AT).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <ModelStatusBadge modelId={modelId} status={catalogStatus} size="md" showDriftHint />
          <span
            className={`rounded-md border px-2 py-0.5 text-xs font-medium ${
              validation.approved
                ? 'border-zinc-200 bg-zinc-100 text-zinc-800'
                : 'border-zinc-200 bg-zinc-50 text-zinc-600'
            }`}
          >
            {validation.approved ? 'Aprobado catálogo' : 'Pendiente / parcial'}
          </span>
        </div>
      </div>

      {!sync.inSync ? (
        <div className="model-status-sync-alert mt-4" role="status">
          <p className="text-sm text-agigov-text">
            El estado en <code className="agigov-mono-id">agigovModels.ts</code> (
            {MODEL_STATUS_LABEL[sync.catalogStatus]}) difiere de la auditoría (
            {sync.auditStatus ? MODEL_STATUS_LABEL[sync.auditStatus] : '—'}). Ejecute{' '}
            <code className="agigov-mono-id">npm run models:audit</code> para sincronizar.
          </p>
        </div>
      ) : (
        <p className="model-status-sync-ok mt-4 text-xs text-zinc-600">
          Catálogo y auditoría alineados en {MODEL_STATUS_LABEL[sync.displayStatus]}.
        </p>
      )}

      <div className="mt-5 flex gap-1 rounded-md border border-zinc-200 bg-zinc-50 p-1">
        {(['tecnica', 'operacional', 'comercial'] as const).map((key, i) => (
          <StageBar
            key={key}
            index={i + 1}
            name={key === 'tecnica' ? 'Técnica' : key === 'operacional' ? 'Operacional' : 'Comercial'}
            stage={validation.stages[key]}
          />
        ))}
      </div>

      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        <StageRow label="1 · Técnica" stage={validation.stages.tecnica} />
        <StageRow label="2 · Operacional" stage={validation.stages.operacional} />
        <StageRow label="3 · Comercial" stage={validation.stages.comercial} />
      </ul>

      {validation.notes.length > 0 ? (
        <ul className="mt-4 space-y-1 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600">
          {validation.notes.map((n) => (
            <li key={n}>· {n}</li>
          ))}
        </ul>
      ) : null}

      <p className="mt-4 text-xs text-agigov-text-muted">
        Re-ejecutar: <code className="os-mono-id">npm run models:audit</code>
        {' · '}
        Recomendado: <strong className="text-agigov-text">{validation.recommendedStatus}</strong>
      </p>
    </section>
  );
}

function StageBar({
  index,
  name,
  stage,
}: {
  index: number;
  name: string;
  stage: ValidationStageResult;
}) {
  const meta = STAGE_META[stage];
  const fill =
    stage === 'pass' ? '100%' : stage === 'partial' ? '66%' : stage === 'fail' ? '33%' : '10%';
  const barColor =
    stage === 'pass'
      ? 'bg-zinc-800'
      : stage === 'partial'
        ? 'bg-zinc-400'
        : stage === 'fail'
          ? 'bg-zinc-600'
          : 'bg-zinc-300';

  return (
    <div className="flex-1 px-2 py-2 text-center">
      <p className="text-[10px] font-medium uppercase tracking-wide text-agigov-text-muted">
        {index}. {name}
      </p>
      <div className="mx-auto mt-2 h-1.5 max-w-[120px] overflow-hidden rounded-full bg-zinc-200">
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: fill }} />
      </div>
      <p className="mt-1 text-[10px] text-agigov-text-muted">{meta.label}</p>
    </div>
  );
}

function StageRow({ label, stage }: { label: string; stage: ValidationStageResult }) {
  const meta = STAGE_META[stage];
  const styles: Record<ValidationStageResult, string> = {
    pass: 'border-zinc-200 bg-zinc-50 text-zinc-800',
    partial: 'border-zinc-200 bg-zinc-50 text-zinc-700',
    fail: 'border-zinc-200 bg-zinc-50 text-zinc-700',
    pending: 'border-zinc-200 bg-white text-zinc-500',
  };

  return (
    <li className={`rounded-lg border px-3 py-3 text-sm ${styles[stage]}`}>
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 shrink-0 rounded-full ${meta.dot}`} aria-hidden />
        <p className="text-[10px] font-medium uppercase tracking-wide opacity-80">{label}</p>
      </div>
      <p className="mt-1 font-semibold">{meta.label}</p>
      <p className="mt-0.5 text-xs opacity-80">{meta.desc}</p>
    </li>
  );
}
