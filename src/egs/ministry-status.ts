import type { CoreDb } from '../db/client.js';
import type { PublicMinistryHealth } from '../pilot/egs-public.js';

export type EgsConsoleState =
  | 'SIN_TENANT'
  | 'BASELINE_PEND'
  | 'INGEST_READY'
  | 'EN_EJECUCION'
  | 'DISCREPANCIA'
  | 'LISTO_CIERRE'
  | 'PUBLICADO';

export type EgsPrimaryAction = {
  id: string;
  label: string;
  enabled: boolean;
  href?: string;
  requiresAuth?: boolean;
};

export type EgsSecondaryAction = {
  id: string;
  label: string;
  href: string;
};

export type EgsMinistryStatus = {
  updatedAt: string;
  ministryCode: string;
  estadoConsola: EgsConsoleState;
  semaphore: 'green' | 'amber' | 'red';
  blockReason: string | null;
  tenantSlug: string | null;
  primaryAction: EgsPrimaryAction;
  secondaryActions: EgsSecondaryAction[];
  result: {
    delta: string;
    reinversion70: string;
    meritPool: string;
    agigovFee: string;
    currency: string;
    quarter: number;
    fiscalYear: number;
  };
};

type TenantRow = {
  slug: string;
  onboardingStatus: string;
} | null;

function readyForPublish(health: PublicMinistryHealth): boolean {
  return (
    health.reconcileOk &&
    !health.published &&
    ['PENDING_VALIDATION', 'DELTA_CALCULATED'].includes(health.quarterCloseStatus)
  );
}

export function deriveEgsMinistryStatus(
  health: PublicMinistryHealth | null,
  tenant: TenantRow,
): EgsMinistryStatus {
  const ministryCode = health?.ministryCode ?? tenant?.slug ?? 'MPPI';
  const updatedAt = health?.updatedAt ?? new Date().toISOString();

  if (!health) {
    return {
      updatedAt,
      ministryCode,
      estadoConsola: 'SIN_TENANT',
      semaphore: 'amber',
      blockReason: 'Aún no hay datos fiscales',
      tenantSlug: tenant?.slug ?? null,
      primaryAction: {
        id: 'start_pilot',
        label: 'Iniciar piloto de ahorro',
        enabled: true,
        href: '/institucional/piloto',
      },
      secondaryActions: [{ id: 'register', label: 'Registro institucional', href: '/institucional/registro' }],
      result: {
        delta: '0',
        reinversion70: '0',
        meritPool: '0',
        agigovFee: '0',
        currency: 'USD',
        quarter: 0,
        fiscalYear: 0,
      },
    };
  }

  const result = {
    delta: health.calculoAhorroFinal,
    reinversion70: health.split.reinversion,
    meritPool: health.split.meritPool,
    agigovFee: health.split.agigovFee,
    currency: health.currency,
    quarter: health.quarter,
    fiscalYear: health.fiscalYear,
  };

  const secondaryActions: EgsSecondaryAction[] = [
    { id: 'export_pdf', label: 'Exportar informe PDF', href: '#export-pdf' },
  ];

  if (!health.reconcileOk) {
    return {
      updatedAt,
      ministryCode: health.ministryCode,
      estadoConsola: 'DISCREPANCIA',
      semaphore: 'red',
      blockReason: health.discrepancies[0] ?? 'Discrepancia en custodia — cierre bloqueado',
      tenantSlug: tenant?.slug ?? null,
      primaryAction: {
        id: 'review_contracts',
        label: 'Revisar contratos afectados',
        enabled: true,
        href: '/contratos',
      },
      secondaryActions,
      result,
    };
  }

  if (health.published) {
    return {
      updatedAt,
      ministryCode: health.ministryCode,
      estadoConsola: 'PUBLICADO',
      semaphore: 'green',
      blockReason: null,
      tenantSlug: tenant?.slug ?? null,
      primaryAction: {
        id: 'view_citizen_telemetry',
        label: 'Ver resultados públicos',
        enabled: true,
        href: '/gestion',
      },
      secondaryActions: [
        ...secondaryActions,
        { id: 'share', label: 'Compartir enlace público', href: '/gestion' },
      ],
      result,
    };
  }

  if (tenant?.onboardingStatus === 'baseline_pending') {
    return {
      updatedAt,
      ministryCode: health.ministryCode,
      estadoConsola: 'BASELINE_PEND',
      semaphore: 'amber',
      blockReason: 'Línea base pendiente de firma',
      tenantSlug: tenant.slug,
      primaryAction: {
        id: 'ratify_baseline',
        label: 'Firmar la línea base',
        enabled: true,
        href: '/institucional/piloto',
      },
      secondaryActions,
      result,
    };
  }

  if (health.releaseCount === 0) {
    return {
      updatedAt,
      ministryCode: health.ministryCode,
      estadoConsola: 'INGEST_READY',
      semaphore: 'amber',
      blockReason: 'Faltan hitos verificados para el cierre trimestral',
      tenantSlug: tenant?.slug ?? null,
      primaryAction: {
        id: 'ingest_milestones',
        label: 'Cargar los hitos',
        enabled: true,
        href: '/institucional/piloto',
      },
      secondaryActions,
      result,
    };
  }

  if (readyForPublish(health)) {
    return {
      updatedAt,
      ministryCode: health.ministryCode,
      estadoConsola: 'LISTO_CIERRE',
      semaphore: 'green',
      blockReason: null,
      tenantSlug: tenant?.slug ?? null,
      primaryAction: {
        id: 'publish_q_close',
        label: 'Publicar cierre trimestral',
        enabled: true,
        requiresAuth: true,
      },
      secondaryActions,
      result,
    };
  }

  return {
    updatedAt,
    ministryCode: health.ministryCode,
    estadoConsola: 'EN_EJECUCION',
    semaphore: 'amber',
    blockReason: null,
    tenantSlug: tenant?.slug ?? null,
    primaryAction: {
      id: 'view_contracts',
      label: 'Ver avance por contrato',
      enabled: true,
      href: '/modelos/egs/consola#egs-contratos',
    },
    secondaryActions,
    result,
  };
}

export async function getEgsMinistryStatus(
  db: CoreDb,
  ministryCode: string,
): Promise<EgsMinistryStatus | null> {
  const { getMinistryHealth } = await import('../pilot/egs-public.js');
  const health = await getMinistryHealth(ministryCode);

  const tenant = await db.pilotTenant.findFirst({
    where: { ministryCode, status: 'active' },
    select: { slug: true, onboardingStatus: true },
  });

  if (!health && !tenant) return null;

  return deriveEgsMinistryStatus(health, tenant);
}
