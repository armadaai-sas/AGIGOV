import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  Briefcase,
  Code2,
  Database,
  FileCheck,
  FileText,
  Landmark,
  LayoutDashboard,
  Package,
  Receipt,
  Rocket,
  ScrollText,
  Server,
  TrendingDown,
  Users,
} from 'lucide-react';

import type { LandingPersonaId } from '../content/landingMinimalCopy.js';
import { ENTERPRISE_ROUTES } from './enterpriseRoutes.js';
import { EGS_MODEL_PATH } from './agigovModels.js';
import { INSTITUTION_ROUTES } from './institutionalRoutes.js';
import { modelWorkspacePath } from './modelWorkspace.js';

/** Alineado al landing — 4 tipos de usuario del desk. */
export type DeskPersonaId = LandingPersonaId;

const DESK_PERSONA_KEY = 'agigov.desk.persona';

export type DeskNavItem = {
  to: string;
  label: string;
  /** Resultado Y — por qué el usuario elige esta utilidad. */
  outcome: string;
  icon: LucideIcon;
};

export type DeskNavSection = {
  id: 'utilidad' | 'resultado';
  label: string;
  items: readonly DeskNavItem[];
};

export type DeskWorkspaceCard = {
  to: string;
  name: string;
  utility: string;
  outcome: string;
  icon: LucideIcon;
};

export const DESK_PERSONA_IDS: readonly DeskPersonaId[] = [
  'state',
  'citizen',
  'enterprise',
  'integrator',
] as const;

export function readStoredDeskPersona(): DeskPersonaId {
  if (typeof window === 'undefined') return 'citizen';
  const raw = window.localStorage.getItem(DESK_PERSONA_KEY);
  if (raw && DESK_PERSONA_IDS.includes(raw as DeskPersonaId)) {
    return raw as DeskPersonaId;
  }
  return 'citizen';
}

export function storeDeskPersona(id: DeskPersonaId): void {
  window.localStorage.setItem(DESK_PERSONA_KEY, id);
}

export function deskPersonaHomePath(id: DeskPersonaId): string {
  switch (id) {
    case 'state':
      return INSTITUTION_ROUTES.desk;
    case 'citizen':
      return '/gestion';
    case 'enterprise':
      return ENTERPRISE_ROUTES.hub;
    case 'integrator':
      return '/desarrolladores';
  }
}

/** Inferir persona desde la ruta activa. */
export function inferDeskPersonaFromPath(pathname: string): DeskPersonaId | null {
  if (
    pathname.startsWith('/institucional') ||
    pathname.startsWith('/contratos') ||
    pathname.includes('/egs')
  ) {
    return 'state';
  }
  if (
    pathname.startsWith('/empresas') ||
    pathname.includes('data-trust') ||
    pathname.includes('evidencia-certificada') ||
    pathname.includes('/iaau')
  ) {
    return 'enterprise';
  }
  if (pathname.startsWith('/desarrolladores') || pathname.startsWith('/aprender/glosario')) {
    return 'integrator';
  }
  if (
    pathname.startsWith('/gestion') ||
    pathname.startsWith('/participar') ||
    pathname.startsWith('/propuestas') ||
    pathname.startsWith('/transparencia')
  ) {
    return 'citizen';
  }
  return null;
}

const CITIZEN_NAV: readonly DeskNavSection[] = [
  {
    id: 'utilidad',
    label: 'Hacer',
    items: [
      {
        to: '/participar',
        label: 'Participar',
        outcome: 'Enviar propuesta con hechos',
        icon: Users,
      },
    ],
  },
  {
    id: 'resultado',
    label: 'Ver',
    items: [
      {
        to: '/gestion',
        label: 'Gestión pública',
        outcome: 'Registro verificable en vivo',
        icon: Activity,
      },
      {
        to: '/propuestas',
        label: 'Dictámenes',
        outcome: 'Propuestas publicadas',
        icon: FileText,
      },
    ],
  },
] as const;

const ENTERPRISE_NAV: readonly DeskNavSection[] = [
  {
    id: 'utilidad',
    label: 'Hacer',
    items: [
      {
        to: ENTERPRISE_ROUTES.hub,
        label: 'Recorrido A→Z',
        outcome: 'Catálogo → DATA → contacto',
        icon: Briefcase,
      },
      {
        to: '/modelos/data-trust',
        label: 'DATA Trust',
        outcome: 'Agregados sectoriales verificables',
        icon: Database,
      },
      {
        to: '/modelos/evidencia-certificada',
        label: 'Evidencia API',
        outcome: 'Certificar hitos de contrato',
        icon: Receipt,
      },
    ],
  },
  {
    id: 'resultado',
    label: 'Ver',
    items: [
      {
        to: '/contratos',
        label: 'Contratos',
        outcome: 'Custodia y liberación por hito',
        icon: FileCheck,
      },
      {
        to: '/modelos/iaau',
        label: 'IaaU',
        outcome: 'Infra por uso — firma y sync',
        icon: Server,
      },
    ],
  },
] as const;

const STATE_NAV: readonly DeskNavSection[] = [
  {
    id: 'utilidad',
    label: 'Hacer',
    items: [
      {
        to: INSTITUTION_ROUTES.pilot,
        label: 'Piloto fiscal',
        outcome: 'Asistente EGS institucional',
        icon: Rocket,
      },
      {
        to: modelWorkspacePath('egs'),
        label: 'EGS',
        outcome: 'Operar ahorro con evidencia',
        icon: TrendingDown,
      },
    ],
  },
  {
    id: 'resultado',
    label: 'Ver',
    items: [
      {
        to: '/gestion',
        label: 'Gestión pública',
        outcome: 'Telemetría y ledger publicado',
        icon: ScrollText,
      },
      {
        to: '/contratos',
        label: 'Contratos',
        outcome: 'Cadena de custodia por hitos',
        icon: FileCheck,
      },
    ],
  },
] as const;

const INTEGRATOR_NAV: readonly DeskNavSection[] = [
  {
    id: 'utilidad',
    label: 'Hacer',
    items: [
      {
        to: '/desarrolladores',
        label: 'API',
        outcome: 'Health, OpenAPI e integración',
        icon: Code2,
      },
      {
        to: '/modelos',
        label: 'Modelos',
        outcome: 'Catálogo y espacios de trabajo',
        icon: Package,
      },
    ],
  },
  {
    id: 'resultado',
    label: 'Ver',
    items: [
      {
        to: '/contratos',
        label: 'Custodia',
        outcome: 'Hitos y evidencia en cadena',
        icon: FileCheck,
      },
      {
        to: '/aprender/glosario',
        label: 'Glosario',
        outcome: 'Protocolo e IAP en lenguaje claro',
        icon: Landmark,
      },
    ],
  },
] as const;

export function getDeskNavSections(persona: DeskPersonaId): readonly DeskNavSection[] {
  switch (persona) {
    case 'citizen':
      return CITIZEN_NAV;
    case 'enterprise':
      return ENTERPRISE_NAV;
    case 'state':
      return STATE_NAV;
    case 'integrator':
      return INTEGRATOR_NAV;
  }
}

export function getDeskWorkspaceCards(persona: DeskPersonaId): readonly DeskWorkspaceCard[] {
  switch (persona) {
    case 'citizen':
      return [
        {
          to: '/gestion',
          name: 'Gestión pública',
          utility: 'Consultar',
          outcome: 'Registro verificable',
          icon: Activity,
        },
        {
          to: '/participar',
          name: 'Participar',
          utility: 'Enviar',
          outcome: 'Propuesta con hechos',
          icon: Users,
        },
        {
          to: '/propuestas',
          name: 'Dictámenes',
          utility: 'Seguir',
          outcome: 'Estado de propuestas',
          icon: FileText,
        },
      ];
    case 'enterprise':
      return [
        {
          to: ENTERPRISE_ROUTES.hub,
          name: 'Recorrido empresas',
          utility: 'Descubrir',
          outcome: 'A→Z B2B',
          icon: Briefcase,
        },
        {
          to: '/modelos/data-trust',
          name: 'DATA Trust',
          utility: 'Consultar',
          outcome: 'Agregados verificables',
          icon: Database,
        },
        {
          to: '/modelos/evidencia-certificada',
          name: 'Evidencia API',
          utility: 'Certificar',
          outcome: 'Hitos demostrables',
          icon: Receipt,
        },
        {
          to: '/contratos',
          name: 'Contratos',
          utility: 'Cobrar',
          outcome: 'Menos fricción por hito',
          icon: FileCheck,
        },
      ];
    case 'state':
      return [
        {
          to: INSTITUTION_ROUTES.pilot,
          name: 'Piloto fiscal',
          utility: 'Desplegar',
          outcome: 'EGS con asistencia',
          icon: Rocket,
        },
        {
          to: modelWorkspacePath('egs'),
          name: 'EGS',
          utility: 'Operar',
          outcome: 'Ahorro certificado',
          icon: TrendingDown,
        },
        {
          to: '/gestion',
          name: 'Gestión pública',
          utility: 'Publicar',
          outcome: 'Telemetría ciudadana',
          icon: ScrollText,
        },
        {
          to: '/contratos',
          name: 'Contratos',
          utility: 'Custodiar',
          outcome: 'Hitos con evidencia',
          icon: FileCheck,
        },
      ];
    case 'integrator':
      return [
        {
          to: '/desarrolladores',
          name: 'API',
          utility: 'Integrar',
          outcome: 'Health y OpenAPI',
          icon: Code2,
        },
        {
          to: '/modelos',
          name: 'Modelos',
          utility: 'Explorar',
          outcome: 'Espacios IAP',
          icon: Package,
        },
        {
          to: '/contratos',
          name: 'Custodia',
          utility: 'Probar',
          outcome: 'Flujo de hitos',
          icon: FileCheck,
        },
      ];
  }
}

/** Escritorio siempre accesible — primer ítem del rail. */
export const DESK_HOME_ITEM: DeskNavItem = {
  to: INSTITUTION_ROUTES.desk,
  label: 'Escritorio',
  outcome: 'Tu espacio de trabajo',
  icon: LayoutDashboard,
};

export function getDeskSidebarItems(persona: DeskPersonaId): readonly DeskNavItem[] {
  return [DESK_HOME_ITEM, ...getDeskNavSections(persona).flatMap((s) => s.items)];
}
