import 'dotenv/config';

import express from 'express';

import { buildPublicHealth, SBX_NODE } from '../pilot/network-health.js';
import {
  mirrorFederationOutbox,
  readFederationInbox,
  type FederationOutboxItem,
} from '../pilot/federation-inbox.js';

const app = express();
const port = Number(process.env.SANDBOX_API_PORT ?? 3002);

const peerUrl =
  process.env.AGIGOV_PEER_HEALTH_URL?.trim() ||
  'http://127.0.0.1:3001/api/public/health';
const peerOutboxUrl =
  process.env.AGIGOV_PEER_FEDERATION_OUTBOX_URL?.trim() ||
  'http://127.0.0.1:3001/api/public/federation/outbox';

app.use(express.json({ limit: '64kb' }));

app.get('/api/public/health', async (req, res) => {
  const skipPeer = req.query.peer === '0';
  const payload = await buildPublicHealth({
    node: SBX_NODE,
    peerUrl,
    postgres: false,
    panicMode: false,
    skipPeer,
  });
  res.json({
    ...payload,
    ok: true,
    federationInboxCount: readFederationInbox().length,
  });
});

app.get('/api/public/gov', (_req, res) => {
  res.json({
    updatedAt: new Date().toISOString(),
    node: SBX_NODE,
    peerJurisdiction: 'AGIGOV-VEN',
    peerIso: 'VEN',
    adhesionDocument: 'docs/AGIGOV/CARTA-AGIGOV-SBX.md',
    cartaBase: 'docs/AGIGOV/CARTA-AGIGOV-BASE.md',
    status: 'sandbox-active',
    federationInboxCount: readFederationInbox().length,
  });
});

/** Pull published hashes from VEN embajador and mirror locally. */
app.post('/api/public/federation/pull', async (_req, res) => {
  try {
    const r = await fetch(peerOutboxUrl, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(8_000),
    });
    if (!r.ok) {
      res.status(502).json({ error: `peer outbox HTTP ${r.status}` });
      return;
    }
    const json = (await r.json()) as {
      jurisdiction?: string;
      items?: FederationOutboxItem[];
    };
    const written = mirrorFederationOutbox(
      json.items ?? [],
      json.jurisdiction ?? 'AGIGOV-VEN',
    );
    res.status(201).json({
      ok: true,
      mirrored: written.length,
      inboxTotal: readFederationInbox().length,
      source: json.jurisdiction ?? 'AGIGOV-VEN',
    });
  } catch (e) {
    res.status(502).json({
      error: e instanceof Error ? e.message : 'federation pull failed',
    });
  }
});

app.get('/api/public/federation/inbox', (_req, res) => {
  const items = readFederationInbox();
  res.json({
    updatedAt: new Date().toISOString(),
    node: SBX_NODE,
    count: items.length,
    items: items.slice(-50),
  });
});

app.listen(port, () => {
  console.log(`[Sandbox API] AGIGOV-SBX http://127.0.0.1:${port}`);
});
