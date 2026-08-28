import { ShieldAlert } from 'lucide-react';

import { fetchHealth } from '../api.js';
import { useCachedFetch } from '../hooks/useCitizenData.js';

/** Banner global cuando centinela activa PANIC_MODE (Fase E5). */
export function PanicBanner() {
  const { data } = useCachedFetch('platform-health', fetchHealth, 15_000);

  if (!data?.panicMode) return null;

  return (
    <div className="agigov-panic-banner" role="alert">
      <ShieldAlert className="h-4 w-4 shrink-0" aria-hidden />
      <div>
        <p className="agigov-panic-banner-title">Sistema congelado</p>
        <p className="agigov-panic-banner-lead">
          Centinela suspendió mutaciones al ledger. Propuestas y aportes están pausados hasta
          des-congelamiento autorizado.
        </p>
      </div>
    </div>
  );
}
