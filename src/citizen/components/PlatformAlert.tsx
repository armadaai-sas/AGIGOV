import type { ReactNode } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, WifiOff } from 'lucide-react';

export type PlatformAlertVariant = 'info' | 'warning' | 'error' | 'offline' | 'success';

const ICONS = {
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  offline: WifiOff,
  success: CheckCircle2,
} as const;

type Props = {
  variant: PlatformAlertVariant;
  title: string;
  children?: ReactNode;
  hint?: ReactNode;
  action?: ReactNode;
  /** Barra full-width (NetworkBanner). */
  banner?: boolean;
  className?: string;
  role?: 'status' | 'alert';
};

export function PlatformAlert({
  variant,
  title,
  children,
  hint,
  action,
  banner = false,
  className = '',
  role,
}: Props) {
  const Icon = ICONS[variant];
  const alertRole = role ?? (variant === 'error' ? 'alert' : 'status');

  if (banner) {
    return (
      <div
        className={`agigov-alert agigov-alert--${variant} agigov-alert--banner ${className}`.trim()}
        role={alertRole}
        aria-live="polite"
      >
        <p className="agigov-alert-title">
          {title}
          {children ? <span className="agigov-alert-banner-meta">{children}</span> : null}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`agigov-alert agigov-alert--${variant} agigov-enter-up ${className}`.trim()}
      role={alertRole}
    >
      <div className="flex gap-3">
        <Icon className="agigov-alert-icon h-5 w-5 shrink-0" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="agigov-alert-title">{title}</p>
          {children ? <div className="agigov-alert-body">{children}</div> : null}
          {hint ? <div className="agigov-alert-hint">{hint}</div> : null}
          {action ? <div className="agigov-alert-action">{action}</div> : null}
        </div>
      </div>
    </div>
  );
}

/** Ocultar NetworkBanner cuando la página ya muestra un error fatal. */
export function shouldShowNetworkBanner(
  hasFatalError: boolean,
  state?: string,
): boolean {
  if (hasFatalError) return false;
  return state !== undefined;
}
