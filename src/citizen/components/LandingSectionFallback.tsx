/** Placeholder mientras cargan secciones bajo el fold (A10). */
export function LandingSectionFallback({ label = 'Cargando sección…' }: { label?: string }) {
  return (
    <div
      className="landing-section landing-section--fallback"
      aria-live="polite"
      aria-busy="true"
    >
      <p className="sr-only">{label}</p>
      <div className="landing-section-head mx-auto max-w-2xl text-center">
        <div className="agigov-skeleton mx-auto h-3 w-24" />
        <div className="agigov-skeleton mx-auto mt-4 h-10 w-3/4 max-w-md" />
        <div className="agigov-skeleton mx-auto mt-3 h-4 w-full max-w-lg" />
      </div>
      <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
        <div className="agigov-skeleton h-40 rounded-2xl" />
        <div className="agigov-skeleton h-40 rounded-2xl" />
      </div>
    </div>
  );
}
