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
    { to: '/', label: 'Inicio', hint: 'Sistema operativo del Estado', icon: LayoutGrid },
    { to: '/institucional#vision', label: 'La visión', hint: 'Actos I–V · sueño institucional', icon: LayoutGrid },
    { to: '/#modelo', label: 'Modelo', hint: 'Tres pilares del protocolo', icon: Layers },
    { to: '/institucional#protocolo', label: 'Protocolo', hint: 'IAP · firmas · agentes', icon: Globe },
    { to: '/institucional#whitepaper', label: 'White paper', hint: 'Marco normativo global', icon: ScrollText },
    { to: '/institucional#documentacion', label: 'Documentación', hint: 'Carta · especificación', icon: FileStack },
    { to: '/modelos', label: 'Modelos', hint: 'Apps del OS · gobierno · empresa · ciudadano', icon: Package },
    { to: '/desarrolladores', label: 'Desarrolladores', hint: 'API · OpenAPI · integradores', icon: Code2 },
  ],
  cta: {
    to: INSTITUTION_ROUTES.register,
    label: 'Probar el modelo',
    hint: 'Registro institucional · piloto EGS',
    icon: Rocket,
  },
} as const;

/** OS dock — ciudadano: ledger público y participación. */
export const NAV_SECTION_CITIZEN: NavSection = {
  id: 'ven',
  label: 'Ciudadano',
  subtitle: 'Ver · participar',
  items: [
    {
      to: '/gestion',
      label: 'Gestión pública',
      hint: 'Ledger público · datos verificables',
      icon: Activity,
    },
    {
      to: '/participar',
      label: 'Participar',
      hint: 'Enviar propuesta con hechos',
      icon: Users,
    },
    {
      to: '/propuestas',
      label: 'Propuestas',
      hint: 'Dictámenes publicados',
      icon: FileText,
    },
  ],
} as const;

/** OS dock — apps / modelos. */
export const NAV_SECTION_SERVICES: NavSection = {
  id: 'ven-funnel',
  label: 'Apps',
  subtitle: 'Modelos del OS',
  items: [
    {
      to: '/modelos',
      label: 'Modelos',
      hint: 'Apps del sistema',
      icon: Package,
    },
    {
      to: EGS_CONSOLE_PATH,
      label: 'Consola EGS',
      hint: 'Escritorio operativo · salud fiscal',
      icon: LayoutDashboard,
    },
    {
      to: '/contratos',
      label: 'Contratos',
      hint: 'Escrow · cadena de custodia',
      icon: FileCheck,
    },
  ],
} as const;

/** OS dock — sistema (desplegar + ayuda). */
export const NAV_SECTION_INSTITUTIONAL: NavSection = {
  id: 'institutional',
  label: 'Sistema',
  subtitle: 'Escritorio · desplegar · ayuda',
  items: [
    {
      to: INSTITUTION_ROUTES.desk,
      label: 'Escritorio',
      hint: 'Inicio del OS — elige una acción',
      icon: LayoutDashboard,
    },
    {
      to: INSTITUTION_ROUTES.register,
      label: 'Crear cuenta',
      hint: 'Registro institucional corto',
      icon: Rocket,
    },
    {
      to: INSTITUTION_ROUTES.login,
      label: 'Acceso',
      hint: 'Iniciar sesión',
      icon: ShieldCheck,
    },
    {
      to: '/ayuda',
      label: 'Ayuda',
      hint: 'Tutoriales y glosario',
      icon: LifeBuoy,
    },
  ],
} as const;

/** @deprecated Usar NAV_SECTION_SERVICES */
export const NAV_SECTION_VEN_FUNNEL: NavSection = NAV_SECTION_SERVICES;

/** Secundario — no va en el dock primario (command palette / rutas directas). */
export const NAV_SECTION_VEN_MORE: NavSection = {
  id: 'ven-more',
  label: 'Más',
  subtitle: 'Extra',
  groups: [
    {
      label: 'Participación',
      items: [
        { to: '/cne', label: 'Consulta electoral', hint: 'SET', icon: Vote },
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
        { to: '/institucional', label: 'Institucional', hint: 'Hub · carta', icon: Landmark },
        { to: '/desarrolladores', label: 'Desarrolladores', hint: 'API pública', icon: Code2 },
        { to: EGS_MODEL_PATH, label: 'Ficha EGS', hint: 'Detalle del modelo', icon: TrendingDown },
      ],
    },
  ],
} as const;

/** @deprecated */
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

/** Dock OS: Ciudadano → Apps → Sistema. */
export function getNavSidebarSections(_implementationId: ImplementationId): readonly NavSection[] {
  return [NAV_SECTION_CITIZEN, NAV_SECTION_SERVICES, NAV_SECTION_INSTITUTIONAL];
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

export const NAV_PARTICIPAR: NavItem = NAV_SECTION_CITIZEN.items!.find((i) => i.to === '/participar')!;

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

  if (!path) return false;

  if (tabParam) {
    return pathname === path.split('#')[0] && currentTab === tabParam;
  }

  const hashIdx = path.indexOf('#');
  if (hashIdx >= 0) {
    const base = path.slice(0, hashIdx);
    const wantHash = path.slice(hashIdx);
    return pathname === base && (hash === wantHash || hash === wantHash.slice(1));
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
