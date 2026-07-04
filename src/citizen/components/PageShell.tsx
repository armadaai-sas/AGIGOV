import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

import { AppBreadcrumbs, type BreadcrumbItem } from './AppBreadcrumbs.js';
import { HelpTopicLink } from './HelpTopicLink.js';
import type { HelpTopicSlug } from '../content/helpTutorials.js';
import { NetworkBanner } from './NetworkBanner.js';
import type { NetworkSyncState } from '../api.js';

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

export function EmptyState({
  title,
  description,
  hint,
  action,
}: {
  title: string;
  description: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="agigov-empty-state" role="status">
      <p className="agigov-empty-state-kicker">Sin datos publicados aún</p>
      <p className="font-display text-lg font-semibold text-agigov-text">{title}</p>
      <p className="agigov-lead mx-auto mt-2 max-w-md">{description}</p>
      {hint ? <p className="agigov-empty-state-hint">{hint}</p> : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

/** Spinner inline en botones y acciones (C4). */
export function DsSpinner({ className = 'h-4 w-4' }: { className?: string }) {
  return <Loader2 className={`animate-spin ${className}`} aria-hidden />;
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      className="rounded-2xl border border-red-900/50 bg-red-950/30 p-5 text-sm text-red-100 agigov-enter-up"
      role="alert"
    >
      <p className="font-medium">{message}</p>
      {onRetry ? (
        <button type="button" onClick={onRetry} className="ds-btn-secondary ds-btn-app-shape mt-4 text-red-100">
          Reintentar
        </button>
      ) : null}
    </div>
  );
}

export function LoadingState({ label = 'Cargando…' }: { label?: string }) {
  return (
    <div
      className="agigov-loading-state agigov-enter-up"
      aria-live="polite"
      aria-busy="true"
    >
      <DsSpinner className="h-5 w-5 text-sky-400/80" />
      <p className="sr-only">{label}</p>
      <div className="agigov-skeleton h-24" />
      <div className="agigov-skeleton h-32" />
      <div className="agigov-skeleton h-32" />
    </div>
  );
}
