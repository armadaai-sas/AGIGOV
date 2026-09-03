/** Identidad y handshake inter-nodo AGIGOV (sin PII). */

export interface NodeIdentity {
  jurisdiction: string;
  iso: string;
  nodeId: string;
  territoryCode: string;
  service: string;
}

export interface PeerHealthSnapshot {
  url: string;
  ok: boolean;
  jurisdiction?: string;
  iso?: string;
  latencyMs?: number;
  error?: string;
}

export interface PublicHealthPayload {
  ok: boolean;
  service: string;
  node: NodeIdentity;
  postgres?: boolean;
  panicMode?: boolean;
  peer?: PeerHealthSnapshot;
  crossHealthOk: boolean;
  checkedAt: string;
}

export const VEN_NODE: NodeIdentity = {
  jurisdiction: 'AGIGOV-VEN',
  iso: 'VEN',
  nodeId: process.env.ORIGIN_NODE_ID?.trim() || 'node-mar-north-01',
  territoryCode: 'MAR_NORTH_01',
  service: 'agigov-public-api',
};

export const SBX_NODE: NodeIdentity = {
  jurisdiction: 'AGIGOV-SBX',
  iso: 'SBX',
  nodeId: process.env.SBX_ORIGIN_NODE_ID?.trim() || 'node-sbx-west-01',
  territoryCode: 'SBX_WEST_01',
  service: 'agigov-sandbox-api',
};

export async function probePeerHealth(peerUrl: string): Promise<PeerHealthSnapshot> {
  const started = Date.now();
  const url = peerUrl.includes('?')
    ? `${peerUrl}&peer=0`
    : `${peerUrl}?peer=0`;
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(5_000),
      headers: { Accept: 'application/json' },
    });
    const latencyMs = Date.now() - started;
    if (!res.ok) {
      return { url: peerUrl, ok: false, latencyMs, error: `HTTP ${res.status}` };
    }
    const json = (await res.json()) as {
      ok?: boolean;
      node?: { jurisdiction?: string; iso?: string };
    };
    return {
      url: peerUrl,
      ok: json.ok === true,
      jurisdiction: json.node?.jurisdiction,
      iso: json.node?.iso,
      latencyMs,
    };
  } catch (error) {
    return {
      url: peerUrl,
      ok: false,
      latencyMs: Date.now() - started,
      error: error instanceof Error ? error.message : 'probe-failed',
    };
  }
}

export async function buildPublicHealth(input: {
  node: NodeIdentity;
  peerUrl?: string;
  postgres?: boolean;
  panicMode?: boolean;
  skipPeer?: boolean;
}): Promise<PublicHealthPayload> {
  const peerUrl =
    input.peerUrl?.trim() ||
    process.env.AGIGOV_PEER_HEALTH_URL?.trim() ||
    'http://127.0.0.1:3002/api/public/health';

  const peer = input.skipPeer ? undefined : await probePeerHealth(peerUrl);
  const crossHealthOk = Boolean(peer?.ok && peer.jurisdiction);

  // Public surface: ok = process serving (not panic). Postgres is advisory for peers/ops.
  return {
    ok: !(input.panicMode ?? false),
    service: input.node.service,
    node: input.node,
    postgres: input.postgres,
    panicMode: input.panicMode,
    peer,
    crossHealthOk,
    checkedAt: new Date().toISOString(),
  };
}
