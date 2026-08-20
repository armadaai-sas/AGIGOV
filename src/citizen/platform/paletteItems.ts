import { AGIGOV_MODELS, MODEL_AUDIENCE_LABEL } from './agigovModels.js';

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

/** Entradas del command palette ⌘K — alineadas con navConfig y catálogo de modelos. */
export const PALETTE_ITEMS: readonly PaletteItem[] = [
  { id: 'vision', label: 'La visión · Actos I–V', to: '/institucional#vision', group: 'Gobernanza 2.0', keywords: 'sueño esperanza actos narrativa' },
  { id: 'home', label: 'Inicio', to: '/', group: 'Gobernanza 2.0', keywords: 'home landing' },
  { id: 'modelos', label: 'Modelos', to: '/modelos', group: 'Modelos AGIGOV', keywords: 'servicios gubernamental empresarial ciudadano catalogo' },
  { id: 'modelo', label: 'Modelo', to: '/#modelo', group: 'Gobernanza 2.0', keywords: 'pilares gobernanza' },
  { id: 'protocolo', label: 'Protocolo', to: '/institucional#protocolo', group: 'Gobernanza 2.0', keywords: 'iap firmas agentes' },
  { id: 'whitepaper', label: 'White paper', to: '/institucional#whitepaper', group: 'Gobernanza 2.0', keywords: 'marco normativo' },
  { id: 'documentacion', label: 'Documentación', to: '/institucional#documentacion', group: 'Gobernanza 2.0', keywords: 'carta especificación docs' },
  { id: 'desplegar', label: 'Registro institucional', to: '/institucional/registro', group: 'Institucional', keywords: 'registro acceso login piloto gobierno institucional' },
  { id: 'acceso', label: 'Acceso institucional', to: '/institucional/acceso', group: 'Institucional', keywords: 'login sesión institución gobierno' },
  { id: 'piloto', label: 'Piloto fiscal EGS', to: '/institucional/piloto', group: 'Institucional', keywords: 'piloto wizard egs sandbox' },
  { id: 'desarrolladores', label: 'Desarrolladores', to: '/desarrolladores', group: 'Gobernanza 2.0', keywords: 'api openapi integradores' },
  { id: 'institucional', label: 'Institucional', to: '/institucional', group: 'Gobernanza 2.0', keywords: 'carta comparador protocolo' },
  { id: 'comparador', label: 'Comparador Política 2.0', to: '/institucional#comparador', group: 'Gobernanza 2.0', keywords: 'politica metricas' },
  { id: 'egs-consola', label: 'Consola EGS', to: '/modelos/egs/consola', group: 'Operación', keywords: 'quarter close delta ahorro consola presupuesto' },
  { id: 'contratos', label: 'Escrow · Contratos', to: '/contratos', group: 'Operación', keywords: 'hitos centinela escrow' },
  { id: 'transparencia', label: 'Transparencia', to: '/transparencia', group: 'Operación', keywords: 'aei contrato eficiencia dictamen' },
  { id: 'gestion', label: 'Gestión pública', to: '/gestion', group: 'Operación', keywords: 'dashboard telemetría ledger transparencia' },
  { id: 'propuestas', label: 'Propuestas', to: '/propuestas', group: 'Participación', keywords: 'dictamen gobernanza participación' },
  { id: 'participar', label: 'Participar', to: '/participar', group: 'Participación', keywords: 'propuesta ciudadano enviar' },
  { id: 'cne', label: 'Consulta ciudadana verificable', to: '/cne', group: 'Participación', keywords: 'voto consulta electoral' },
  { id: 'proyectos', label: 'Proyectos DAO', to: '/proyectos?tab=dao', group: 'Economía ciudadana', keywords: 'escrow aportes dao' },
  { id: 'suministros', label: 'Suministros', to: '/suministros', group: 'Operación', keywords: 'logístico inventario' },
  { id: 'ayuda', label: 'Centro de ayuda', to: '/ayuda', group: 'Recursos', keywords: 'tutorial guía ayuda' },
  { id: 'ayuda-gestion', label: 'Tutorial: Gestión pública', to: '/ayuda/gestion', group: 'Recursos', keywords: 'telemetría ledger' },
  { id: 'ayuda-propuestas', label: 'Tutorial: Propuestas', to: '/ayuda/propuestas', group: 'Recursos', keywords: 'dictamen' },
  { id: 'ayuda-proyectos', label: 'Tutorial: Proyectos', to: '/ayuda/proyectos', group: 'Recursos', keywords: 'dao escrow' },
  { id: 'ayuda-suministros', label: 'Tutorial: Suministros', to: '/ayuda/suministros', group: 'Recursos', keywords: 'logístico' },
  { id: 'ayuda-participar', label: 'Tutorial: Participar', to: '/ayuda/participar', group: 'Recursos', keywords: 'propuesta enviar' },
  { id: 'ayuda-institucional', label: 'Tutorial: Institucional', to: '/ayuda/institucional', group: 'Recursos', keywords: 'gobierno carta' },
  { id: 'ayuda-modelo', label: 'Tutorial: Gobernanza 2.0', to: '/ayuda/modelo', group: 'Recursos', keywords: 'modelo' },
  { id: 'glosario', label: 'Glosario', to: '/aprender/glosario', group: 'Recursos', keywords: 'ledger dictamen escrow' },
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
