import type { ReactNode } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { Link } from 'react-router-dom';

type ActionReceiptProps = {
  title: string;
  children?: ReactNode;
  monoId?: string;
  action?: { label: string; to: string };
  onDismiss?: () => void;
  tone?: 'success' | 'warning' | 'info';
  className?: string;
};

const toneClass = {
  success: 'agigov-action-receipt--success',
  warning: 'agigov-action-receipt--warning',
  info: 'agigov-action-receipt--info',
} as const;

/** Recibo animado tras acciones POST — persiste hasta cerrar. */
export function ActionReceipt({
  title,
  children,
  monoId,
  action,
  onDismiss,
  tone = 'success',
  className = '',
}: ActionReceiptProps) {
  return (
    <div
      className={`agigov-action-receipt agigov-enter-up ${toneClass[tone]} ${className}`}
      role="status"
      aria-live="polite"
    >
      <CheckCircle2 className="agigov-action-receipt-icon" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="agigov-action-receipt-title">{title}</p>
        {monoId ? <p className="agigov-mono-id mt-1">{monoId}</p> : null}
        {children ? <div className="agigov-action-receipt-body">{children}</div> : null}
        {action ? (
          <Link to={action.to} className="ds-btn-secondary ds-btn-app-shape mt-3 inline-flex">
            {action.label}
          </Link>
        ) : null}
      </div>
      {onDismiss ? (
        <button
          type="button"
          className="agigov-action-receipt-dismiss"
          onClick={onDismiss}
          aria-label="Cerrar aviso"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
