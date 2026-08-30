import type { ReactNode } from 'react';

/** Tooltip sutil — icono + nube blanca al hover. */
export function DeskIconHint({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <span className="desk-icon-hint">
      {children}
      <span className="desk-icon-hint-cloud" role="tooltip">
        <span className="desk-icon-hint-label">{label}</span>
        {hint ? <span className="desk-icon-hint-detail">{hint}</span> : null}
      </span>
    </span>
  );
}
