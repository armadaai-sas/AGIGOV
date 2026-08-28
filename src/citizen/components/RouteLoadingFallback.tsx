import { Loader2 } from 'lucide-react';

type Props = {
  /** Skeleton dentro del shell OS (sidebar visible). */
  shell?: boolean;
};

/** Fallback de Suspense — ligero, zinc, sin splash de landing. */
export function RouteLoadingFallback({ shell = true }: Props) {
  if (!shell) {
    return (
      <div className="route-loading route-loading--bare" role="status" aria-live="polite" aria-busy="true">
        <Loader2 className="route-loading-spinner" aria-hidden />
        <span className="sr-only">Cargando…</span>
      </div>
    );
  }

  return (
    <div className="os-workspace route-loading route-loading--shell" role="status" aria-live="polite" aria-busy="true">
      <div className="route-loading-head">
        <div className="route-loading-bar route-loading-bar--title" />
        <div className="route-loading-bar route-loading-bar--sub" />
      </div>
      <ul className="route-loading-list" aria-hidden>
        <li className="route-loading-row" />
        <li className="route-loading-row" />
        <li className="route-loading-row" />
      </ul>
      <span className="sr-only">Cargando página…</span>
    </div>
  );
}
