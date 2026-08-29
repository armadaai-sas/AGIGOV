import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { LogOut, Menu, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';

export type DeskGlyphKind = 'menu' | 'expand' | 'collapse' | 'exit' | 'close';

/** Iconos del desk — menú móvil, panel lateral y salir. */
export function DeskGlyph({
  kind,
  className = '',
}: {
  kind: DeskGlyphKind;
  className?: string;
}) {
  const iconClass = `desk-glyph desk-glyph--${kind} ${className}`.trim();

  switch (kind) {
    case 'menu':
      return <Menu className={iconClass} aria-hidden strokeWidth={1.75} />;
    case 'close':
      return <X className={iconClass} aria-hidden strokeWidth={1.75} />;
    case 'expand':
      return <PanelLeftOpen className={iconClass} aria-hidden strokeWidth={1.75} />;
    case 'collapse':
      return <PanelLeftClose className={iconClass} aria-hidden strokeWidth={1.75} />;
    case 'exit':
      return <LogOut className={iconClass} aria-hidden strokeWidth={1.75} />;
  }
}

export function DeskIconButton({
  kind,
  label,
  className = '',
  children,
  ...props
}: {
  kind: DeskGlyphKind;
  label: string;
  className?: string;
  children?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`desk-icon-btn ${className}`.trim()}
      aria-label={label}
      {...props}
    >
      <DeskGlyph kind={kind} />
      {children}
    </button>
  );
}
