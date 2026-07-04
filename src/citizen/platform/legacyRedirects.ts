const MODELS_BASE = '/modelos';

export type LegacyRedirectMeta = {
  from: string;
  to: string;
  label: string;
};

/** Rutas legacy VEN → catálogo AGIGOV. */
export const LEGACY_VEN_REDIRECTS: Record<string, { to: string; label: string }> = {
  '/ven/servicios': { to: MODELS_BASE, label: 'Catálogo de modelos' },
  '/ven/servicios/egs-vial': { to: `${MODELS_BASE}/egs`, label: 'Efficiency Gain Share (EGS)' },
  '/ven/servicios/egs-vial/consola': {
    to: `${MODELS_BASE}/egs/consola`,
    label: 'Consola EGS',
  },
};

const LEGACY_PREFIX = '/ven/servicios';

export function resolveLegacyVenRedirect(pathname: string): LegacyRedirectMeta | null {
  const exact = LEGACY_VEN_REDIRECTS[pathname];
  if (exact) {
    return { from: pathname, to: exact.to, label: exact.label };
  }

  if (pathname.startsWith(`${LEGACY_PREFIX}/`)) {
    return {
      from: pathname,
      to: MODELS_BASE,
      label: 'Catálogo de modelos',
    };
  }

  if (pathname === LEGACY_PREFIX) {
    return {
      from: pathname,
      to: MODELS_BASE,
      label: 'Catálogo de modelos',
    };
  }

  return null;
}

/** Mapa plano legacy → destino (compat docs/scripts). */
export const LEGACY_VEN_REDIRECT_TARGETS: Record<string, string> = Object.fromEntries(
  Object.entries(LEGACY_VEN_REDIRECTS).map(([from, { to }]) => [from, to]),
);
