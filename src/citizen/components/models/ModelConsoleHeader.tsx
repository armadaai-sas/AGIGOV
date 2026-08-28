import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { getAgigovModel } from '../../platform/agigovModels.js';
import { modelWorkspacePath } from '../../platform/modelWorkspace.js';

type Props = {
  modelId: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

/** Cabecera estándar de consola — vuelve al espacio de trabajo del modelo. */
export function ModelConsoleHeader({ modelId, title, subtitle, children }: Props) {
  const model = getAgigovModel(modelId);

  return (
    <header className="os-workspace-head">
      <div className="os-workspace-head-text">
        <p className="os-workspace-section-title">{model?.shortName ?? modelId}</p>
        <h1 className="os-workspace-title">{title}</h1>
        {subtitle ? <p className="os-workspace-sub">{subtitle}</p> : null}
      </div>
      <div className="os-workspace-cta flex flex-wrap items-center gap-2">
        {children}
        <Link to={modelWorkspacePath(modelId)} className="ds-btn-secondary ds-btn-app-shape">
          Espacio de trabajo
        </Link>
        {model ? (
          <Link to={model.productPath} className="os-btn-text text-[13px]">
            Ficha
          </Link>
        ) : null}
      </div>
    </header>
  );
}
