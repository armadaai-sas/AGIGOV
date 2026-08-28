import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

import type { AgigovModel } from '../../platform/agigovModels.js';import { ModelStatusBadge } from './ModelStatusBadge.js';

type Props = {
  model: AgigovModel;
};

/** Fila de catálogo — misma gramática que Escritorio (lista app, sin card decorativa). */
export function ModelCatalogRow({ model }: Props) {
  const Icon = model.icon;

  return (
    <li>
      <Link to={model.productPath} className="os-workspace-row">
        <span className="os-workspace-row-icon" aria-hidden>
          <Icon className="h-4 w-4" />
        </span>
        <span className="os-workspace-row-body">
          <span className="os-workspace-row-name">{model.name}</span>
          <span className="os-workspace-row-meta">{model.tagline}</span>
        </span>
        <ModelStatusBadge modelId={model.id} status={model.status} />
        <ChevronRight className="os-workspace-row-chevron h-4 w-4" aria-hidden />
      </Link>
    </li>
  );
}
