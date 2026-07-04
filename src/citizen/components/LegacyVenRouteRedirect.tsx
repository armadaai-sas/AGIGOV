import { Navigate, useLocation } from 'react-router-dom';

import { resolveLegacyVenRedirect } from '../platform/legacyRedirects.js';

export function LegacyVenRouteRedirect() {
  const { pathname } = useLocation();
  const meta = resolveLegacyVenRedirect(pathname);

  if (!meta) {
    return <Navigate to="/modelos" replace />;
  }

  return <Navigate to={meta.to} replace state={{ legacyRedirect: meta }} />;
}
