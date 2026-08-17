import { Link } from 'react-router-dom';
import { ArrowRight, Cloud, Workflow } from 'lucide-react';

import { useLandingCopy } from '../../hero/useLandingCopy.js';
import { getAgigovModel } from '../../platform/agigovModels.js';
import { ModelStatusBadge } from '../models/ModelStatusBadge.js';
import '../../../styles/landing-below.css';

const SERVICE_IDS = ['n8n', 'railway'] as const;

const ICONS = {
  n8n: Workflow,
  railway: Cloud,
} as const;

/** Servicios operativos — N8N / Railway — venta clara bajo el hero. */
export function LandingServicesSection() {
  const copy = useLandingCopy();
  const services = SERVICE_IDS.map((id) => getAgigovModel(id)).filter(Boolean);

  return (
    <section
      id="servicios"
      className="landing-section landing-section--services"
      aria-labelledby="landing-services-title"
    >
      <div className="landing-models-layout">
        <div className="landing-models-copy">
          <p className="hero-brand-kicker">{copy.LANDING_SERVICES_KICKER}</p>
          <h2 id="landing-services-title" className="landing-display-title landing-models-title">
            {copy.LANDING_SERVICES_TITLE}
          </h2>
          <p className="landing-lead landing-models-body">{copy.LANDING_SERVICES_BODY}</p>
        </div>

        <div className="landing-models-grid">
          {services.map((model) => {
            if (!model) return null;
            const Icon = ICONS[model.id as keyof typeof ICONS] ?? Workflow;
            return (
              <Link key={model.id} to={model.productPath} className="landing-models-card">
                <div className="landing-models-card-head">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-800">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <ModelStatusBadge modelId={model.id} status={model.status} size="sm" />
                </div>
                <h3 className="landing-models-card-title">{model.name}</h3>
                <p className="landing-models-card-desc">{model.tagline}</p>
                <span className="landing-models-card-cta">
                  {copy.LANDING_SERVICES_CTA}
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
