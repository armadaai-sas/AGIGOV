import type { DeskPersonaId } from './deskNav.js';
import { AGIGOV_MODELS, MODEL_AUDIENCE_LABEL, type ModelAudience } from './agigovModels.js';

export type PaletteItem = {
  id: string;
  label: string;
  to: string;
  group: string;
  keywords?: string;
};

const MODEL_ITEMS: PaletteItem[] = AGIGOV_MODELS.map((m) => ({
  id: `model-${m.id}`,
  label: m.name,
  to: m.productPath,
  group: `Modelo · ${MODEL_AUDIENCE_LABEL[m.audience]}`,
  keywords: m.keywords,
}));

/** Entradas del command palette ⌘K — rutas secundarias (no sidebar). */
export const PALETTE_ITEMS: readonly PaletteItem[] = [
  { id: 'home', label: 'Inicio landing', to: '/', group: 'Salir del desk', keywords: 'home landing inicio' },
  { id: 'escritorio', label: 'Escritorio', to: '/escritorio', group: 'Desk', keywords: 'home os workspace' },
  { id: 'empresas', label: 'Recorrido empresas', to: '/empresas', group: 'Empresa', keywords: 'b2b a-z data' },
  { id: 'institucional', label: 'Institucional', to: '/institucional', group: 'Estado', keywords: 'protocolo contacto piloto' },
  { id: 'desplegar', label: 'Registro institucional', to: '/institucional/registro', group: 'Estado', keywords: 'registro sandbox tenant' },
  { id: 'acceso', label: 'Acceso institucional', to: '/institucional/acceso', group: 'Estado', keywords: 'login sesión' },
  { id: 'piloto', label: 'Piloto fiscal EGS', to: '/institucional/piloto', group: 'Estado', keywords: 'wizard egs' },
  { id: 'desarrolladores', label: 'API · Desarrolladores', to: '/desarrolladores', group: 'Integrador', keywords: 'openapi health' },
  { id: 'modelos', label: 'Catálogo modelos', to: '/modelos', group: 'Integrador', keywords: 'catalogo servicios' },
  { id: 'descargar', label: 'App de escritorio', to: '/descargar', group: 'Recursos', keywords: 'desktop electron' },
  { id: 'egs-consola', label: 'Consola EGS', to: '/modelos/egs/consola', group: 'Estado', keywords: 'quarter ahorro consola' },
  { id: 'contratos', label: 'Custodia · Contratos', to: '/contratos', group: 'Operación', keywords: 'hitos centinela' },
  { id: 'transparencia', label: 'Transparencia', to: '/transparencia', group: 'Ciudadano', keywords: 'aei telemetría' },
  { id: 'gestion', label: 'Gestión pública', to: '/gestion', group: 'Ciudadano', keywords: 'ledger registro' },
  { id: 'propuestas', label: 'Propuestas', to: '/propuestas', group: 'Ciudadano', keywords: 'dictamen' },
  { id: 'participar', label: 'Participar', to: '/participar', group: 'Ciudadano', keywords: 'enviar propuesta' },
  { id: 'cne', label: 'Consulta electoral', to: '/cne', group: 'Más', keywords: 'voto set demo' },
  { id: 'proyectos', label: 'Proyectos DAO', to: '/proyectos?tab=dao', group: 'Más', keywords: 'escrow dao' },
  { id: 'suministros', label: 'Suministros', to: '/suministros', group: 'Más', keywords: 'logístico' },
  { id: 'ayuda', label: 'Centro de ayuda', to: '/ayuda', group: 'Recursos', keywords: 'tutorial guía' },
  { id: 'glosario', label: 'Glosario', to: '/aprender/glosario', group: 'Recursos', keywords: 'ledger dictamen iap' },
  { id: 'data-trust', label: 'DATA Trust', to: '/modelos/data-trust', group: 'Empresa', keywords: 'agregados sector' },
  { id: 'evidencia', label: 'Evidencia API', to: '/modelos/evidencia-certificada', group: 'Empresa', keywords: 'certificar hito api' },
  { id: 'iaau', label: 'IaaU', to: '/modelos/iaau', group: 'Empresa', keywords: 'infra uso firma' },
  ...MODEL_ITEMS,
] as const;

export function filterPaletteItems(query: string): PaletteItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...PALETTE_ITEMS];
  return PALETTE_ITEMS.filter(
    (item) =>
      item.label.toLowerCase().includes(q) ||
      item.group.toLowerCase().includes(q) ||
      item.keywords?.toLowerCase().includes(q),
  );
}

const PERSONA_GROUPS: Record<DeskPersonaId, readonly string[]> = {
  citizen: ['Ciudadano', 'Recursos', 'Desk', 'Salir del desk'],
  enterprise: ['Empresa', 'Operación', 'Recursos', 'Desk', 'Salir del desk'],
  state: ['Estado', 'Operación', 'Recursos', 'Desk', 'Salir del desk'],
  integrator: ['Integrador', 'Recursos', 'Desk', 'Salir del desk', 'Operación'],
};

const PERSONA_MODEL_AUDIENCE: Record<DeskPersonaId, readonly ModelAudience[]> = {
  citizen: ['ciudadano'],
  enterprise: ['empresarial', 'gubernamental'],
  state: ['gubernamental', 'ciudadano'],
  integrator: ['empresarial', 'gubernamental', 'ciudadano'],
};

function paletteItemAllowed(item: PaletteItem, persona: DeskPersonaId): boolean {
  const allowed = PERSONA_GROUPS[persona];
  if (allowed.includes(item.group)) return true;
  if (item.group.startsWith('Modelo ·')) {
    return PERSONA_MODEL_AUDIENCE[persona].some((a) =>
      item.group.includes(MODEL_AUDIENCE_LABEL[a]),
    );
  }
  return false;
}

/** ⌘K filtrado por persona — sin ruido de otros roles. */
export function filterPaletteItemsForPersona(query: string, persona: DeskPersonaId): PaletteItem[] {
  return filterPaletteItems(query).filter((item) => paletteItemAllowed(item, persona));
}
