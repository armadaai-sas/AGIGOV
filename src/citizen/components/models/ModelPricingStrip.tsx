import type { AgigovModel } from '../../platform/agigovModels.js';

type Props = {
  model: AgigovModel;
};

export function ModelPricingStrip({ model }: Props) {
  return (
    <section
      className="os-panel"
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
        className={`mt-1 text-sm leading-snug ${highlight ? 'font-medium text-zinc-900' : 'text-zinc-700'}`}
      >
        {value}
      </dd>
    </div>
  );
}
