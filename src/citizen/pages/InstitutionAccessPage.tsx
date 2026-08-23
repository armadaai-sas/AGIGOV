import { Camera } from 'lucide-react';
import { Navigate } from 'react-router-dom';

import { breadcrumbsForPath } from '../components/AppBreadcrumbs.js';
import { InstitutionLoginForm } from '../components/institutional/InstitutionLoginForm.js';
import { PageShell, SectionHeader } from '../components/PageShell.js';
import { useSovereignConfig } from '../context/PlatformContext.js';
import { useInstitutionAuth } from '../institutional/useInstitutionAuth.js';
import { INSTITUTION_ROUTES } from '../platform/institutionalRoutes.js';

/** Inicio de sesión institucional — paso 2 tras registro. */
export default function InstitutionAccessPage() {
  const { t } = useSovereignConfig();
  const { isAuthenticated } = useInstitutionAuth();

  if (isAuthenticated) {
    return <Navigate to={INSTITUTION_ROUTES.desk} replace />;
  }

  return (
    <PageShell narrow breadcrumbs={breadcrumbsForPath('/institucional/acceso')}>
      <aside className="mb-6 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
        <Camera className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" aria-hidden />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-200/90">
            Paquete de confianza · paso B2
          </p>
          <p className="mt-1 text-sm text-agigov-text">
            Cierra sesión si hace falta, inicia sesión y captura.
          </p>
          <p className="mt-1 font-mono text-xs text-amber-100/80">artifacts/02-acceso.png</p>
        </div>
      </aside>
      <SectionHeader
        eyebrow={t('auth.kicker')}
        title={t('auth.title')}
        lead={t('auth.lead')}
        helpTopic="institucional"
      />
      <InstitutionLoginForm />
    </PageShell>
  );
}
