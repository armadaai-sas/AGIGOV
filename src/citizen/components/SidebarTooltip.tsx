import type { ReactElement, ReactNode } from 'react';
import { cloneElement, isValidElement, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  label: string;
  hint?: string;
  enabled?: boolean;
  children: ReactNode;
};

type Anchor = { top: number; left: number };

/**
 * Tooltip del rail colapsado. Se renderiza en un portal
 * con `position: fixed` para que no lo recorte el scroll del `<nav>` (overflow),
 * que era la causa de que no apareciera junto a los iconos.
 */
export function SidebarTooltip({ label, hint, enabled = true, children }: Props) {
  const [anchor, setAnchor] = useState<Anchor | null>(null);

  const show = useCallback((el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    setAnchor({ top: r.top + r.height / 2, left: r.right + 8 });
  }, []);

  const hide = useCallback(() => setAnchor(null), []);

  if (!enabled) return <>{children}</>;

  const el = children as ReactElement<{ className?: string }>;
  const wrapChild = isValidElement(children)
    ? cloneElement(el, {
        className: [el.props.className, 'app-sidebar-tooltip-anchor'].filter(Boolean).join(' '),
      })
    : children;

  return (
    <span
      className="app-sidebar-tooltip-wrap app-sidebar-tooltip-wrap--rail"
      onMouseEnter={(e) => show(e.currentTarget)}
      onMouseLeave={hide}
      onFocus={(e) => show(e.currentTarget)}
      onBlur={hide}
    >
      {wrapChild}
      {anchor && typeof document !== 'undefined'
        ? createPortal(
            <span
              className="app-sidebar-tooltip app-sidebar-tooltip--portal"
              role="tooltip"
              style={{ top: anchor.top, left: anchor.left }}
            >
              <span className="app-sidebar-tooltip-label">{label}</span>
              {hint ? <span className="app-sidebar-tooltip-hint">{hint}</span> : null}
            </span>,
            document.body,
          )
        : null}
    </span>
  );
}
