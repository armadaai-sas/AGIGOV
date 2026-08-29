import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

import { PageShell, SectionHeader } from '../components/PageShell.js';
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
        <SectionHeader
          eyebrow={t('enterprise.journey.track')}
          title={t('enterprise.journey.title')}
          lead={
            <>
              {t('enterprise.journey.lead')}
              <span className="os-workspace-intro">{t('enterprise.journey.intro')}</span>
            </>
          }
        />

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
                      <span className="os-workspace-row-pricing"> · {t(pricingKey)}</span>
                    </span>
                  </span>
                  <span className="os-workspace-row-status os-workspace-row-status--step">{order}</span>
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
