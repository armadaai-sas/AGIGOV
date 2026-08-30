import type { ReactElement, ReactNode } from 'react';
import { cloneElement, isValidElement } from 'react';

type Props = {
  label: string;
  hint?: string;
  enabled?: boolean;
  children: ReactNode;
};

/** Tooltip en rail — nube blanca a la derecha del icono. */
export function SidebarTooltip({ label, hint, enabled = true, children }: Props) {
  if (!enabled) return <>{children}</>;

  const child = isValidElement(children)
    ? cloneElement(children as ReactElement<{ className?: string }>, {
        className: [children.props.className, 'app-sidebar-tooltip-anchor'].filter(Boolean).join(' '),
      })
    : children;

  return (
    <span className="app-sidebar-tooltip-wrap app-sidebar-tooltip-wrap--rail">
      {child}
      <span className="app-sidebar-tooltip" role="tooltip">
        <span className="app-sidebar-tooltip-label">{label}</span>
        {hint ? <span className="app-sidebar-tooltip-hint">{hint}</span> : null}
      </span>
    </span>
  );
}
