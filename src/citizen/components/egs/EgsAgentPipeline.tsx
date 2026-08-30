import { Check, AlertTriangle } from 'lucide-react';

import type { EgsPipelineResponse, EgsSwarmState } from '../../api.js';
import { agigovIconProps } from '../icons/agigovIcon.js';

const SWARM_AGENTS: Array<{
  key: keyof Pick<EgsSwarmState, 'centinela' | 'logistico' | 'soberano' | 'comunicador'>;
  label: string;
  role: string;
}> = [
  { key: 'centinela', label: 'Centinela', role: 'Reconcilia escrow · FREEZE' },
  { key: 'logistico', label: 'Logístico', role: 'Reparto Δ 70/20/10' },
  { key: 'soberano', label: 'Soberano', role: 'Dictamen tesorería' },
  { key: 'comunicador', label: 'Comunicador', role: 'Publica ledger ciudadano' },
];

function swarmClass(state: string): string {
  if (state === 'active') return 'is-active';
  if (state === 'complete') return 'is-done';
  if (state === 'freeze' || state === 'failed') return 'is-failed';
  if (state === 'blocked') return 'is-blocked';
  return 'is-idle';
}

type SwarmProps = { swarm: EgsSwarmState; lastAgentId: string | null };

/** Enjambre institucional — estado real por agente (no genérico Amazon). */
export function EgsAgentSwarmBar({ swarm, lastAgentId }: SwarmProps) {
  return (
    <section className="egs-swarm-bar" aria-label="Enjambre multiagente EGS">
      {!swarm.iapWired ? (
        <p className="egs-swarm-iap-note">
          IAP bus: ingest/Q-close aún no enrutan por MQTT — evidencia en Postgres + processCheckpoint.
        </p>
      ) : null}
      <ul className="egs-swarm-agents">
        {SWARM_AGENTS.map(({ key, label, role }) => {
          const state = swarm[key];
          return (
            <li key={key} className={`egs-swarm-agent ${swarmClass(state)}`}>
              <span className="egs-swarm-agent-name">{label}</span>
              <span className="egs-swarm-agent-role">{role}</span>
              <span className="egs-swarm-agent-state">{state}</span>
            </li>
          );
        })}
      </ul>
      {lastAgentId ? (
        <p className="egs-swarm-last">
          Último agentId en checkpoint: <code>{lastAgentId}</code>
        </p>
      ) : null}
    </section>
  );
}

type TrackerProps = {
  pipeline: EgsPipelineResponse;
};

/** Pipeline EGS con agente responsable por etapa. */
export function EgsAgentProcessTracker({ pipeline }: TrackerProps) {
  const stages = pipeline.stages;
  const activeIndex = stages.findIndex(
    (s) => s.status === 'active' || s.status === 'failed' || s.status === 'blocked',
  );
  const currentIndex = activeIndex >= 0 ? activeIndex : stages.findLastIndex((s) => s.status === 'complete');

  return (
    <section className="egs-process-tracker" aria-label="Pipeline EGS">
      <p className="model-process-tracker-live" role="status">
        {pipeline.liveLabel}
      </p>
      <ol className="egs-process-steps">
        {stages.map((stage, index) => {
          const done = stage.status === 'complete';
          const active = stage.status === 'active';
          const failed = stage.status === 'failed';
          const blocked = stage.status === 'blocked';
          const pending = stage.status === 'pending';

          return (
            <li
              key={stage.id}
              className={`egs-process-step ${done ? 'is-done' : ''} ${active ? 'is-active' : ''} ${pending ? 'is-pending' : ''} ${failed ? 'is-failed' : ''} ${blocked ? 'is-blocked' : ''}`}
              aria-current={index === currentIndex ? 'step' : undefined}
            >
              <span className="egs-process-node" aria-hidden>
                {done ? (
                  <Check {...agigovIconProps('sm')} />
                ) : failed ? (
                  <AlertTriangle {...agigovIconProps('sm')} />
                ) : (
                  <span className="model-process-tracker-dot" />
                )}
              </span>
              <span className="egs-process-body">
                <span className="egs-process-label">{stage.label}</span>
                <span className="egs-process-agent">{stage.agentLabel}</span>
                <span className="egs-process-detail">{stage.detail}</span>
              </span>
            </li>
          );
        })}
      </ol>
      <p className="egs-process-disclaimer">{pipeline.disclaimer}</p>
    </section>
  );
}
