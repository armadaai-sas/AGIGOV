import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type DeskGlyphKind = 'expand' | 'collapse' | 'exit';

const GLYPH: Record<DeskGlyphKind, string> = {
  expand: '+',
  collapse: '−',
  exit: '×',
};

/** Glifos tipográficos del desk — expandir, contraer, salir. */
export function DeskGlyph({
  kind,
  className = '',
}: {
  kind: DeskGlyphKind;
  className?: string;
}) {
  return (
    <span className={`desk-glyph desk-glyph--${kind} ${className}`.trim()} aria-hidden>
      {GLYPH[kind]}
    </span>
  );
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
