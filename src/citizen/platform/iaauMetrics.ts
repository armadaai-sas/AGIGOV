/** Métricas IaaU — lenguaje humano para consola customer-centric. */
export const IAAU_UNIT_LABELS: Record<string, string> = {
  'iap-envelope': 'Envelope IAP',
  'ledger-commit': 'Commit al registro',
  'api-call': 'Llamada API',
  'sync-node': 'Sync nodo territorial',
  'milestone-validated': 'Hito validado',
};

export function humanizeIaauUnit(unit: string): string {
  return IAAU_UNIT_LABELS[unit] ?? unit.replace(/-/g, ' ');
}

export function humanizeIaauPlan(plan: string): string {
  if (plan === 'free') return 'Gratuito';
  if (plan === 'pro') return 'Profesional';
  if (plan === 'enterprise') return 'Enterprise';
  return plan;
}

export function iaauOutcomeLine(totalUnits: number, period: string, reconciled: boolean): string {
  if (totalUnits === 0) {
    return `Periodo ${period} — sin consumo registrado aún.`;
  }
  return reconciled
    ? `${totalUnits} unidades en ${period} — conciliado con el registro.`
    : `${totalUnits} unidades en ${period} — revisión centinela pendiente.`;
}
