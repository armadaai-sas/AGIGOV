import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';

import { StateHint } from './PageShell.js';
import type { LegacyRedirectMeta } from '../platform/legacyRedirects.js';

type LocationState = {
  legacyRedirect?: LegacyRedirectMeta;
};

export function LegacyRedirectBanner() {
  const location = useLocation();
  const navigate = useNavigate();
  const meta = (location.state as LocationState | null)?.legacyRedirect;
  const [dismissed, setDismissed] = useState(false);

  if (!meta || dismissed) return null;
  if (location.pathname !== meta.to) return null;

  function dismiss() {
    setDismissed(true);
    navigate(
      { pathname: location.pathname, search: location.search, hash: location.hash },
      { replace: true, state: null },
    );
  }

  return (
    <div className="legacy-redirect-banner mb-6" role="status">
      <StateHint>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="agigov-page-state-kicker">Ruta actualizada</p>
            <p className="text-sm text-agigov-text">
              <code className="agigov-mono-id text-xs">{meta.from}</code> ahora vive en el catálogo
              AGIGOV: <strong>{meta.label}</strong>.
            </p>
            <p className="mt-2 text-xs text-agigov-text-muted">
              Guarda el nuevo enlace:{' '}
              <Link to={meta.to} className="text-sky-600 hover:underline dark:text-sky-400">
                {meta.to}
                <ArrowRight className="ml-1 inline h-3 w-3" aria-hidden />
              </Link>
            </p>
          </div>
          <button
            type="button"
            className="legacy-redirect-banner-dismiss"
            onClick={dismiss}
            aria-label="Cerrar aviso de ruta actualizada"
          >
            <X className="h-4 w-4" />
            Entendido
          </button>
        </div>
      </StateHint>
    </div>
  );
}
