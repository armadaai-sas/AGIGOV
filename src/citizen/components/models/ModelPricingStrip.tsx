import type { AgigovModel } from '../../platform/agigovModels.js';
import { getModelValidation } from '../../platform/modelValidationState.js';

type Props = {
  model: AgigovModel;
};

export function ModelPricingStrip({ model }: Props) {
  const validation = getModelValidation(model.id);
  const isDemo =
    model.status !== 'disponible' ||
    (validation && !validation.approved) ||
    validation?.stages.operacional === 'partial';

  return (
    <section
      className="rounded-xl border border-white/[0.08] bg-gradient-to-r from-sky-500/[0.06] to-transparent p-5"
      id="negocio"
    >
      <p className="text-[10px] font-medium uppercase tracking-wide text-agigov-text-muted">
        Modelo de negocio
      </p>
      <div className="mt-3 grid gap-4 sm:grid-cols-3">
        <PricingCell label="Pagador" value={model.businessModel.payer} />
        <PricingCell label="Mecanismo" value={model.businessModel.mechanism} highlight />
        <PricingCell label="Métrica de verdad" value={model.businessModel.metric} />
      </div>
      {isDemo ? (
        <p className="mt-4 text-xs text-amber-200/90">
          Pricing orientativo — demo técnica. Validar fee final con CSO y marco institucional antes de contrato.
        </p>
      ) : null}
    </section>
  );
}

function PricingCell({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs text-agigov-text-muted">{label}</dt>
      <dd
        className={`mt-1 text-sm leading-snug ${highlight ? 'font-medium text-sky-200' : 'text-agigov-text'}`}
      >
        {value}
      </dd>
    </div>
  );
}
