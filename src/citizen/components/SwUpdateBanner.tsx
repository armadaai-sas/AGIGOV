import { RefreshCw, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

/** Aviso cuando hay build nuevo — evita quedar atrapado en precache PWA. */
export function SwUpdateBanner() {
  const [visible, setVisible] = useState(false);
  const reloadRef = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => {
    if (import.meta.env.VITE_DESKTOP === '1') return;

    let disposed = false;

    void import('virtual:pwa-register').then(({ registerSW }) => {
      if (disposed) return;

      const updateSW = registerSW({
        immediate: true,
        onNeedRefresh() {
          reloadRef.current = () => updateSW(true);
          setVisible(true);
        },
        onRegisteredSW(_url, registration) {
          if (!registration) return;

          const check = () => {
            if (document.visibilityState === 'visible') {
              void registration.update();
            }
          };

          document.addEventListener('visibilitychange', check);
          window.setInterval(check, 5 * 60 * 1000);
        },
      });

      reloadRef.current = () => updateSW(true);
    });

    return () => {
      disposed = true;
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="sw-update-banner" role="status" aria-live="polite">
      <p className="sw-update-banner-text">Hay una versión más reciente de AGIGOV.</p>
      <div className="sw-update-banner-actions">
        <button
          type="button"
          className="sw-update-banner-btn sw-update-banner-btn--primary"
          onClick={() => void reloadRef.current?.()}
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden />
          Recargar ahora
        </button>
        <button
          type="button"
          className="sw-update-banner-btn"
          onClick={() => setVisible(false)}
          aria-label="Ocultar aviso"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
