const STATUS: Record<string, { label: string; className: string }> = {
  received: { label: 'Recibida', className: 'border border-zinc-200 bg-zinc-50 text-zinc-700' },
  validated: { label: 'Validada', className: 'border border-zinc-200 bg-zinc-100 text-zinc-800' },
  decided: { label: 'Decidida', className: 'border border-zinc-200 bg-zinc-100 text-zinc-800' },
  committed: { label: 'Comprometida', className: 'border border-zinc-200 bg-zinc-100 text-zinc-800' },
  COMPROMETIDA: { label: 'Comprometida', className: 'border border-zinc-200 bg-zinc-100 text-zinc-800' },
  comprometida: { label: 'Comprometida', className: 'border border-zinc-200 bg-zinc-100 text-zinc-800' },
  published: { label: 'Publicada', className: 'border border-zinc-200 bg-zinc-100 text-zinc-800' },
  frozen: { label: 'Congelada', className: 'border border-zinc-300 bg-zinc-100 text-zinc-800' },
  PENDING: { label: 'Pendiente', className: 'border border-zinc-200 bg-zinc-50 text-zinc-600' },
  LOCKED: { label: 'En custodia', className: 'border border-zinc-300 bg-zinc-100 text-zinc-800' },
  RELEASED: { label: 'Completado', className: 'border border-zinc-200 bg-zinc-100 text-zinc-800' },
  FROZEN: { label: 'Congelado', className: 'border border-zinc-300 bg-zinc-100 text-zinc-800' },
  VALIDATED: { label: 'Validado', className: 'border border-zinc-200 bg-zinc-100 text-zinc-800' },
  DELTA_CALCULATED: { label: 'Ahorro calculado', className: 'border border-zinc-200 bg-zinc-100 text-zinc-800' },
  PENDING_VALIDATION: { label: 'Pendiente validación', className: 'border border-zinc-200 bg-zinc-50 text-zinc-700' },
  COLLECTING: { label: 'Recopilando', className: 'border border-zinc-200 bg-zinc-50 text-zinc-700' },
  PUBLISHED: { label: 'Publicado', className: 'border border-zinc-200 bg-zinc-100 text-zinc-800' },
};

export function StatusBadge({ status }: { status: string }) {
  const key = status.trim();
  const normalized = key.toLowerCase().replace(/\s+/g, '_');
  const meta =
    STATUS[key] ??
    STATUS[normalized] ??
    STATUS[normalized.toUpperCase()] ?? {
      label: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      className: 'border border-zinc-200 bg-zinc-50 text-zinc-600',
    };

  return (
    <span className={`agigov-badge ${meta.className}`}>{meta.label}</span>
  );
}
