/** Tamaños de glifo Lucide — máximo 3 en todo AGIGOV. */
export type AgigovIconSize = 'sm' | 'md' | 'lg';

export const AGIGOV_ICON_STROKE = 1.75;

const ICON_CLASS: Record<AgigovIconSize, string> = {
  sm: 'agigov-icon agigov-icon--sm',
  md: 'agigov-icon agigov-icon--md',
  lg: 'agigov-icon agigov-icon--lg',
};

/** Props estándar para iconos Lucide — usar en lugar de h-* w-* sueltos. */
export function agigovIconProps(size: AgigovIconSize = 'md', extraClass = '') {
  const className = extraClass ? `${ICON_CLASS[size]} ${extraClass}`.trim() : ICON_CLASS[size];
  return {
    className,
    strokeWidth: AGIGOV_ICON_STROKE,
    'aria-hidden': true as const,
  };
}
