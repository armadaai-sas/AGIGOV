const STATUS: Record<string, { label: string; className: string }> = {
  received: { label: 'Recibida', className: 'bg-slate-500/20 text-slate-300' },
  validated: { label: 'Validada', className: 'bg-sky-500/20 text-sky-200' },
  decided: { label: 'Decidida', className: 'bg-indigo-500/20 text-indigo-200' },
  committed: { label: 'Comprometida', className: 'bg-emerald-500/20 text-emerald-200' },
  published: { label: 'Publicada', className: 'bg-emerald-500/20 text-emerald-200' },
  frozen: { label: 'Congelada', className: 'bg-red-500/20 text-red-200' },
  PENDING: { label: 'Pendiente', className: 'bg-slate-500/20 text-slate-300' },
  LOCKED: { label: 'En escrow', className: 'bg-sky-500/20 text-sky-200' },
  RELEASED: { label: 'Completado', className: 'bg-emerald-500/20 text-emerald-200' },
  FROZEN: { label: 'Congelado', className: 'bg-red-500/20 text-red-200' },
  VALIDATED: { label: 'Validado', className: 'bg-amber-500/20 text-amber-200' },
  DELTA_CALCULATED: { label: 'Δ calculado', className: 'bg-emerald-500/20 text-emerald-200' },
  PENDING_VALIDATION: { label: 'Pendiente validación', className: 'bg-sky-500/20 text-sky-200' },
  COLLECTING: { label: 'Recopilando', className: 'bg-sky-500/20 text-sky-200' },
  PUBLISHED: { label: 'Publicado', className: 'bg-emerald-500/20 text-emerald-200' },
};

export function StatusBadge({ status }: { status: string }) {
  const meta = STATUS[status] ?? {
    label: status,
    className: 'bg-white/10 text-agigov-text-muted',
  };

  return (
    <span className={`agigov-badge ${meta.className}`}>{meta.label}</span>
  );
}
