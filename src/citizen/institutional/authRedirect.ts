import { EGS_CONSOLE_PATH } from '../platform/agigovModels.js';
import { INSTITUTION_ROUTES } from '../platform/institutionalRoutes.js';

const SAFE_PREFIXES = [
  '/modelos/',
  '/institucional/',
  '/gestion',
  '/contratos',
  '/proyectos',
  '/escritorio',
  '/empresas',
];

/** Ruta interna segura post-login (query ?redirect= o state.from). */
export function resolvePostLoginRedirect(
  raw: string | null | undefined,
  fallback = EGS_CONSOLE_PATH,
): string {
  if (!raw?.trim()) return fallback;
  const path = raw.trim();
  if (!path.startsWith('/') || path.startsWith('//')) return fallback;
  if (path.startsWith('/institucional/acceso') || path.startsWith('/institucional/registro')) {
    return fallback;
  }
  const allowed = SAFE_PREFIXES.some((p) => path === p || path.startsWith(p));
  return allowed ? path : fallback;
}

export function loginPathWithRedirect(target: string): string {
  const redirect = resolvePostLoginRedirect(target);
  return `${INSTITUTION_ROUTES.login}?redirect=${encodeURIComponent(redirect)}`;
}
