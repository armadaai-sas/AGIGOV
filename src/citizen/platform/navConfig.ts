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
  BookOpen,
  ScrollText,
  Rocket,
  Layers,
  FileCheck,
  Monitor,
  MoreHorizontal,
  LayoutDashboard,
  TrendingDown,
} from 'lucide-react';

import type { ImplementationId } from './implementations.js';
import { EGS_MODEL_PATH } from './agigovModels.js';
import { modelWorkspacePath } from './modelWorkspace.js';
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
  id: 'modelos' | 'operar' | 'cuenta' | 'ven-more' | 'modelo' | 'ven' | 'ven-funnel' | 'resources' | 'institutional';
  label: string;
  subtitle: string;
  items?: readonly NavItem[];
  groups?: readonly NavGroup[];
  cta?: { to: string; label: string; hint?: string; icon: LucideIcon };
};

/** @deprecated Marketing-only — not in OS dock */
export const NAV_SECTION_MODELO: NavSection = {
  id: 'modelo',
  label: 'Gobernanza 2.0',
  subtitle: 'Modelo AGIGOV · global',
  items: [
    { to: '/', label: 'Inicio', hint: 'Sistema operativo del Estado', icon: LayoutGrid },
    { to: '/institucional', label: 'Institucional', hint: 'Sandbox · hablar · cuenta', icon: Landmark },
    { to: '/#autoridad', label: 'Por qué OS', hint: 'OS vs agentes / LLMs', icon: Layers },
    { to: '/ayuda/institucional', label: 'Qué es AGIGOV', hint: 'Tutorial · protocolo · Carta', icon: ScrollText },
    { to: '/modelos', label: 'Modelos', hint: 'Catálogo · gobierno · empresa · ciudadano', icon: Package },
    { to: '/desarrolladores', label: 'Desarrolladores', hint: 'API · especificación · integradores', icon: Code2 },
  ],
  cta: {
    to: INSTITUTION_ROUTES.register,
    label: 'Abrir entorno de prueba',
    hint: 'Registro autoservicio → tenant',
    icon: Rocket,
  },
} as const;

/** OS dock — Modelos */
export const NAV_SECTION_MODELS: NavSection = {
  id: 'modelos',
  label: 'Modelos',
  subtitle: 'Modelos operativos del OS',
  items: [
    {
      to: '/modelos',
      label: 'Todas',
      hint: 'Gobierno · empresa · ciudadano',
      icon: Package,
    },
    {
      to: EGS_MODEL_PATH,
      label: 'EGS',
      hint: 'Ahorro fiscal con evidencia',
      icon: TrendingDown,
    },
  ],
} as const;

/** OS dock — Operar */
export const NAV_SECTION_OPERATE: NavSection = {
  id: 'operar',
  label: 'Operar',
  subtitle: 'Escritorio y flujo',
  items: [
    {
      to: INSTITUTION_ROUTES.desk,
      label: 'Escritorio',
      hint: 'Inicio del OS',
      icon: LayoutDashboard,
    },
    {
      to: modelWorkspacePath('egs'),
      label: 'EGS',
      hint: 'Espacio de trabajo',
      icon: TrendingDown,
    },
    {
      to: '/contratos',
      label: 'Contratos',
      hint: 'Custodia por hitos',
      icon: FileCheck,
    },
    {
      to: '/gestion',
      label: 'Gestión pública',
      hint: 'Registro publicado',
      icon: ScrollText,
    },
  ],
} as const;

/** OS dock — Cuenta */
export const NAV_SECTION_ACCOUNT: NavSection = {
  id: 'cuenta',
  label: 'Cuenta',
  subtitle: 'Acceso y ayuda',
  items: [
    {
      to: INSTITUTION_ROUTES.register,
      label: 'Entorno de prueba',
      hint: 'Registro autoservicio',
      icon: Rocket,
    },
    {
      to: INSTITUTION_ROUTES.pilot,
      label: 'Piloto fiscal',
      hint: 'Asistente institucional',
      icon: Landmark,
    },
    {
      to: '/descargar',
      label: 'App de escritorio',
      hint: 'Windows · macOS · Linux',
      icon: Monitor,
    },
    {
      to: '/ayuda',
      label: 'Ayuda',
      hint: 'Tutoriales y glosario',
      icon: LifeBuoy,
    },
    {
      to: '/institucional',
      label: 'Institucional',
      hint: 'Protocolo y contacto',
      icon: Landmark,
    },
  ],
} as const;

/** @deprecated Usar NAV_SECTION_CITIZEN */
export const NAV_SECTION_CITIZEN: NavSection = {
  id: 'ven',
  label: 'Ciudadano',
  subtitle: 'Ver · participar',
  items: [
    {
      to: '/gestion',
      label: 'Gestión pública',
      hint: 'Registro público · datos verificables',
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

/** @deprecated Usar NAV_SECTION_MODELS */
export const NAV_SECTION_SERVICES: NavSection = {
  id: 'ven-funnel',
  label: 'Modelos',
  subtitle: 'Modelos del OS',
  items: [
    {
      to: '/modelos',
      label: 'Modelos',
      hint: 'Catálogo del sistema',
      icon: Package,
    },
    {
      to: modelWorkspacePath('egs'),
      label: 'EGS',
      hint: 'Espacio de trabajo',
      icon: LayoutDashboard,
    },
    {
      to: '/contratos',
      label: 'Contratos',
      hint: 'Custodia · cadena de evidencia',
      icon: FileCheck,
    },
  ],
} as const;

/** OS dock — sistema (herramientas, no auth). Auth vive en topbar. */
export const NAV_SECTION_INSTITUTIONAL: NavSection = {
  id: 'institutional',
  label: 'Sistema',
  subtitle: 'Escritorio · ayuda · contacto',
  items: [
    {
      to: INSTITUTION_ROUTES.desk,
      label: 'Escritorio',
      hint: 'Inicio del OS — elige una acción',
      icon: LayoutDashboard,
    },
    {
      to: '/ayuda',
      label: 'Ayuda',
      hint: 'Tutoriales y glosario',
      icon: LifeBuoy,
    },
    {
      to: '/#contacto',
      label: 'Contacto',
      hint: 'Entorno de prueba o hablar con el equipo',
      icon: Landmark,
    },
  ],
} as const;

/** @deprecated Usar NAV_SECTION_SERVICES */
export const NAV_SECTION_VEN_FUNNEL: NavSection = NAV_SECTION_SERVICES;

/** Secundario — Más rutas */
export const NAV_SECTION_VEN_MORE: NavSection = {
  id: 'ven-more',
  label: 'Más',
  subtitle: 'Extra',
  groups: [
    {
      label: 'Participación',
      items: [
        { to: '/participar', label: 'Participar', hint: 'Propuestas', icon: Users },
        { to: '/propuestas', label: 'Propuestas', hint: 'Dictámenes', icon: FileText },
        { to: '/cne', label: 'Consulta electoral', hint: 'Demo SET', icon: Vote },
      ],
    },
    {
      label: 'Economía',
      items: [
        { to: '/proyectos?tab=dao', label: 'Proyectos DAO', hint: 'Custodia ciudadana', icon: Briefcase },
        { to: '/suministros', label: 'Suministros', hint: 'Logístico', icon: Package },
        { to: '/transparencia', label: 'Transparencia', hint: 'Telemetría', icon: Activity },
      ],
    },
    {
      label: 'Integradores',
      items: [
        { to: '/desarrolladores', label: 'API', hint: 'Documentación', icon: Code2 },
        { to: '/aprender/glosario', label: 'Glosario', hint: 'Términos', icon: BookOpen },
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
    { to: '/institucional', label: 'Institucional', hint: 'Sandbox y hablar con el equipo', icon: Landmark },
  ],
} as const;

export function usesFunnelNav(_implementationId: ImplementationId): boolean {
  return true;
}

/** Dock OS: Modelos → Operar → Cuenta → Más. */
export function getNavSidebarSections(_implementationId: ImplementationId): readonly NavSection[] {
  return [NAV_SECTION_MODELS, NAV_SECTION_OPERATE, NAV_SECTION_ACCOUNT, NAV_SECTION_VEN_MORE];
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

/** Concierge solo donde no hay sidebar completo de ayuda/contacto duplicado. */
export function usesConciergeDock(pathname: string): boolean {
  if (pathname === '/' || pathname.startsWith('/escritorio')) return false;
  return (
    pathname.startsWith('/ayuda') ||
    pathname.startsWith('/institucional') ||
    pathname === '/desarrolladores'
  );
}

export function usesFunnelShell(pathname: string, implementationId: ImplementationId): boolean {
  if (!usesAppShell(pathname)) return false;
  return usesFunnelNav(implementationId);
}
