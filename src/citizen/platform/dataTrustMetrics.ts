/** Métricas DATA Trust — lenguaje humano para consola customer-centric. */
export const DATA_TRUST_METRIC_LABELS: Record<string, string> = {
  avg_payment_days: 'Días promedio de pago',
  projects_on_track_pct: 'Proyectos en curso',
};

export function humanizeDataTrustMetric(key: string): string {
  return DATA_TRUST_METRIC_LABELS[key] ?? key.replace(/_/g, ' ');
}
