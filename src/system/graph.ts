/**
 * Sovereign System Map — grafo read-only agregado desde pipelines honestos.
 * Fase 1A: no inventa aristas; deriva de GET …/models/*/pipeline + checkpoints EGS.
 */
import { getDataTrustPipelineStatus } from '../data-trust/pipeline.js';
import { getEgsPipelineStatus } from '../egs/pipeline.js';

export type SystemGraphNodeKind = 'model' | 'agent' | 'source' | 'checkpoint' | 'ledger';

export type SystemGraphNodeStatus =
  | 'connected'
  | 'active'
  | 'complete'
  | 'idle'
  | 'blocked'
  | 'freeze'
  | 'pending'
  | 'failed';

export interface SystemGraphNode {
  id: string;
  kind: SystemGraphNodeKind;
  label: string;
  status: SystemGraphNodeStatus;
  detail?: string;
  href?: string;
}

export type SystemGraphEdgeKind = 'connect' | 'handoff' | 'evidence' | 'serve';

export interface SystemGraphEdge {
  id: string;
  from: string;
  to: string;
  kind: SystemGraphEdgeKind;
  label?: string;
  stage?: string;
}

export interface SystemGraphResponse {
  updatedAt: string;
  nodeCount: number;
  edgeCount: number;
  nodes: SystemGraphNode[];
  edges: SystemGraphEdge[];
  pipelines: {
    dataTrust: { currentStage: string; connected: boolean };
    egs: { currentStage: string; connected: boolean; iapWired: boolean };
  };
  disclaimer: string;
}

function agentStatusFromSwarm(
  state: string,
): SystemGraphNodeStatus {
  if (state === 'freeze') return 'freeze';
  if (state === 'active') return 'active';
  if (state === 'complete') return 'complete';
  if (state === 'blocked') return 'blocked';
  return 'idle';
}

function stageToNodeStatus(
  status: string,
): SystemGraphNodeStatus {
  switch (status) {
    case 'complete':
      return 'complete';
    case 'active':
      return 'active';
    case 'blocked':
      return 'blocked';
    case 'failed':
      return 'failed';
    default:
      return 'pending';
  }
}

export async function getSystemGraph(): Promise<SystemGraphResponse> {
  const dataTrust = getDataTrustPipelineStatus();
  const egs = await getEgsPipelineStatus();

  const nodes: SystemGraphNode[] = [];
  const edges: SystemGraphEdge[] = [];
  const seen = new Set<string>();

  function addNode(node: SystemGraphNode) {
    if (seen.has(node.id)) return;
    seen.add(node.id);
    nodes.push(node);
  }

  function addEdge(edge: SystemGraphEdge) {
    edges.push(edge);
  }

  // —— Modelos ——
  addNode({
    id: 'model:data-trust',
    kind: 'model',
    label: 'DATA Trust',
    status: dataTrust.connection ? 'connected' : 'idle',
    detail: dataTrust.liveLabel,
    href: '/modelos/data-trust/consola',
  });

  addNode({
    id: 'model:egs',
    kind: 'model',
    label: 'EGS',
    status: egs.connection ? 'connected' : egs.tenantSlug ? 'active' : 'idle',
    detail: egs.liveLabel,
    href: '/modelos/egs/consola',
  });

  // —— Agentes (enjambre EGS) ——
  const agents: Array<{ id: string; label: string; swarmKey: keyof typeof egs.swarm }> = [
    { id: 'agent:centinela', label: 'Centinela', swarmKey: 'centinela' },
    { id: 'agent:logistico', label: 'Logístico', swarmKey: 'logistico' },
    { id: 'agent:soberano', label: 'Soberano', swarmKey: 'soberano' },
    { id: 'agent:comunicador', label: 'Comunicador', swarmKey: 'comunicador' },
  ];

  for (const a of agents) {
    const swarmState = egs.swarm[a.swarmKey];
    if (typeof swarmState === 'boolean') continue;
    addNode({
      id: a.id,
      kind: 'agent',
      label: a.label,
      status: agentStatusFromSwarm(swarmState),
      detail: egs.swarm.lastAgentId === a.label.toLowerCase() ? 'Último checkpoint' : undefined,
    });
  }

  // —— Fuentes connect ——
  if (dataTrust.connection) {
    const srcId = `source:data-trust:${dataTrust.connection.mode}`;
    addNode({
      id: srcId,
      kind: 'source',
      label: dataTrust.connection.label,
      status: 'connected',
      detail: dataTrust.connection.connectedAt,
    });
    addEdge({
      id: `edge-${srcId}-model:data-trust`,
      from: srcId,
      to: 'model:data-trust',
      kind: 'connect',
      label: 'connect',
    });
  }

  if (egs.connection) {
    const srcId = `source:egs:${egs.connection.mode}`;
    addNode({
      id: srcId,
      kind: 'source',
      label: egs.connection.label,
      status: 'connected',
      detail: `${egs.connection.ministryCode} · ${egs.connection.connectedAt}`,
    });
    addEdge({
      id: `edge-${srcId}-model:egs`,
      from: srcId,
      to: 'model:egs',
      kind: 'connect',
      label: 'connect',
    });
  } else if (egs.ministryCode) {
    addNode({
      id: `source:egs:pilot-${egs.ministryCode}`,
      kind: 'source',
      label: `Piloto ${egs.ministryCode}`,
      status: egs.tenantSlug ? 'active' : 'pending',
      detail: egs.tenantSlug ?? 'Sin tenant activo',
    });
    addEdge({
      id: 'edge-pilot-egs',
      from: `source:egs:pilot-${egs.ministryCode}`,
      to: 'model:egs',
      kind: 'connect',
      label: 'seed',
    });
  }

  // —— EGS stages → handoffs agente ——
  for (const stage of egs.stages) {
    if (stage.agent === 'ops' || stage.agent === 'institution' || stage.agent === 'human') continue;
    const agentId = `agent:${stage.agent}`;
    if (!seen.has(agentId)) continue;

    addEdge({
      id: `edge-model:egs-${agentId}-${stage.id}`,
      from: 'model:egs',
      to: agentId,
      kind: 'handoff',
      label: stage.label,
      stage: stage.id,
    });

    if (stage.status === 'complete' || stage.status === 'active') {
      const node = nodes.find((n) => n.id === agentId);
      if (node && node.status === 'idle') node.status = stageToNodeStatus(stage.status);
    }
  }

  // Centinela → Comunicador (publish path)
  if (egs.stages.find((s) => s.id === 'reconcile')?.status === 'complete') {
    addEdge({
      id: 'edge-centinela-comunicador',
      from: 'agent:centinela',
      to: 'agent:comunicador',
      kind: 'handoff',
      label: 'Q-close',
      stage: 'publish',
    });
  }

  // Checkpoint ledger
  if (egs.ledgerProcessId) {
    const cpId = `checkpoint:${egs.ledgerProcessId}`;
    addNode({
      id: cpId,
      kind: 'checkpoint',
      label: 'Q-close ledger',
      status: egs.published ? 'complete' : 'active',
      detail: egs.ledgerProcessId,
    });
    addEdge({
      id: 'edge-comunicador-checkpoint',
      from: 'agent:comunicador',
      to: cpId,
      kind: 'evidence',
      label: 'checkpoint',
    });
    addEdge({
      id: 'edge-checkpoint-serve',
      from: cpId,
      to: 'model:egs',
      kind: 'serve',
      label: 'ministry-health',
    });
  }

  // DATA Trust publish → serve
  const dtPublished = dataTrust.stages.find((s) => s.id === 'serve')?.status === 'complete';
  if (dtPublished) {
    addEdge({
      id: 'edge-data-trust-serve',
      from: 'model:data-trust',
      to: 'model:data-trust',
      kind: 'serve',
      label: 'datasets API',
    });
  }

  return {
    updatedAt: new Date().toISOString(),
    nodeCount: nodes.length,
    edgeCount: edges.length,
    nodes,
    edges,
    pipelines: {
      dataTrust: {
        currentStage: dataTrust.currentStage,
        connected: Boolean(dataTrust.connection),
      },
      egs: {
        currentStage: egs.currentStage,
        connected: Boolean(egs.connection),
        iapWired: egs.swarm.iapWired,
      },
    },
    disclaimer:
      'Grafo read-only Fase 1A. Aristas desde pipeline API; compositor multi-sig en Fase 4.',
  };
}
