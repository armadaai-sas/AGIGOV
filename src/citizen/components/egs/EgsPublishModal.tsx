import { Loader2, X } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import type { EgsMinistryStatusResponse, MinistryHealthResponse } from '../../api.js';
import { agigovIconProps } from '../icons/agigovIcon.js';
import { loginPathWithRedirect } from '../../institutional/authRedirect.js';
import { useSovereignConfig } from '../../context/PlatformContext.js';

type Props = {
  open: boolean;
  onClose: () => void;
  data: MinistryHealthResponse;
  status: EgsMinistryStatusResponse;
  isAuthenticated: boolean;
  busy: boolean;
  error: string | null;
  onConfirm: () => void;
};

/** Modal confirmación — publicar cierre trimestral EGS (P0). */
export function EgsPublishModal({
  open,
  onClose,
  data,
  status,
  isAuthenticated,
  busy,
  error,
  onConfirm,
}: Props) {
  const { formatMoney } = useSovereignConfig();
  const unit = data.currency;
  const fmt = (v: string) => `${formatMoney(v)} ${unit}`;
  const savings = parseFloat(data.calculoAhorroFinal);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, busy, onClose]);

  if (!open) return null;

  return (
    <div className="os-modal-root" role="dialog" aria-modal="true" aria-labelledby="egs-publish-title">
      <button
        type="button"
        className="os-modal-backdrop"
        aria-label="Cerrar"
        onClick={onClose}
        disabled={busy}
      />
      <div className="os-modal-panel os-modal-panel--narrow">
        <header className="os-modal-head">
          <h2 id="egs-publish-title" className="os-modal-title">
            Confirmar publicación trimestral
          </h2>
          <button
            type="button"
            className="os-modal-close"
            onClick={onClose}
            aria-label="Cerrar"
            disabled={busy}
          >
            <X {...agigovIconProps('md')} />
          </button>
        </header>

        <div className="os-modal-body space-y-4">
          <p className="text-sm text-agigov-text-muted">
            Q{data.quarter} {data.fiscalYear} · {data.ministryCode} — se publicará el cierre y quedará
            visible y verificable para la ciudadanía.
          </p>

          <dl className="desk-page-metrics desk-console-metrics">
            <div className="desk-page-metric">
              <dt>Ahorro verificado (Δ)</dt>
              <dd>{fmt(status.result.delta)}</dd>
            </div>
            <div className="desk-page-metric">
              <dt>70% reinversión</dt>
              <dd>{fmt(status.result.reinversion70)}</dd>
            </div>
            <div className="desk-page-metric">
              <dt>20% mérito</dt>
              <dd>{fmt(status.result.meritPool)}</dd>
            </div>
            <div className="desk-page-metric">
              <dt>10% protocolo</dt>
              <dd>{fmt(status.result.agigovFee)}</dd>
            </div>
          </dl>

          {savings <= 0 ? (
            <p className="desk-console-outcome-note">
              Sin ahorro este trimestre — AGIGOV no cobra comisión de éxito.
            </p>
          ) : null}

          {!isAuthenticated ? (
            <div className="rounded-xl border border-agigov-border bg-agigov-surface/50 p-4">
              <p className="text-sm text-agigov-text">
                Requiere sesión institucional para firmar la publicación.
              </p>
              <Link
                to={loginPathWithRedirect('/modelos/egs/consola')}
                className="desk-page-primary-btn mt-3 inline-flex"
              >
                Iniciar sesión institucional
              </Link>
            </div>
          ) : null}

          {error ? <p className="text-sm text-red-700">{error}</p> : null}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              className="desk-page-primary-btn inline-flex items-center gap-1.5"
              disabled={busy || !isAuthenticated}
              onClick={onConfirm}
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Publicar al ledger ciudadano
            </button>
            <button
              type="button"
              className="app-btn app-btn--secondary"
              disabled={busy}
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
