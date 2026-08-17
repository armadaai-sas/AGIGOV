import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';
import { usePlatform } from '../../context/PlatformContext.js';
import { AGIGOV_MODELS } from '../../platform/agigovModels.js';
import { ModelStatusBadge } from '../models/ModelStatusBadge.js';
import '../../../styles/landing-below.css';

const FEATURED = AGIGOV_MODELS.filter((m) => m.audience === 'gubernamental').slice(0, 3);

/** Catálogo visual denso — cards venden, copy corto. */
export function LandingModelsInteractiveSection() {
  const copy = useLandingCopy();
  const { t } = usePlatform();

  return (
    <section
      id="modelo"
      className="landing-section landing-section--models"
      aria-labelledby="landing-models-title"
    >
      <div className="landing-models-layout">
        <div className="landing-models-copy">
          <p className="hero-brand-kicker">{copy.LANDING_MODELS_KICKER}</p>
          <h2 id="landing-models-title" className="landing-models-title">
            {copy.LANDING_MODELS_TITLE}
          </h2>
          <p className="landing-models-body">{copy.LANDING_MODELS_BODY}</p>
          <Link
            to="/modelos"
            className="hero-brand-btn hero-brand-btn--ghost-navy landing-models-catalog-link"
          >
            {copy.LANDING_MODELS_CATALOG}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="landing-models-grid">
          {FEATURED.map((model) => {
            const Icon = model.icon;
            return (
              <Link key={model.id} to={model.productPath} className="landing-models-card">
                <div className="landing-models-card-head">
                  <span className="landing-models-card-icon">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <ModelStatusBadge modelId={model.id} status={model.status} size="sm" />
                </div>
                <h3 className="landing-models-card-title">{model.name}</h3>
                <p className="landing-models-card-desc">{model.tagline}</p>
                <span className="landing-models-card-cta">
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
