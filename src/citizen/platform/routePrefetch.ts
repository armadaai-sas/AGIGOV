/** Prefetch de chunks lazy en idle / hover — rutas ya eager se omiten. */

type Loader = () => Promise<unknown>;

const LOADERS: Array<{ test: (path: string) => boolean; load: Loader }> = [
  { test: (p) => p.startsWith('/modelos/iaau/consola'), load: () => import('../pages/IaauConsolePage.js') },
  { test: (p) => p.startsWith('/modelos/data-trust/consola'), load: () => import('../pages/DataTrustConsolePage.js') },
  {
    test: (p) => p.startsWith('/modelos/evidencia-certificada/consola'),
    load: () => import('../pages/EvidenciaConsolePage.js'),
  },
  { test: (p) => p.startsWith('/modelos/set/consola'), load: () => import('../pages/SetConsolePage.js') },
  { test: (p) => p.startsWith('/institucional/piloto'), load: () => import('../pages/InstitutionPilotPage.js') },
  { test: (p) => p.startsWith('/institucional/registro'), load: () => import('../pages/InstitutionRegisterPage.js') },
  { test: (p) => p.startsWith('/institucional/acceso'), load: () => import('../pages/InstitutionAccessPage.js') },
  { test: (p) => p.startsWith('/institucional'), load: () => import('../pages/InstitutionalPage.js') },
  { test: (p) => p.startsWith('/empresas'), load: () => import('../pages/EnterpriseHubPage.js') },
  { test: (p) => p.startsWith('/ayuda/'), load: () => import('../pages/HelpTutorialPage.js') },
  { test: (p) => p.startsWith('/ayuda'), load: () => import('../pages/HelpCenterPage.js') },
  { test: (p) => p.startsWith('/proyectos'), load: () => import('../pages/ProjectsPage.js') },
  { test: (p) => p.startsWith('/propuestas'), load: () => import('../pages/ProposalsPage.js') },
  { test: (p) => p.startsWith('/participar'), load: () => import('../pages/ParticiparPage.js') },
  { test: (p) => p.startsWith('/desarrolladores'), load: () => import('../pages/DevelopersPage.js') },
  { test: (p) => p.startsWith('/transparencia'), load: () => import('../pages/TransparenciaPage.js') },
  { test: (p) => p.startsWith('/cne'), load: () => import('../pages/CnePage.js') },
  { test: (p) => p.startsWith('/suministros'), load: () => import('../pages/SupplyPage.js') },
  { test: (p) => p.startsWith('/aprender/glosario'), load: () => import('../pages/GlosarioPage.js') },
];

const started = new Set<string>();

function normalizePath(path: string): string {
  const base = path.split('?')[0]?.split('#')[0] ?? path;
  if (base.length > 1 && base.endsWith('/')) return base.slice(0, -1);
  return base;
}

export function prefetchRoute(path: string): void {
  const normalized = normalizePath(path);
  if (started.has(normalized)) return;

  for (const { test, load } of LOADERS) {
    if (test(normalized)) {
      started.add(normalized);
      void load();
      return;
    }
  }
}

/** Precarga chunks lazy frecuentes tras el primer paint. */
export function prefetchWarmRoutes(): void {
  const run = () => {
    prefetchRoute('/institucional/piloto');
    prefetchRoute('/empresas');
    prefetchRoute('/proyectos');
    prefetchRoute('/desarrolladores');
  };
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(run, { timeout: 2500 });
  } else {
    window.setTimeout(run, 800);
  }
}
