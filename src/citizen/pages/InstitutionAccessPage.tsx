import { Camera } from 'lucide-react';
import { Navigate } from 'react-router-dom';

import { InstitutionLoginForm } from '../components/institutional/InstitutionLoginForm.js';
import { PageShell } from '../components/PageShell.js';
import { useSovereignConfig } from '../context/PlatformContext.js';
import { useInstitutionAuth } from '../institutional/useInstitutionAuth.js';
import { INSTITUTION_ROUTES } from '../platform/institutionalRoutes.js';

export default function InstitutionAccessPage() {
  const { t } = useSovereignConfig();
  const { isAuthenticated } = useInstitutionAuth();

  if (isAuthenticated) {
    return <Navigate to={INSTITUTION_ROUTES.desk} replace />;
  }

  return (
    <PageShell shell narrow>
      <div className="os-workspace">
        <header className="os-workspace-head os-workspace-head--stack">
          <div className="os-workspace-head-text">
            <h1 className="os-workspace-title">{t('auth.title')}</h1>
            <p className="os-workspace-sub">{t('auth.lead')}</p>
          </div>
        </header>

        <div className="os-panel flex items-start gap-3">
          <Camera className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" aria-hidden />
          <div className="text-[13px] text-zinc-600">
            <p className="font-medium text-zinc-900">Paquete de confianza · paso B2</p>
            <p className="mt-1">Cierra sesión si hace falta, inicia sesión y captura.</p>
            <p className="mt-1 font-mono text-xs text-zinc-500">artifacts/02-acceso.png</p>
          </div>
        </div>

        <InstitutionLoginForm />
      </div>
    </PageShell>
  );
}
