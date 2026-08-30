import { Link } from 'react-router-dom';
import { ChevronRight, ExternalLink } from 'lucide-react';

import type { EgsPipelineResponse, MinistryHealthResponse } from '../../api.js';
import { PlatformAlert } from '../PlatformAlert.js';
import { StatusBadge } from '../StatusBadge.js';
import { agigovIconProps } from '../icons/agigovIcon.js';
import { ModelConsoleZone } from '../models/ModelConsoleLayout.js';
import { useSovereignConfig } from '../../context/PlatformContext.js';
import { INSTITUTION_ROUTES } from '../../platform/institutionalRoutes.js';
import {
  ministryEgsConforme,
  ministryEgsResultLine,
  ministryEgsStatusHint,
} from '../../platform/egsMinistryCopy.js';

type Props = {
  data: MinistryHealthResponse;
  pipeline?: EgsPipelineResponse | null;
};

/** Consola EGS — vista ministerio (resultado → acción → reparto → contratos). */
export function MinistryEgsConsole({ data, pipeline }: Props) {
  const { formatMoney, sovereign } = useSovereignConfig();
  const unit = data.currency ?? sovereign.currency;
  const fmt = (v: string) => `${formatMoney(v)} ${unit}`;
  const conforme = ministryEgsConforme(data);
  const savings = parseFloat(data.calculoAhorroFinal);

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
          {!data.published && conforme ? (
            <Link to={INSTITUTION_ROUTES.pilot} className="desk-page-primary-btn">
              Cerrar y publicar trimestre
            </Link>
          ) : null}
          {data.published ? (
            <Link to="/gestion" className="desk-page-primary-btn inline-flex items-center gap-1.5">
              Ver telemetría ciudadana
              <ExternalLink {...agigovIconProps('sm')} />
            </Link>
          ) : null}
          {!conforme ? (
            <Link to="/contratos" className="desk-page-primary-btn">
              Revisar contratos afectados
            </Link>
          ) : null}
          {savings <= 0 && conforme && !data.published ? (
            <p className="desk-console-outcome-note">
              Sin ahorro este trimestre — AGIGOV no cobra comisión de éxito.
            </p>
          ) : null}
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
      </ModelConsoleZone>

      <details className="desk-console-tech egs-ministry-tech">
        <summary>Quién validó y detalle técnico</summary>
        <div className="egs-ministry-tech-body">
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
    </>
  );
}

/** Sin datos EGS — ministerio aún no provisionado. */
export function MinistryEgsEmpty({ ministryCode }: { ministryCode: string }) {
  return (
    <ModelConsoleZone label="Arranque del piloto">
      <p className="desk-console-outcome-note">
        Aún no hay telemetría fiscal para <strong>{ministryCode}</strong>. Provisiona el piloto
        institucional para fijar línea base, ingestar hitos y cerrar el primer trimestre.
      </p>
      <div className="egs-ministry-actions mt-4">
        <Link to={INSTITUTION_ROUTES.pilot} className="desk-page-primary-btn">
          Iniciar piloto EGS
        </Link>
        <Link to={INSTITUTION_ROUTES.register} className="app-btn app-btn--secondary">
          Registro institucional
        </Link>
      </div>
      <p className="desk-console-outcome-note mt-4">
        Demo ops: <code>npm run db:seed:egs-pilot</code> en el nodo servidor.
      </p>
    </ModelConsoleZone>
  );
}
