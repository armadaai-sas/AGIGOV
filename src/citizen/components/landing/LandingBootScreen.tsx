import { AgigovLogo } from '../AgigovLogo.js';

/** Splash de marca mientras carga el landing (o la ruta). */
export function LandingBootScreen({ label = 'Cargando la página…' }: { label?: string }) {
  return (
    <div className="landing-boot-screen" role="status" aria-live="polite" aria-busy="true">
      <AgigovLogo size="lg" showWordmark variant="dark" />
      <p className="landing-boot-screen-label">{label}</p>
      <span className="landing-boot-screen-pulse" aria-hidden />
    </div>
  );
}
