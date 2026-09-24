import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  Code2,
  Database,
  FileCheck,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Package,
  Receipt,
  Rocket,
  Users,
} from 'lucide-react';

import type { LandingPersonaId } from '../content/landingMinimalCopy.js';
import { INSTITUTION_ROUTES } from './institutionalRoutes.js';

/** Alineado al landing — 4 tipos de usuario del desk. */
export type DeskPersonaId = LandingPersonaId;

const DESK_PERSONA_KEY = 'agigov.desk.persona';

export type DeskNavItem = {
  to: string;
  label: string;
  /** Resultado Y — por qué el usuario elige esta utilidad. */
  outcome: string;
  icon: LucideIcon;
  /** Primary muestra etiqueta; secondary solo icono + tooltip. */
  tier?: 'primary' | 'secondary';
};

export type DeskNavSection = {
  id: 'menu';
  label: string;
  items: readonly DeskNavItem[];
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

export function deskPersonaHomePath(_id: DeskPersonaId): string {
  return INSTITUTION_ROUTES.desk;
}

function menu(items: readonly DeskNavItem[]): readonly DeskNavSection[] {
  return [{ id: 'menu', label: '', items }];
}

const HELP = {
  to: '/ayuda',
  label: 'Ayuda',
  outcome: 'Qué es cada función y cómo se usa',
  icon: HelpCircle,
} as const;

const CITIZEN_NAV = menu([
  { to: '/participar', label: 'Participar', outcome: 'Enviar una propuesta con hechos', icon: Users },
  { to: '/propuestas', label: 'Propuestas', outcome: 'Lo que ya se publicó', icon: FileText },
  { to: '/gestion', label: 'Gestión pública', outcome: 'Actos publicados y verificables', icon: Activity },
  HELP,
]);

const ENTERPRISE_NAV = menu([
  { to: '/facturacion', label: 'Plan', outcome: 'Pedir licencia. El cobro queda pendiente', icon: Receipt },
  { to: '/modelos/data-trust', label: 'Datos del sector', outcome: 'Cifras agregadas, sin datos personales', icon: Database },
  { to: '/modelos/evidencia-certificada', label: 'Evidencia', outcome: 'Certificar un hito', icon: Receipt },
  { to: '/contratos', label: 'Contratos', outcome: 'Custodia y liberación por hito', icon: FileCheck },
  HELP,
]);

const STATE_NAV = menu([
  { to: '/facturacion', label: 'Plan', outcome: 'Pedir licencia. El cobro queda pendiente', icon: Receipt },
  { to: INSTITUTION_ROUTES.pilot, label: 'Piloto', outcome: 'Preparar el cierre del trimestre', icon: Rocket },
  { to: INSTITUTION_ROUTES.console, label: 'Ahorro', outcome: 'Lo publicado del trimestre', icon: Activity },
  { to: '/contratos', label: 'Contratos', outcome: 'Hitos y evidencia', icon: FileCheck },
  HELP,
]);

const INTEGRATOR_NAV = menu([
  { to: '/desarrolladores', label: 'API', outcome: 'Salud del servicio e integración', icon: Code2 },
  { to: '/modelos', label: 'Modelos', outcome: 'Catálogo y espacios de trabajo', icon: Package },
  HELP,
]);

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

/**
 * Primer ítem del rail: el escritorio, no el landing.
 * La marca del sidebar apunta al mismo sitio. El pie no añade otro “inicio”.
 */
export const DESK_HOME_ITEM: DeskNavItem = {
  to: INSTITUTION_ROUTES.desk,
  label: 'Escritorio',
  outcome: 'Tu espacio según el rol',
  icon: LayoutDashboard,
};

export function getDeskSidebarItems(persona: DeskPersonaId): readonly DeskNavItem[] {
  return [DESK_HOME_ITEM, ...getDeskNavSections(persona).flatMap((s) => s.items)];
}
