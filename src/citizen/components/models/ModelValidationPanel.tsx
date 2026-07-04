import {
  getModelValidation,
  MODEL_VALIDATION_GENERATED_AT,
  type ValidationStageResult,
} from '../../platform/modelValidationState.js';
import type { ModelStatus } from '../../platform/agigovModels.js';

type Props = {
  modelId: string;
  catalogStatus: ModelStatus;
};

const STAGE_META: Record<
  ValidationStageResult,
  { label: string; desc: string; dot: string }
> = {
  pass: {
    label: 'Pass',
    desc: 'Evidencia completa en repo',
    dot: 'bg-emerald-400',
  },
  partial: {
    label: 'Parcial',
    desc: 'Demo o gaps documentados',
    dot: 'bg-amber-400',
  },
  fail: {
    label: 'Fail',
    desc: 'Bloqueante para catálogo',
    dot: 'bg-red-400',
  },
  pending: {
    label: 'Pendiente',
    desc: 'Sin auditoría reciente',
    dot: 'bg-zinc-500',
  },
};

export function ModelValidationPanel({ modelId, catalogStatus }: Props) {
  const validation = getModelValidation(modelId);
  if (!validation) return null;

  const outOfSync = validation.recommendedStatus !== catalogStatus;

  return (
    <section className="agigov-card" id="validacion">
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
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              validation.approved
                ? 'bg-emerald-500/15 text-emerald-300'
                : 'bg-amber-500/15 text-amber-200'
            }`}
          >
            {validation.approved ? 'Aprobado catálogo' : 'Pendiente / parcial'}
          </span>
          {outOfSync ? (
            <span className="text-[10px] text-amber-200/90">
              Catálogo: {catalogStatus} · Auditoría: {validation.recommendedStatus}
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-5 flex gap-1 rounded-full bg-white/[0.04] p-1">
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
        <ul className="mt-4 space-y-1 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-xs text-agigov-text-muted">
          {validation.notes.map((n) => (
            <li key={n}>· {n}</li>
          ))}
        </ul>
      ) : null}

      <p className="mt-4 text-xs text-agigov-text-muted">
        Re-ejecutar: <code className="text-sky-400">npm run models:audit</code>
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
      ? 'bg-emerald-400'
      : stage === 'partial'
        ? 'bg-amber-400'
        : stage === 'fail'
          ? 'bg-red-400'
          : 'bg-zinc-500';

  return (
    <div className="flex-1 px-2 py-2 text-center">
      <p className="text-[10px] font-medium uppercase tracking-wide text-agigov-text-muted">
        {index}. {name}
      </p>
      <div className="mx-auto mt-2 h-1.5 max-w-[120px] overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: fill }} />
      </div>
      <p className="mt-1 text-[10px] text-agigov-text-muted">{meta.label}</p>
    </div>
  );
}

function StageRow({ label, stage }: { label: string; stage: ValidationStageResult }) {
  const meta = STAGE_META[stage];
  const styles: Record<ValidationStageResult, string> = {
    pass: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
    partial: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
    fail: 'border-red-500/30 bg-red-500/10 text-red-200',
    pending: 'border-white/10 bg-white/[0.03] text-agigov-text-muted',
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
