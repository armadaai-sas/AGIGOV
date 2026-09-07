import type { DeskPersonaId } from './deskNav.js';

export type DeskPageMeta = {
  /** Resultado — por qué el usuario está aquí. */
  result: string;
  /** Cómo entra la data — una línea. */
  dataHint?: string;
};

/** Metadatos ergonómicos por ruta del desk — enfoque resultado, no catálogo. */
const DESK_PAGE_META: Record<string, DeskPageMeta> = {
  '/participar': {
    result: 'Tu propuesta queda registrada con hechos verificables.',
    dataHint: 'Título, sector y dos hechos — sin datos personales.',
  },
  '/propuestas': {
    result: 'Estado claro de cada propuesta ciudadana.',
    dataHint: 'Solo lectura — no necesitas enviar datos.',
  },
  '/gestion': {
    result: 'Actos de gobierno publicados y verificables.',
    dataHint: 'Solo consulta — no necesitas enviar datos.',
  },
  '/suministros': {
    result: 'Suministros públicos, agregados y sin datos personales.',
    dataHint: 'Solo consulta — totales por estado.',
  },
  '/contratos': {
    result: 'Custodia por hitos — liberación con evidencia.',
    dataHint: 'Contratos y cadena de custodia.',
  },
  '/desarrolladores': {
    result: 'Health, OpenAPI e integración verificable.',
    dataHint: 'Conecta tu stack con envelopes IAP.',
  },
  '/empresas': {
    result: 'Catálogo B2B → DATA Trust → contacto.',
    dataHint: 'Recorrido guiado por utilidad.',
  },
};

export function getDeskPageMeta(pathname: string, _persona?: DeskPersonaId): DeskPageMeta | null {
  if (DESK_PAGE_META[pathname]) return DESK_PAGE_META[pathname]!;

  if (pathname.startsWith('/modelos/evidencia-certificada')) {
    return {
      result: 'Certifica hitos de contrato con evidencia demostrable.',
      dataHint: 'Introduce evidencia por hito — API o carga.',
    };
  }
  if (pathname.startsWith('/modelos/data-trust')) {
    return {
      result: 'Agregados sectoriales verificables sin exponer datos crudos.',
      dataHint: 'Consulta sectores publicados.',
    };
  }
  if (pathname.startsWith('/institucional/registro')) {
    return {
      result: 'Cuenta institucional vinculada a correo oficial.',
      dataHint: 'Registro en tres pasos — entorno seguro.',
    };
  }
  if (pathname.startsWith('/institucional/acceso')) {
    return {
      result: 'Sesión cifrada al escritorio institucional.',
      dataHint: 'Correo y contraseña institucional.',
    };
  }

  return null;
}

/** Título legible — quita snake_case técnico de seeds. */
export function humanizeDeskTitle(raw: string): string {
  const cleaned = raw
    .replace(/^dictamen[_-]?/i, '')
    .replace(/[_-]+/g, ' ')
    .trim();
  if (!cleaned) return raw;
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}
