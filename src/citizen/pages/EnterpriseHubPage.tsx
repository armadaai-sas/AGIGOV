import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

import { PageShell } from '../components/PageShell.js';
import { ENTERPRISE_JOURNEY_STEPS } from '../content/enterpriseJourney.js';
import { useSovereignConfig } from '../context/PlatformContext.js';
import { ENTERPRISE_ROUTES } from '../platform/enterpriseRoutes.js';

/**
 * Hub empresas — recorrido A→Z: utilidad, modelos, integración y contacto.
 */
export default function EnterpriseHubPage() {
  const { t } = useSovereignConfig();

  return (
    <PageShell shell narrow>
      <div className="os-workspace">
        <header className="os-workspace-head os-workspace-head--stack">
          <div className="os-workspace-head-text">
            <h1 className="os-workspace-title">{t('enterprise.journey.title')}</h1>
            <p className="os-workspace-sub">{t('enterprise.journey.lead')}</p>
            <p className="mt-2 text-[13px] leading-relaxed text-zinc-600">
              {t('enterprise.journey.intro')}
            </p>
          </div>
        </header>

        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400">
          {t('enterprise.journey.track')}
        </p>

        <ul className="os-workspace-list">
          {ENTERPRISE_JOURNEY_STEPS.map(
            ({ id, order, to, icon: Icon, external, titleKey, metaKey, pricingKey }) => {
              const body = (
                <>
                  <span className="os-workspace-row-icon" aria-hidden>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="os-workspace-row-body">
                    <span className="os-workspace-row-name">{t(titleKey)}</span>
                    <span className="os-workspace-row-meta">
                      {t(metaKey)}
                      <span className="text-zinc-400"> · {t(pricingKey)}</span>
                    </span>
                  </span>
                  <span className="os-workspace-row-status">{order}</span>
                  <ChevronRight className="os-workspace-row-chevron h-4 w-4" aria-hidden />
                </>
              );

              return (
                <li key={id}>
                  {external ? (
                    <a href={to} className="os-workspace-row">
                      {body}
                    </a>
                  ) : (
                    <Link to={to} className="os-workspace-row">
                      {body}
                    </Link>
                  )}
                </li>
              );
            },
          )}
        </ul>

        <footer className="os-workspace-foot">
          <Link to={ENTERPRISE_ROUTES.dataTrust} className="os-workspace-foot-link">
            {t('enterprise.journey.footerCta')}
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </footer>
      </div>
    </PageShell>
  );
}
