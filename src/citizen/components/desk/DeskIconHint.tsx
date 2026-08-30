import type { ReactNode } from 'react';

/** Tooltip sutil — icono + nube blanca al hover. */
export function DeskIconHint({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <span className="desk-icon-hint">
      {children}
      <span className="desk-icon-hint-cloud" role="tooltip">
        {label}
      </span>
    </span>
  );
}
