import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';
import { usePlatform } from '../../context/PlatformContext.js';
import { AGIGOV_MODELS } from '../../platform/agigovModels.js';
import { ModelStatusBadge } from '../models/ModelStatusBadge.js';

const FEATURED = AGIGOV_MODELS.filter((m) => m.audience === 'gubernamental').slice(0, 3);

/** Modelos — cabecera + grid 1→2→3. */
export function LandingModelsInteractiveSection() {
  const copy = useLandingCopy();
  const { t } = usePlatform();

  return (
    <section id="modelos" className="ls-section ls-section--focus" aria-labelledby="landing-models-title">
      <div className="ls-inner">
        <header className="ls-head">
          <p className="ls-kicker">{copy.LANDING_MODELS_KICKER}</p>
          <h2 id="landing-models-title" className="ls-title">
            {copy.LANDING_MODELS_TITLE}
          </h2>
          <p className="ls-lead">{copy.LANDING_MODELS_BODY}</p>
          <div className="ls-actions">
            <Link to="/modelos" className="ls-btn ls-btn--ghost">
              {copy.LANDING_MODELS_CATALOG}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </header>

        <div className="ls-grid ls-grid--3">
          {FEATURED.map((model) => {
            const Icon = model.icon;
            return (
              <Link key={model.id} to={model.productPath} className="ls-card">
                <div className="ls-card-head">
                  <span className="ls-card-icon">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <ModelStatusBadge modelId={model.id} status={model.status} size="sm" />
                </div>
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
