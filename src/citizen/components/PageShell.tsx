import type { ReactNode } from 'react';
import { Inbox, Loader2 } from 'lucide-react';

import { AppBreadcrumbs, type BreadcrumbItem } from './AppBreadcrumbs.js';
import { HelpTopicLink } from './HelpTopicLink.js';
import type { HelpTopicSlug } from '../content/helpTutorials.js';
import { NetworkBanner } from './NetworkBanner.js';
import { PlatformAlert } from './PlatformAlert.js';
import type { NetworkSyncState } from '../api.js';

const DEV_MODE = import.meta.env.DEV;

export function PageShell({
  children,
  narrow = true,
  banner,
  breadcrumbs,
}: {
  children: ReactNode;
  narrow?: boolean;
  banner?: { state: NetworkSyncState; lastUpdated: string | null };
  breadcrumbs?: BreadcrumbItem[];
}) {
  return (
    <>
      {banner ? <NetworkBanner state={banner.state} lastUpdated={banner.lastUpdated} /> : null}
      <div className={narrow ? 'agigov-shell-narrow' : 'agigov-shell'}>
        {breadcrumbs?.length ? <AppBreadcrumbs items={breadcrumbs} /> : null}
        <div className="agigov-page-content">{children}</div>
      </div>
    </>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  lead,
  action,
  helpTopic,
}: {
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  action?: ReactNode;
  helpTopic?: HelpTopicSlug;
}) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between agigov-enter-up">
      <div className="max-w-2xl">
        {eyebrow ? <p className="agigov-eyebrow">{eyebrow}</p> : null}
        <h1 className={`agigov-page-title ${eyebrow ? 'mt-2' : ''}`}>{title}</h1>
        {lead ? <p className="agigov-lead mt-3">{lead}</p> : null}
        {helpTopic ? (
          <p className="mt-3">
            <HelpTopicLink topic={helpTopic} />
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

type PageStateFrameProps = {
  children: ReactNode;
  variant?: 'neutral' | 'error';
  compact?: boolean;
  align?: 'center' | 'start';
  role?: 'status' | 'alert';
  className?: string;
  'aria-busy'?: boolean;
  'aria-live'?: 'polite' | 'assertive' | 'off';
};

function PageStateFrame({
  children,
  variant = 'neutral',
  compact = false,
  align = 'center',
  role = 'status',
  className = '',
  ...aria
}: PageStateFrameProps) {
  return (
    <div
      className={`agigov-page-state agigov-enter-up ${
        variant === 'error' ? 'agigov-page-state--error' : ''
      } ${compact ? 'agigov-page-state--compact' : ''} ${
        align === 'start' ? 'agigov-page-state--start text-left' : 'text-center'
      } ${className}`.trim()}
      role={role}
      {...aria}
    >
      {children}
    </div>
  );
}

export function humanizeErrorMessage(raw: string): { title: string; detail?: string } {
  const lower = raw.toLowerCase();
  if (lower === 'error de red' || lower.includes('failed to fetch') || lower.includes('network')) {
    return {
      title: 'Sin conexión con el nodo',
      detail: 'Comprueba tu red e inténtalo de nuevo.',
    };
  }
  if (lower.includes('404') || lower.includes('not found') || lower.includes('unavailable')) {
    return {
      title: 'Información no disponible',
      detail: 'El servicio aún no publicó datos en este entorno.',
    };
  }
  if (raw.startsWith('API ') || /\u2192\s*[45]\d{2}/.test(raw)) {
    return {
      title: 'El servicio no respondió',
      detail: DEV_MODE ? raw : 'Inténtalo más tarde o contacta al administrador del despliegue.',
    };
  }
  return { title: 'No pudimos cargar la información', detail: raw };
}

export function EmptyState({
  kicker = 'Sin datos publicados aún',
  title,
  description,
  hint,
  action,
}: {
  kicker?: string;
  title: string;
  description: string;
  hint?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <PageStateFrame role="status">
      <div className="agigov-page-state-icon" aria-hidden>
        <Inbox className="h-5 w-5" />
      </div>
      <p className="agigov-page-state-kicker">{kicker}</p>
      <p className="font-display text-lg font-semibold text-agigov-text">{title}</p>
      <p className="agigov-lead mx-auto mt-2 max-w-md">{description}</p>
      {hint ? <p className="agigov-page-state-hint">{hint}</p> : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </PageStateFrame>
  );
}

export function StateHint({ children }: { children: ReactNode }) {
  return (
    <PageStateFrame compact align="start" role="status">
      {children}
    </PageStateFrame>
  );
}

/** Spinner inline en botones y acciones (C4). */
export function DsSpinner({ className = 'h-4 w-4' }: { className?: string }) {
  return <Loader2 className={`animate-spin ${className}`} aria-hidden />;
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  const { title, detail } = humanizeErrorMessage(message);
  const isConnection =
    message.toLowerCase() === 'error de red' ||
    message.toLowerCase().includes('failed to fetch') ||
    message.toLowerCase().includes('network');

  return (
    <PlatformAlert
      variant="error"
      title={title}
      hint={
        DEV_MODE && isConnection ? (
          <>
            Desarrollo — terminal 1:{' '}
            <code className="agigov-mono-id">npm run api:public</code>
            {' · '}terminal 2: <code className="agigov-mono-id">npm run dev</code>
            {' · '}
            <code className="agigov-mono-id">npm run db:seed:egs-pilot</code>
          </>
        ) : undefined
      }
      action={
        onRetry ? (
          <button type="button" onClick={onRetry} className="ds-btn-secondary ds-btn-app-shape min-h-11">
            Reintentar
          </button>
        ) : undefined
      }
    >
      {detail ? <p>{detail}</p> : null}
    </PlatformAlert>
  );
}

export function LoadingState({ label = 'Cargando…' }: { label?: string }) {
  return (
    <div className="agigov-loading-state agigov-enter-up" aria-live="polite" aria-busy="true">
      <p className="agigov-page-state-kicker">{label}</p>
      <DsSpinner className="h-5 w-5 text-sky-400/80" />
      <div className="agigov-skeleton h-24" />
      <div className="agigov-skeleton h-32" />
      <div className="agigov-skeleton h-32" />
    </div>
  );
}
