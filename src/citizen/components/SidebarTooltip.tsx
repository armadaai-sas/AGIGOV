import type { ReactElement, ReactNode } from 'react';
import { cloneElement, isValidElement } from 'react';

type Props = {
  label: string;
  hint?: string;
  enabled?: boolean;
  children: ReactNode;
};

/** Tooltip en rail contraído — title nativo evita recorte de texto lateral. */
export function SidebarTooltip({ label, hint, enabled = true, children }: Props) {
  if (!enabled) return <>{children}</>;

  const title = hint ? `${label} — ${hint}` : label;

  const child = isValidElement(children)
    ? cloneElement(children as ReactElement<{ className?: string; title?: string }>, {
        className: [children.props.className, 'app-sidebar-tooltip-anchor'].filter(Boolean).join(' '),
        title,
      })
    : children;

  return <span className="app-sidebar-tooltip-wrap app-sidebar-tooltip-wrap--rail">{child}</span>;
}
