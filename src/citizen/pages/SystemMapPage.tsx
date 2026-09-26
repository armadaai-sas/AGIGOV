import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Network, RefreshCw } from 'lucide-react';

import { fetchSystemGraph, type SystemGraphNode, type SystemGraphResponse } from '../api.js';
import { ModelConsoleLayout, ModelConsoleZone } from '../components/models/ModelConsoleLayout.js';
import { PageShell, LoadingState } from '../components/PageShell.js';
import { agigovIconProps } from '../components/icons/agigovIcon.js';

function statusClass(status: SystemGraphNode['status']): string {
  switch (status) {
    case 'complete':
    case 'connected':
      return 'is-done';
    case 'active':
      return 'is-active';
    case 'freeze':
    case 'failed':
      return 'is-failed';
    case 'blocked':
      return 'is-blocked';
    default:
      return 'is-idle';
  }
}

function GraphNodeCard({ node }: { node: SystemGraphNode }) {
  const body = (
    <>
      <span className="system-map-node-kind">{node.kind}</span>
      <span className="system-map-node-label">{node.label}</span>
      {node.detail ? <span className="system-map-node-detail">{node.detail}</span> : null}
      <span className="system-map-node-status">{node.status}</span>
    </>
  );

  if (node.href) {
    return (
      <Link to={node.href} className={`system-map-node ${statusClass(node.status)}`}>
        {body}
      </Link>
    );
  }

  return <div className={`system-map-node ${statusClass(node.status)}`}>{body}</div>;
}

/** Fase 1A — mapa soberano read-only del sistema interconectado. */
export default function SystemMapPage() {
  const [graph, setGraph] = useState<SystemGraphResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setGraph(await fetchSystemGraph());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo cargar el mapa');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const id = setInterval(() => void load(), 8_000);
    return () => clearInterval(id);
  }, [load]);

  const models = graph?.nodes.filter((n) => n.kind === 'model') ?? [];
  const agents = graph?.nodes.filter((n) => n.kind === 'agent') ?? [];
  const sources = graph?.nodes.filter((n) => n.kind === 'source') ?? [];
  const checkpoints = graph?.nodes.filter((n) => n.kind === 'checkpoint') ?? [];

  return (
    <PageShell shell narrow>
      <ModelConsoleLayout
        eyebrow="Estado"
        title="Mapa del sistema"
        result={
          graph
            ? `${graph.nodeCount} nodos · ${graph.edgeCount} conexiones — datos del sector y ahorro en vivo.`
            : 'Vista read-only de modelos, agentes y checkpoints interconectados.'
        }
        dataHint={graph?.disclaimer}
        action={
          <button
            type="button"
            className="app-btn app-btn--secondary inline-flex items-center gap-1.5"
            onClick={() => void load()}
          >
            <RefreshCw {...agigovIconProps('md')} />
            Actualizar
          </button>
        }
      >
        {loading && !graph ? <LoadingState label="Construyendo grafo…" /> : null}

        {error ? (
          <p className="dt-connect-error" role="alert">
            {error}
          </p>
        ) : null}

        {graph ? (
          <>
            <ModelConsoleZone label="Enjambre">
              <ul className="system-map-agents">
                {agents.map((node) => (
                  <li key={node.id}>
                    <GraphNodeCard node={node} />
                  </li>
                ))}
              </ul>
            </ModelConsoleZone>

            <ModelConsoleZone label="Flujo">
              <div className="system-map-flow">
                {sources.length ? (
                  <div className="system-map-flow-row">
                    <p className="system-map-flow-label">Fuentes</p>
                    <ul className="system-map-flow-nodes">
                      {sources.map((n) => (
                        <li key={n.id}>
                          <GraphNodeCard node={n} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <div className="system-map-flow-connector" aria-hidden />
                <div className="system-map-flow-row">
                  <p className="system-map-flow-label">Modelos</p>
                  <ul className="system-map-flow-nodes">
                    {models.map((n) => (
                      <li key={n.id}>
                        <GraphNodeCard node={n} />
                      </li>
                    ))}
                  </ul>
                </div>
                {checkpoints.length ? (
                  <>
                    <div className="system-map-flow-connector" aria-hidden />
                    <div className="system-map-flow-row">
                      <p className="system-map-flow-label">Ledger</p>
                      <ul className="system-map-flow-nodes">
                        {checkpoints.map((n) => (
                          <li key={n.id}>
                            <GraphNodeCard node={n} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : null}
              </div>
            </ModelConsoleZone>

            <ModelConsoleZone label="Aristas">
              <ul className="system-map-edges">
                {graph.edges.map((edge) => (
                  <li key={edge.id} className="system-map-edge">
                    <Network {...agigovIconProps('sm')} aria-hidden />
                    <span>
                      {edge.from.replace(/^[^:]+:/, '')} → {edge.to.replace(/^[^:]+:/, '')}
                    </span>
                    {edge.label ? <span className="system-map-edge-label">{edge.label}</span> : null}
                  </li>
                ))}
              </ul>
            </ModelConsoleZone>
          </>
        ) : null}
      </ModelConsoleLayout>
    </PageShell>
  );
}
