import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ExternalLink, FileDown } from 'lucide-react';

import type {
  EgsMinistryStatusResponse,
  EgsPipelineResponse,
  MinistryHealthResponse,
} from '../../api.js';
import { publishEgsQuarterClose } from '../../api.js';
import { PlatformAlert } from '../PlatformAlert.js';
import { StatusBadge } from '../StatusBadge.js';
import { agigovIconProps } from '../icons/agigovIcon.js';
import { ModelConsoleZone } from '../models/ModelConsoleLayout.js';
import { useSovereignConfig } from '../../context/PlatformContext.js';
import { downloadEgsMinistryPdf } from '../../platform/exportEgsMinistryPdf.js';
import { ministryEgsConforme, ministryEgsStatusHint } from '../../platform/egsMinistryCopy.js';
import { EgsPublishModal } from './EgsPublishModal.js';
import { EgsRunExperience } from './EgsRunExperience.js';

type Props = {
  data: MinistryHealthResponse;
  status: EgsMinistryStatusResponse;
  pipeline?: EgsPipelineResponse | null;
  isAuthenticated: boolean;
  onPublished: () => void;
};

function PrimaryAction({
  status,
  onPublishClick,
}: {
  status: EgsMinistryStatusResponse;
  onPublishClick: () => void;
}) {
  const action = status.primaryAction;
  if (!action.enabled) return null;

  if (action.id === 'publish_q_close') {
    return (
      <button type="button" className="desk-page-primary-btn" onClick={onPublishClick}>
        {action.label}
      </button>
    );
  }

  if (action.href) {
    const external = action.href.startsWith('http');
    if (external) {
      return (
        <a href={action.href} className="desk-page-primary-btn">
          {action.label}
        </a>
      );
    }
    return (
      <Link to={action.href} className="desk-page-primary-btn inline-flex items-center gap-1.5">
        {action.label}
        {action.id === 'view_citizen_telemetry' ? (
          <ExternalLink {...agigovIconProps('sm')} />
        ) : null}
      </Link>
    );
  }

  return null;
}

/** Consola EGS — vista ministerio (resultado → acción → reparto → contratos). */
export function MinistryEgsConsole({
  data,
  status,
  pipeline,
  isAuthenticated,
  onPublished,
}: Props) {
  const { formatMoney, sovereign } = useSovereignConfig();
  const unit = data.currency ?? sovereign.currency;
  const fmt = (v: string) => `${formatMoney(v)} ${unit}`;
  const conforme = ministryEgsConforme(data);
  const savings = parseFloat(data.calculoAhorroFinal);
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishBusy, setPublishBusy] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  async function confirmPublish() {
    setPublishBusy(true);
    setPublishError(null);
    try {
      const result = await publishEgsQuarterClose(data.ministryCode);
      if (!result.ok || !result.published) {
        throw new Error(
          result.discrepancies[0] ?? 'No se pudo publicar — revisa custodia y reconciliación',
        );
      }
      setPublishOpen(false);
      onPublished();
    } catch (e) {
      setPublishError(e instanceof Error ? e.message : 'Error al publicar');
    } finally {
      setPublishBusy(false);
    }
  }

  return (
    <>
      {!data.reconcileOk ? (
        <PlatformAlert variant="error" title="Discrepancia — cierre bloqueado">
          <ul className="mt-2 list-inside list-disc text-[13px]">
            {data.discrepancies.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </PlatformAlert>
      ) : null}

      {pipeline ? <EgsRunExperience pipeline={pipeline} data={data} /> : null}

      <ModelConsoleZone label="Resultado">
        <dl className="desk-page-metrics desk-console-metrics">
          <div className="desk-page-metric">
            <dt>Ahorro verificado</dt>
            <dd>{fmt(data.calculoAhorroFinal)}</dd>
          </div>
          <div className="desk-page-metric">
            <dt>Reinversión 70%</dt>
            <dd>{fmt(data.split.reinversion)}</dd>
          </div>
          <div className="desk-page-metric">
            <dt>Estado</dt>
            <dd>{conforme ? 'Conforme' : 'Bloqueado'}</dd>
          </div>
        </dl>
        <p className="desk-console-outcome-note">{ministryEgsStatusHint(data)}</p>
      </ModelConsoleZone>

      <ModelConsoleZone label="Acción">
        <div className="egs-ministry-actions">
          <PrimaryAction status={status} onPublishClick={() => setPublishOpen(true)} />
          {savings <= 0 && conforme && !data.published ? (
            <p className="desk-console-outcome-note">
              Sin ahorro este trimestre — AGIGOV no cobra comisión de éxito.
            </p>
          ) : null}
          {status.blockReason && status.estadoConsola !== 'DISCREPANCIA' ? (
            <p className="desk-console-outcome-note">{status.blockReason}</p>
          ) : null}
          <button
            type="button"
            className="app-btn app-btn--secondary inline-flex items-center gap-1.5"
            onClick={() => downloadEgsMinistryPdf(data)}
          >
            <FileDown {...agigovIconProps('md')} />
            Exportar informe PDF
          </button>
        </div>
      </ModelConsoleZone>

      <ModelConsoleZone label="Reparto del ahorro">
        <p className="desk-console-outcome-note mb-3">
          Reglas publicadas del piloto — 70% más obras · 20% mérito · 10% protocolo.
        </p>
        <dl className="desk-page-metrics desk-console-metrics">
          <div className="desk-page-metric">
            <dt>70% más obras</dt>
            <dd>{fmt(data.split.reinversion)}</dd>
          </div>
          <div className="desk-page-metric">
            <dt>20% mérito</dt>
            <dd>{fmt(data.split.meritPool)}</dd>
          </div>
          <div className="desk-page-metric">
            <dt>10% protocolo</dt>
            <dd>{fmt(data.split.agigovFee)}</dd>
          </div>
        </dl>
      </ModelConsoleZone>

      <ModelConsoleZone label="Contratos en custodia">
        <div id="egs-contratos">
          {data.contracts.length === 0 ? (
            <p className="desk-console-outcome-note">Sin contratos activos en este entorno.</p>
          ) : (
            <ul className="desk-page-list">
              {data.contracts.map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/proyectos/contrato/${encodeURIComponent(c.id)}`}
                    className="desk-page-row"
                  >
                    <span className="desk-page-row-body">
                      <span className="desk-page-row-title">{c.title}</span>
                      <span className="desk-page-row-summary">
                        {c.territoryCode} · {c.milestonesReleased}/{c.milestonesTotal} hitos ·{' '}
                        {fmt(c.spentAmount)}
                      </span>
                    </span>
                    <StatusBadge status={c.status} />
                    <ChevronRight {...agigovIconProps('md')} aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </ModelConsoleZone>

      <details className="desk-console-tech egs-ministry-tech">
        <summary>Quién validó y detalle técnico</summary>
        <div className="egs-ministry-tech-body">
          <p>
            <strong>Estado consola:</strong> {status.estadoConsola} · semáforo {status.semaphore}
          </p>
          <p>
            <strong>Centinela:</strong>{' '}
            {data.reconcileOk ? 'custodia conforme con releases' : 'FREEZE — discrepancia'}
          </p>
          <p>
            <strong>Comunicador:</strong>{' '}
            {data.published ? 'cierre publicado al ledger ciudadano' : 'pendiente publish'}
          </p>
          {data.ledgerProcessId ? (
            <p className="desk-console-tech-line">
              Proceso: <code className="os-mono-id">{data.ledgerProcessId}</code>
            </p>
          ) : null}
          {pipeline ? (
            <p className="desk-console-tech-line">{pipeline.disclaimer}</p>
          ) : null}
          <p className="desk-console-tech-line">
            Línea base {fmt(data.baselineTrimestral)} · Gasto verificado{' '}
            {fmt(data.gastosVerificados)} ({data.executionPct}%)
          </p>
        </div>
      </details>

      <EgsPublishModal
        open={publishOpen}
        onClose={() => {
          if (!publishBusy) setPublishOpen(false);
        }}
        data={data}
        status={status}
        isAuthenticated={isAuthenticated}
        busy={publishBusy}
        error={publishError}
        onConfirm={() => void confirmPublish()}
      />
    </>
  );
}

/** Sin datos EGS — crear cuenta o completar preparación del entorno. */
export function MinistryEgsEmpty({
  ministryCode,
  isAuthenticated,
}: {
  ministryCode: string;
  isAuthenticated: boolean;
}) {
  const { t } = useSovereignConfig();

  return (
    <ModelConsoleZone label={t('trial.empty.zone')}>
      <p className="desk-console-outcome-note">{t('trial.empty.lead')}</p>
      <p className="desk-console-outcome-note mt-2 text-sm text-agigov-text-muted">
        <strong>{ministryCode}</strong> · {t('trial.empty.scope')}
      </p>
      <div className="egs-ministry-actions mt-4">
        {isAuthenticated ? (
          <Link to="/institucional/registro" className="desk-page-primary-btn">
            {t('trial.empty.retry')}
          </Link>
        ) : (
          <Link to="/institucional/registro" className="desk-page-primary-btn">
            {t('trial.cta')}
          </Link>
        )}
        {isAuthenticated ? (
          <Link to="/institucional/piloto" className="app-btn app-btn--secondary">
            {t('trial.empty.wizard')}
          </Link>
        ) : (
          <Link to="/institucional/acceso" className="app-btn app-btn--secondary">
            {t('auth.submit')}
          </Link>
        )}
      </div>
    </ModelConsoleZone>
  );
}
