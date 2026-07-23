import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  FileText,
  Briefcase,
  Package,
  Users,
  Landmark,
  LifeBuoy,
  LayoutGrid,
  Vote,
  Code2,
  Globe,
  BookOpen,
  ScrollText,
  FileStack,
  Rocket,
  Layers,
  ShieldCheck,
  FileCheck,
  MoreHorizontal,
  LayoutDashboard,
  TrendingDown,
} from 'lucide-react';

import type { ImplementationId } from './implementations.js';
import { EGS_CONSOLE_PATH, EGS_MODEL_PATH } from './agigovModels.js';
import { INSTITUTION_ROUTES } from './institutionalRoutes.js';

export type NavItem = {
  to: string;
  label: string;
  hint?: string;
  icon: LucideIcon;
};

export type NavGroup = {
  label: string;
  items: readonly NavItem[];
  collapsible?: boolean;
};

export type NavSection = {
  id: 'modelo' | 'ven' | 'ven-funnel' | 'ven-more' | 'resources' | 'institutional';
  label: string;
  subtitle: string;
  items?: readonly NavItem[];
  groups?: readonly NavGroup[];
  cta?: { to: string; label: string; hint?: string; icon: LucideIcon };
};

/** Modelo genérico — cualquier país adapta AGIGOV-[ISO]. */
export const NAV_SECTION_MODELO: NavSection = {
  id: 'modelo',
  label: 'Gobernanza 2.0',
  subtitle: 'Modelo AGIGOV · global',
  items: [
    { to: '/', label: 'Inicio', hint: 'Presentación cinematográfica', icon: LayoutGrid },
    { to: '/institucional#vision', label: 'La visión', hint: 'Actos I–V · sueño institucional', icon: LayoutGrid },
    { to: '/#modelo', label: 'Modelo', hint: 'Tres pilares del protocolo', icon: Layers },
    { to: '/institucional#protocolo', label: 'Protocolo', hint: 'IAP · firmas · agentes', icon: Globe },
    { to: '/institucional#whitepaper', label: 'White paper', hint: 'Marco normativo global', icon: ScrollText },
    { to: '/institucional#documentacion', label: 'Documentación', hint: 'Carta · especificación', icon: FileStack },
    { to: '/modelos', label: 'Modelos', hint: 'Catálogo gubernamental · empresarial · ciudadano', icon: Package },
    { to: '/desarrolladores', label: 'Desarrolladores', hint: 'API · OpenAPI · integradores', icon: Code2 },
  ],
  cta: {
    to: INSTITUTION_ROUTES.register,
    label: 'Probar el modelo',
    hint: 'Registro institucional · piloto EGS',
    icon: Rocket,
  },
} as const;

/** Acceso institucional — registro, login, piloto. */
export const NAV_SECTION_INSTITUTIONAL: NavSection = {
  id: 'institutional',
  label: 'Institucional',
  subtitle: 'Gobierno · piloto fiscal',
  items: [
    {
      to: INSTITUTION_ROUTES.register,
      label: 'Registro',
      hint: 'Perfil de entidad · sandbox',
      icon: Landmark,
    },
    {
      to: INSTITUTION_ROUTES.login,
      label: 'Acceso',
      hint: 'Inicio de sesión institucional',
      icon: ShieldCheck,
    },
    {
      to: INSTITUTION_ROUTES.pilot,
      label: 'Piloto EGS',
      hint: 'Wizard fiscal 7 pasos',
      icon: Rocket,
    },
    {
      to: INSTITUTION_ROUTES.hub,
      label: 'Hub institucional',
      hint: 'Carta · protocolo · concierge',
      icon: ScrollText,
    },
  ],
} as const;

/** Operación — modelos y consolas. */
export const NAV_SECTION_SERVICES: NavSection = {
  id: 'ven-funnel',
  label: 'Servicios',
  subtitle: 'Modelos AGIGOV',
  items: [
    {
      to: '/modelos',
      label: 'Catálogo',
      hint: 'Todos los modelos del sistema',
      icon: Package,
    },
    {
      to: EGS_MODEL_PATH,
      label: 'Efficiency Gain Share',
      hint: 'Ahorro fiscal verificado · Q-Close',
      icon: TrendingDown,
    },
    {
      to: EGS_CONSOLE_PATH,
      label: 'Consola EGS',
      hint: 'Salud presupuestaria · reconciliación',
      icon: LayoutDashboard,
    },
    {
      to: '/contratos',
      label: 'Escrow · Contratos',
      hint: 'Hitos · cadena de custodia',
      icon: FileCheck,
    },
    {
      to: '/gestion',
      label: 'Gestión verificable',
      hint: 'Telemetría ledger publicada',
      icon: Activity,
    },
  ],
} as const;

/** @deprecated Usar NAV_SECTION_SERVICES */
export const NAV_SECTION_VEN_FUNNEL: NavSection = NAV_SECTION_SERVICES;

/** Participación y economía — colapsado bajo «Más». */
export const NAV_SECTION_VEN_MORE: NavSection = {
  id: 'ven-more',
  label: 'Más',
  subtitle: 'Participación · recursos',
  groups: [
    {
      label: 'Participación',
      items: [
        { to: '/propuestas', label: 'Propuestas', hint: 'Dictámenes ciudadanos', icon: FileText },
        { to: '/participar', label: 'Participar', hint: 'Enviar propuesta', icon: Users },
        { to: '/cne', label: 'Consulta electoral', hint: 'Sistema electoral tokenizado', icon: Vote },
      ],
    },
    {
      label: 'Economía',
      items: [
        { to: '/proyectos?tab=dao', label: 'Proyectos DAO', hint: 'Escrow ciudadano', icon: Briefcase },
        { to: '/suministros', label: 'Suministros', hint: 'Logístico territorial', icon: Package },
      ],
    },
    {
      label: 'Recursos',
      items: [
        { to: '/institucional', label: 'Institucional', hint: 'Carta y protocolo', icon: Landmark },
        { to: '/ayuda', label: 'Centro de ayuda', hint: 'Tutoriales', icon: LifeBuoy },
        { to: '/desarrolladores', label: 'Desarrolladores', hint: 'API pública', icon: Code2 },
      ],
    },
  ],
} as const;

/** @deprecated Operación VEN expandida — usar funnel + more */
export const NAV_SECTION_VEN: NavSection = NAV_SECTION_VEN_FUNNEL;

export const NAV_SECTION_RESOURCES: NavSection = {
  id: 'resources',
  label: 'Recursos',
  subtitle: 'Ayuda y aprendizaje',
  items: [
    { to: '/ayuda', label: 'Centro de ayuda', hint: 'Tutoriales paso a paso', icon: LifeBuoy },
    { to: '/aprender/glosario', label: 'Glosario', hint: 'Términos clave', icon: BookOpen },
    { to: '/institucional', label: 'Institucional', hint: 'Carta y concierge', icon: Landmark },
  ],
} as const;

export function usesFunnelNav(_implementationId: ImplementationId): boolean {
  return true;
}

export function getNavSidebarSections(_implementationId: ImplementationId): readonly NavSection[] {
  return [NAV_SECTION_INSTITUTIONAL, NAV_SECTION_SERVICES, NAV_SECTION_VEN_MORE];
}

/** @deprecated Usar getNavSidebarSections */
export const NAV_SIDEBAR_SECTIONS: readonly NavSection[] = [
  NAV_SECTION_MODELO,
  NAV_SECTION_VEN_FUNNEL,
  NAV_SECTION_RESOURCES,
] as const;

export const NAV_VEN_FUNNEL_ITEMS: readonly NavItem[] = NAV_SECTION_VEN_FUNNEL.items!;

export const NAV_VEN_MORE_ITEMS: readonly NavItem[] = NAV_SECTION_VEN_MORE.groups!.flatMap(
  (g) => g.items,
);

/** @deprecated Usar NAV_VEN_FUNNEL_ITEMS */
export const NAV_VEN_ITEMS: readonly NavItem[] = NAV_VEN_MORE_ITEMS;

/** @deprecated Usar NAV_VEN_ITEMS */
export const NAV_EXPLORE = NAV_VEN_ITEMS;

export const NAV_AYUDA: readonly NavItem[] = [
  NAV_SECTION_RESOURCES.items![0],
  NAV_SECTION_RESOURCES.items![1],
];

export const NAV_PARTICIPAR: NavItem = NAV_VEN_MORE_ITEMS.find((i) => i.to === '/participar')!;

export const NAV_INSTITUCIONAL: NavItem = NAV_SECTION_RESOURCES.items!.find(
  (i) => i.to === '/institucional',
)!;

export const NAV_DESARROLLADORES: NavItem = NAV_SECTION_MODELO.items!.find(
  (i) => i.to === '/desarrolladores',
)!;

export const NAV_AYUDA_HUB: NavItem = NAV_SECTION_RESOURCES.items![0];

export const NAV_HOME: NavItem = NAV_SECTION_MODELO.items![0];

export const NAV_MORE_ICON = MoreHorizontal;

export function isNavActive(
  pathname: string,
  hash: string,
  to: string,
  search = '',
): boolean {
  const [path, queryString] = to.split('?');
  const query = queryString ? new URLSearchParams(queryString) : null;
  const tabParam = query?.get('tab');
  const currentParams = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const currentTab = currentParams.get('tab');

  if (to.includes('#') && !to.startsWith('/#')) {
    const [basePath, anchor] = to.split('#');
    if (basePath === '/' && pathname === '/') return hash === `#${anchor}`;
    return pathname === basePath && hash === `#${anchor}`;
  }

  if (to.includes('#') && to.startsWith('/#')) {
    const anchor = to.slice(2);
    return pathname === '/' && hash === `#${anchor}`;
  }

  if (tabParam && pathname === path) {
    if (tabParam === 'salud') {
      return currentTab === 'salud' || currentTab === null;
    }
    return currentTab === tabParam;
  }

  if (path === '/') return pathname === '/';
  if (path === '/ayuda') return pathname === '/ayuda' || pathname.startsWith('/ayuda/');
  if (path === '/proyectos' && !tabParam) {
    return pathname === '/proyectos' || pathname.startsWith('/proyectos/contrato/');
  }
  if (path === EGS_CONSOLE_PATH || path === EGS_MODEL_PATH) {
    return pathname === path || pathname.startsWith(`${path}/`);
  }
  if (path === '/modelos') {
    return pathname === '/modelos' || pathname.startsWith('/modelos/');
  }
  if (path === '/contratos') {
    return pathname === '/contratos' || pathname.startsWith('/proyectos/contrato/');
  }
  if (path === '/institucional') {
    return pathname === '/institucional';
  }
  if (path.startsWith('/institucional/')) {
    return pathname === path || pathname.startsWith(`${path}/`);
  }

  return pathname === path || pathname.startsWith(`${path}/`);
}

export function usesAppShell(pathname: string): boolean {
  return pathname !== '/';
}

export function usesFunnelShell(pathname: string, implementationId: ImplementationId): boolean {
  if (!usesAppShell(pathname)) return false;
  return usesFunnelNav(implementationId);
}
