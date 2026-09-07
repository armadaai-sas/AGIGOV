import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertTriangle, Check, Clock, Play, RotateCw } from 'lucide-react';

import type { EgsPipelineResponse, MinistryHealthResponse } from '../../api.js';
import { agigovIconProps } from '../icons/agigovIcon.js';
import { useSovereignConfig } from '../../context/PlatformContext.js';
import { EgsAgentSwarmBar } from './EgsAgentPipeline.js';

type Props = {
  pipeline: EgsPipelineResponse;
  data: MinistryHealthResponse;
};

type RunPhase = 'idle' | 'running' | 'done';
type StepView = 'done' | 'active' | 'pending' | 'failed' | 'blocked';
type StageStatus = EgsPipelineResponse['stages'][number]['status'];

/** Ritmo del "pensar → procesar" por etapa (ms). La revelación secuencial es
 * contenido (como mostrar el razonamiento), no decoración: se ejecuta siempre;
 * el movimiento decorativo (pulso, spinner) lo desactiva CSS bajo
 * `prefers-reduced-motion`. */
const STEP_MS = 700;

function realToView(status: StageStatus): StepView {
  switch (status) {
    case 'complete':
      return 'done';
    case 'failed':
      return 'failed';
    case 'blocked':
      return 'blocked';
    case 'active':
      return 'active';
    default:
      return 'pending';
  }
}

/**
 * Ejecución interactiva del pipeline EGS: al pulsar "Ejecutar", el enjambre
 * recorre sus 8 etapas revelando el estado real de cada una (pensar → procesar
 * → resultado), se detiene con honestidad ante un FREEZE y muestra las cifras
 * del cierre al terminar. Presentación en vivo de datos reales, no una animación
 * decorativa: cada etapa refleja el `status` que devuelve el backend.
 */
export function EgsRunExperience({ pipeline, data }: Props) {
  const { formatMoney, sovereign } = useSovereignConfig();
  const unit = data.currency ?? sovereign.currency;
  const fmt = (v: string) => `${formatMoney(v)} ${unit}`;

  const stages = pipeline.stages;
  const stagesRef = useRef(stages);
  stagesRef.current = stages;

  const [phase, setPhase] = useState<RunPhase>('idle');
  const [activeStep, setActiveStep] = useState(-1);
  const [haltIndex, setHaltIndex] = useState<number | null>(null);

  const timerRef = useRef<number | undefined>(undefined);
  const runIdRef = useRef(0);

  const play = useCallback(() => {
    const current = stagesRef.current;
    window.clearTimeout(timerRef.current);
    const runId = ++runIdRef.current;
    setHaltIndex(null);
    setPhase('running');
    setActiveStep(0);

    const step = (i: number) => {
      if (runId !== runIdRef.current) return;
      if (i >= current.length) {
        setActiveStep(current.length);
        setPhase('done');
        return;
      }
      setActiveStep(i);
      timerRef.current = window.setTimeout(() => {
        if (runId !== runIdRef.current) return;
        if (current[i].status === 'failed') {
          setActiveStep(i + 1);
          setHaltIndex(i);
          setPhase('done');
          return;
        }
        step(i + 1);
      }, STEP_MS);
    };
    step(0);
  }, []);

  useEffect(() => {
    play();
    return () => {
      runIdRef.current += 1;
      window.clearTimeout(timerRef.current);
    };
    // Auto-reproduce una vez al montar; el botón "Ejecutar de nuevo" repite.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const running = phase === 'running';

  const viewFor = (i: number): StepView => {
    if (running) {
      if (i < activeStep) return realToView(stages[i].status);
      if (i === activeStep) return 'active';
      return 'pending';
    }
    if (activeStep < 0) return 'pending';
    if (i < activeStep) return realToView(stages[i].status);
    return 'pending';
  };

  const currentIndex = running
    ? activeStep
    : (() => {
        const live = stages.findIndex(
          (s) => s.status === 'active' || s.status === 'failed' || s.status === 'blocked',
        );
        if (live >= 0) return live;
        let last = -1;
        stages.forEach((s, idx) => {
          if (s.status === 'complete') last = idx;
        });
        return last;
      })();

  const liveText =
    running && activeStep >= 0 && activeStep < stages.length
      ? `${stages[activeStep].agentLabel}: ${stages[activeStep].detail}`
      : haltIndex != null
        ? `En pausa por revisión — ${pipeline.discrepancies[0] ?? 'diferencia detectada en la custodia de fondos'}`
        : pipeline.liveLabel;

  const btnLabel = running ? 'Procesando…' : phase === 'done' ? 'Ejecutar de nuevo' : 'Ejecutar análisis';

  return (
    <section className="egs-run" aria-label="Ejecución del análisis EGS">
      <div className="egs-run-head">
        <div className="egs-run-head-copy">
          <p className="egs-run-title">Análisis EGS</p>
          <p className="egs-run-sub">8 pasos sobre los datos reales de la institución</p>
        </div>
        <button
          type="button"
          className="app-btn app-btn--secondary inline-flex items-center gap-1.5"
          onClick={play}
          disabled={running}
        >
          {running ? (
            <span className="egs-run-spinner" aria-hidden />
          ) : phase === 'done' ? (
            <RotateCw {...agigovIconProps('md')} />
          ) : (
            <Play {...agigovIconProps('md')} />
          )}
          {btnLabel}
        </button>
      </div>

      <p className={`egs-run-live ${running ? 'is-thinking' : ''}`} role="status" aria-live="polite">
        {running ? (
          <span className="egs-run-dots" aria-hidden>
            <span />
            <span />
            <span />
          </span>
        ) : null}
        {liveText}
      </p>

      <ol className="egs-run-steps">
        {stages.map((stage, i) => {
          const view = viewFor(i);
          return (
            <li
              key={stage.id}
              className={`egs-run-step is-${view}`}
              aria-current={i === currentIndex ? 'step' : undefined}
            >
              <span className="egs-run-node" aria-hidden>
                {view === 'done' ? (
                  <Check {...agigovIconProps('sm')} />
                ) : view === 'failed' ? (
                  <AlertTriangle {...agigovIconProps('sm')} />
                ) : view === 'blocked' ? (
                  <Clock {...agigovIconProps('sm')} />
                ) : (
                  <span className="egs-run-dot" />
                )}
              </span>
              <span className="egs-run-body">
                <span className="egs-run-label">
                  {stage.label}
                  {view === 'blocked' ? <span className="egs-run-chip">roadmap</span> : null}
                </span>
                <span className="egs-run-agent">{stage.agentLabel}</span>
                <span className="egs-run-detail">
                  {view === 'active' ? 'Procesando…' : stage.detail}
                </span>
              </span>
            </li>
          );
        })}
      </ol>

      {phase === 'done' && haltIndex == null ? (
        <div className="egs-run-results">
          <p className="egs-run-results-title">Resultado del cierre</p>
          <dl className="egs-run-metrics">
            <div>
              <dt>Ahorro Δ</dt>
              <dd>{fmt(data.calculoAhorroFinal)}</dd>
            </div>
            <div>
              <dt>70% obras</dt>
              <dd>{fmt(data.split.reinversion)}</dd>
            </div>
            <div>
              <dt>20% mérito</dt>
              <dd>{fmt(data.split.meritPool)}</dd>
            </div>
            <div>
              <dt>10% protocolo</dt>
              <dd>{fmt(data.split.agigovFee)}</dd>
            </div>
            <div>
              <dt>Ejecución</dt>
              <dd>{data.executionPct}%</dd>
            </div>
          </dl>
          {data.ledgerProcessId ? (
            <p className="egs-run-evidence">
              Registro verificable: <code className="os-mono-id">{data.ledgerProcessId}</code>
            </p>
          ) : (
            <p className="egs-run-evidence egs-run-evidence--muted">
              Aún sin publicar — completa el cierre para registrar la evidencia.
            </p>
          )}
          <EgsAgentSwarmBar swarm={pipeline.swarm} lastAgentId={pipeline.swarm.lastAgentId} />
        </div>
      ) : null}
    </section>
  );
}
