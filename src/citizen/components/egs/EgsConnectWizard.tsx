import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Eye, Server, ArrowRight, Loader2 } from 'lucide-react';

import type { EgsConnectMode } from '../../api.js';
import { connectEgsConsole } from '../../api.js';
import { agigovIconProps } from '../icons/agigovIcon.js';
import { INSTITUTION_ROUTES } from '../../platform/institutionalRoutes.js';
import { useSovereignConfig } from '../../context/PlatformContext.js';

type Props = {
  onConnected: () => void;
};

const MODES: Array<{
  id: EgsConnectMode;
  title: string;
  detail: string;
  icon: typeof Eye;
}> = [
  {
    id: 'pilot_read',
    title: 'Lectura piloto MPPI',
    detail: 'Telemetría fiscal del seed vial — Postgres en vivo.',
    icon: Eye,
  },
  {
    id: 'institutional_ingest',
    title: 'Ingesta institucional',
    detail: 'Token Bearer → POST /api/ops/ingest/:slug',
    icon: Building2,
  },
  {
    id: 'ops_api',
    title: 'Ops provision + q-close',
    detail: 'Provision tenant, reconcile centinela, publish comunicador.',
    icon: Server,
  },
];

/** Wizard Conectar — EGS (rutas reales, no connected:true fake). */
export function EgsConnectWizard({ onConnected }: Props) {
  const { sovereign } = useSovereignConfig();
  const [mode, setMode] = useState<EgsConnectMode>('pilot_read');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConnect() {
    setBusy(true);
    setError(null);
    try {
      await connectEgsConsole(mode, { ministryCode: sovereign.ministryCode });
      onConnected();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo conectar');
    } finally {
      setBusy(false);
    }
  }

  const ModeIcon = MODES.find((m) => m.id === mode)?.icon ?? Eye;

  return (
    <section className="dt-connect-wizard" aria-labelledby="egs-connect-title">
      <header className="dt-connect-head">
        <h2 id="egs-connect-title" className="dt-connect-title">
          Conectar consola EGS
        </h2>
        <p className="dt-connect-lead">
          El pipeline refleja Postgres + checkpoints multiagente. Centinela reconcilia; Comunicador
          publica. Soberano/Logístico IAP en roadmap.
        </p>
      </header>

      <ul className="dt-connect-modes">
        {MODES.map((item) => {
          const Icon = item.icon;
          const active = mode === item.id;
          return (
            <li key={item.id}>
              <button
                type="button"
                className={`dt-connect-mode ${active ? 'dt-connect-mode--active' : ''}`}
                onClick={() => setMode(item.id)}
                aria-pressed={active}
              >
                <span className="dt-connect-mode-icon" aria-hidden>
                  <Icon {...agigovIconProps('md')} />
                </span>
                <span className="dt-connect-mode-body">
                  <span className="dt-connect-mode-title">{item.title}</span>
                  <span className="dt-connect-mode-detail">{item.detail}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {mode === 'institutional_ingest' ? (
        <p className="dt-connect-note">
          Tras provision piloto, ingesta hitos con Bearer token.{' '}
          <Link to={INSTITUTION_ROUTES.pilot}>Piloto institucional</Link>
        </p>
      ) : null}

      {mode === 'ops_api' ? (
        <p className="dt-connect-note">
          Ops: <code>npm run pilot:provision</code> · <code>npm run pilot:q-close</code> · multi-sig
          baseline.
        </p>
      ) : null}

      {error ? (
        <p className="dt-connect-error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="dt-connect-actions">
        <button
          type="button"
          className="desk-page-primary-btn"
          disabled={busy}
          onClick={() => void handleConnect()}
        >
          {busy ? (
            <Loader2 {...agigovIconProps('md', 'animate-spin')} />
          ) : (
            <ModeIcon {...agigovIconProps('md')} />
          )}
          Conectar y leer pipeline
          {!busy ? <ArrowRight {...agigovIconProps('md')} /> : null}
        </button>
      </div>

      <p className="dt-connect-disclaimer">
        Sin conexión simulada: el estado viene de QuarterClose, releases y processCheckpoint.agentId.
      </p>
    </section>
  );
}
