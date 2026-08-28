import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';
import { usePlatform } from '../../context/PlatformContext.js';
import { AGIGOV_MODELS, type ModelAudience } from '../../platform/agigovModels.js';
import { ModelStatusBadge } from '../models/ModelStatusBadge.js';

const FEATURED_BY_AUDIENCE: ModelAudience[] = ['gubernamental', 'empresarial', 'ciudadano'];

function pickFeatured(audience: ModelAudience) {
  return AGIGOV_MODELS.find((m) => m.audience === audience) ?? AGIGOV_MODELS[0]!;
}

/** Un modelo destacado por audiencia — sin grid basura. */
export function LandingModelsInteractiveSection() {
  const copy = useLandingCopy();
  const { t } = usePlatform();
  const featured = FEATURED_BY_AUDIENCE.map(pickFeatured);

  return (
    <section
      id="modelos"
      className="ls-section ls-section--focus ls-section--tone"
      aria-labelledby="landing-models-title"
    >
      <div className="ls-inner">
        <header className="ls-head">
          <p className="ls-kicker">{copy.LANDING_MODELS_KICKER}</p>
          <h2 id="landing-models-title" className="ls-title">
            {copy.LANDING_MODELS_TITLE}
          </h2>
          <p className="ls-lead">{copy.LANDING_MODELS_BODY}</p>
          <div className="ls-actions">
            <Link to="/modelos" className="ls-btn ls-btn--secondary">
              {copy.LANDING_MODELS_CATALOG}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </header>

        <div className="ls-grid ls-grid--3">
          {featured.map((model) => {
            const Icon = model.icon;
            return (
              <Link key={model.id} to={model.productPath} className="ls-card">
                <div className="ls-card-head">
                  <span className="ls-card-icon">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <ModelStatusBadge modelId={model.id} status={model.status} size="sm" />
                </div>
                <p className="ls-card-kicker">
                  {model.audience === 'gubernamental'
                    ? t('landing.models.audience.gubernamental')
                    : model.audience === 'empresarial'
                      ? t('landing.models.audience.empresarial')
                      : t('landing.models.audience.ciudadano')}
                </p>
                <h3 className="ls-card-title">{model.name}</h3>
                <p className="ls-card-desc">{model.tagline}</p>
                <span className="ls-card-cta">
                  {t('model.card.viewBrief')}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
