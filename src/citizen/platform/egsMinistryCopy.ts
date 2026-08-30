import type { MinistryHealthResponse } from '../../api.js';
import { useSovereignConfig } from '../../context/PlatformContext.js';

function parseAmount(value: string): number {
  const n = parseFloat(value);
  return Number.isNaN(n) ? 0 : n;
}

/** Frase resultado — pantalla ministerio (EGS-ESTADO-TERRITORIAL §7.3). */
export function ministryEgsResultLine(data: MinistryHealthResponse): string {
  const delta = parseAmount(data.calculoAhorroFinal);
  const reinversion = parseAmount(data.split.reinversion);

  if (!data.reconcileOk) {
    return 'Cierre bloqueado — Centinela detectó discrepancia en custodia.';
  }

  if (delta <= 0) {
    return `Q${data.quarter} ${data.fiscalYear}: ejecución conforme al plan — sin ahorro adicional este trimestre.`;
  }

  if (data.published) {
    return `Ahorro verificado ${formatCompact(delta, data.currency)} · Reinversión 70%: ${formatCompact(reinversion, data.currency)}.`;
  }

  return `Ahorro calculado ${formatCompact(delta, data.currency)} — pendiente publicar cierre trimestral.`;
}

/** Línea de estado sutil bajo el resultado. */
export function ministryEgsStatusHint(data: MinistryHealthResponse): string {
  if (!data.reconcileOk) {
    return 'Pagos congelados hasta resolución humana.';
  }
  if (data.published) {
    return `Publicado · Conforme centinela · ${data.releaseCount} hitos verificados`;
  }
  if (data.quarterCloseStatus === 'PENDING_VALIDATION') {
    return 'Pendiente validación — listo para publicar';
  }
  return `${data.executionPct}% ejecución vs línea base · ${data.releaseCount} hitos`;
}

function formatCompact(amount: number, currency: string): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(2)}M ${currency}`;
  }
  return `${amount.toLocaleString('es-VE', { maximumFractionDigits: 2 })} ${currency}`;
}

export function ministryEgsConforme(data: MinistryHealthResponse): boolean {
  return data.reconcileOk && data.quarterCloseStatus !== 'FROZEN';
}
