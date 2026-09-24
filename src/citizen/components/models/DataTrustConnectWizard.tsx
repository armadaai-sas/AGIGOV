import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Database, Link2, Building2, ArrowRight, Loader2 } from 'lucide-react';

import type { DataTrustConnectMode } from '../../../data-trust/pipeline.js';
import { connectDataTrustSource, runDataTrustPipeline } from '../../api.js';
import { agigovIconProps } from '../icons/agigovIcon.js';
import { INSTITUTION_ROUTES } from '../../platform/institutionalRoutes.js';

type Props = {
  onConnected: () => void;
};

const MODES: Array<{
  id: DataTrustConnectMode;
  title: string;
  detail: string;
  icon: typeof Database;
}> = [
  {
    id: 'demo_telemetry',
    title: 'Telemetría demo',
    detail: 'Celdas sintéticas de gestión pública — listo en segundos.',
    icon: Database,
  },
  {
    id: 'api_endpoint',
    title: 'Conectar API',
    detail: 'Declara tu endpoint enterprise (validación en roadmap).',
    icon: Link2,
  },
  {
    id: 'institutional',
    title: 'Cuenta institucional',
    detail: 'ETL desde telemetría soberana tras registro piloto.',
    icon: Building2,
  },
];

/** Wizard Conectar — DATA Trust (honesto por modo). */
export function DataTrustConnectWizard({ onConnected }: Props) {
  const [mode, setMode] = useState<DataTrustConnectMode>('demo_telemetry');
  const [endpoint, setEndpoint] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConnect(runAfter = true) {
    setBusy(true);
    setError(null);
    try {
      await connectDataTrustSource(mode, mode === 'api_endpoint' ? { endpoint } : undefined);
      if (runAfter && mode !== 'institutional') {
        await runDataTrustPipeline();
      }
      onConnected();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo conectar');
    } finally {
      setBusy(false);
    }
  }

  const ModeIcon = MODES.find((m) => m.id === mode)?.icon ?? Database;

  return (
    <section className="dt-connect-wizard" aria-labelledby="dt-connect-title">
      <header className="dt-connect-head">
        <h2 id="dt-connect-title" className="dt-connect-title">
          Conectar fuente de datos
        </h2>
        <p className="dt-connect-lead">
          DATA Trust agrega telemetría institucional con k-anonymity — sin PII. Elige cómo alimentar el
          modelo.
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

      {mode === 'api_endpoint' ? (
        <label className="dt-connect-field">
          <span className="dt-connect-field-label">URL base de tu API</span>
          <input
            type="url"
            className="dt-connect-input"
            placeholder="https://tu-sistema.gov.ve/api/telemetria"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            autoComplete="off"
          />
        </label>
      ) : null}

      {mode === 'institutional' ? (
        <p className="dt-connect-note">
          El ETL institucional requiere registro y piloto ratificado. Puedes{' '}
          <Link to={INSTITUTION_ROUTES.register}>crear cuenta</Link> y marcar la intención de conexión.
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
          disabled={busy || (mode === 'api_endpoint' && !endpoint.trim())}
          onClick={() => void handleConnect(mode !== 'institutional')}
        >
          {busy ? (
            <Loader2 {...agigovIconProps('md', 'animate-spin')} />
          ) : (
            <ModeIcon {...agigovIconProps('md')} />
          )}
          {mode === 'institutional' ? 'Registrar intención de conexión' : 'Conectar y ejecutar pipeline'}
          {!busy ? <ArrowRight {...agigovIconProps('md')} /> : null}
        </button>
      </div>

      <p className="dt-connect-disclaimer">
        Datos de demostración. El dictamen de una persona y la licencia de empresa siguen en camino.
      </p>
    </section>
  );
}
