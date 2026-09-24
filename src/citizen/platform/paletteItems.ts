import type { DeskPersonaId } from './deskNav.js';

export type PaletteItem = {
  id: string;
  label: string;
  to: string;
  group: string;
  keywords?: string;
};

/** ⌘K solo con lo que no está en el menú del rol. */
export const PALETTE_ITEMS: readonly PaletteItem[] = [
  { id: 'ayuda', label: 'Centro de ayuda', to: '/ayuda', group: 'Más', keywords: 'tutorial guía mapa' },
  { id: 'glosario', label: 'Glosario', to: '/aprender/glosario', group: 'Más', keywords: 'términos' },
  { id: 'descargar', label: 'App de escritorio', to: '/descargar', group: 'Más', keywords: 'desktop' },
  { id: 'cne', label: 'Consulta', to: '/cne', group: 'Más', keywords: 'voto' },
  { id: 'suministros', label: 'Suministros', to: '/suministros', group: 'Más', keywords: 'inventario' },
  { id: 'proyectos', label: 'Proyectos', to: '/proyectos?tab=dao', group: 'Más', keywords: 'dao' },
  { id: 'mapa', label: 'Mapa del sistema', to: '/escritorio/mapa', group: 'Más', keywords: 'ayuda diagrama' },
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

export function filterPaletteItemsForPersona(query: string, _persona: DeskPersonaId): PaletteItem[] {
  return filterPaletteItems(query);
}
