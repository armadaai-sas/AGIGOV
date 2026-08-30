import { Link, Navigate, useParams } from 'react-router-dom';

import { ModelProcessTracker } from '../components/models/ModelProcessTracker.js';
import { ModelWorkspaceActions } from '../components/models/ModelWorkspaceActions.js';
import { PageShell } from '../components/PageShell.js';
import { ModelStatusBadge } from '../components/models/ModelStatusBadge.js';
import { getAgigovModel } from '../platform/agigovModels.js';
import { getModelWorkspaceExperience } from '../platform/modelDeployActions.js';
import { getEffectiveModelStatus } from '../platform/modelStatusSync.js';

/** Espacio de trabajo — acciones claras tras «Desplegar». */
export default function ModelWorkspacePage() {
  const { modelId } = useParams<{ modelId: string }>();
  const model = modelId ? getAgigovModel(modelId) : undefined;

  if (!model) {
    return <Navigate to="/modelos" replace />;
  }

  const effectiveStatus = getEffectiveModelStatus(model.id, model.status);
  if (effectiveStatus === 'roadmap') {
    return <Navigate to={model.productPath} replace />;
  }

  const experience = getModelWorkspaceExperience(model);

  return (
    <PageShell shell narrow>
      <div className="os-workspace">
        <Link to={model.productPath} className="os-workspace-foot-link inline-flex items-center gap-1">
          ← Ficha del modelo
        </Link>

        <header className="os-workspace-head os-workspace-head--stack">
          <div className="os-workspace-head-text">
            <p className="os-workspace-section-title">Espacio de trabajo</p>
            <h1 className="os-workspace-title">{model.shortName}</h1>
            <p className="os-workspace-sub">{model.tagline}</p>
          </div>
        </header>

        <div className="flex items-center gap-2">
          <ModelStatusBadge modelId={model.id} status={model.status} size="sm" />
        </div>

        <ModelProcessTracker currentStep="connect" />

        <ModelWorkspaceActions experience={experience} />

        <footer className="os-workspace-foot">
          <Link to="/escritorio" className="os-workspace-foot-link">
            Volver al escritorio
          </Link>
        </footer>
      </div>
    </PageShell>
  );
}
