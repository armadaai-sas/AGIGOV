import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

import { PageShell } from '../components/PageShell.js';
import { DeskPageHeader } from '../components/desk/DeskPageHeader.js';
import { agigovIconProps } from '../components/icons/agigovIcon.js';
import { ENTERPRISE_JOURNEY_STEPS } from '../content/enterpriseJourney.js';
import { useSovereignConfig } from '../context/PlatformContext.js';
import { ENTERPRISE_ROUTES } from '../platform/enterpriseRoutes.js';

/**
 * Hub empresas — recorrido A→Z con filas espaciadas (desk pattern).
 */
export default function EnterpriseHubPage() {
  const { t } = useSovereignConfig();

  return (
    <PageShell shell narrow>
      <div className="desk-page desk-page--journey">
        <DeskPageHeader
          title={t('enterprise.journey.title')}
          result={t('enterprise.journey.lead')}
          dataHint={t('enterprise.journey.intro')}
          eyebrow={t('enterprise.journey.track')}
        />

        <ul className="desk-page-list desk-journey-list">
          {ENTERPRISE_JOURNEY_STEPS.map(
            ({ id, order, to, icon: Icon, external, titleKey, metaKey, pricingKey }) => {
              const row = (
                <>
                  <span className="desk-journey-order" aria-hidden>
                    {order}
                  </span>
                  <span className="desk-journey-icon" aria-hidden>
                    <Icon {...agigovIconProps('md')} />
                  </span>
                  <span className="desk-journey-body">
                    <span className="desk-journey-title">{t(titleKey)}</span>
                    <span className="desk-journey-meta">
                      {t(metaKey)}
                      <span className="desk-journey-pricing"> · {t(pricingKey)}</span>
                    </span>
                  </span>
                  <ChevronRight {...agigovIconProps('sm', 'desk-journey-chevron shrink-0 opacity-40')} />
                </>
              );

              return (
                <li key={id}>
                  {external ? (
                    <a href={to} className="desk-journey-row">
                      {row}
                    </a>
                  ) : (
                    <Link to={to} className="desk-journey-row">
                      {row}
                    </Link>
                  )}
                </li>
              );
            },
          )}
        </ul>

        <p className="desk-page-secondary-link">
          <Link to={ENTERPRISE_ROUTES.dataTrust}>
            {t('enterprise.journey.footerCta')}
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
