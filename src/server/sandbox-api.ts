import 'dotenv/config';

import express from 'express';

import { buildPublicHealth, SBX_NODE } from '../pilot/network-health.js';

const app = express();
const port = Number(process.env.SANDBOX_API_PORT ?? 3002);

const peerUrl =
  process.env.AGIGOV_PEER_HEALTH_URL?.trim() ||
  'http://127.0.0.1:3001/api/public/health';

app.get('/api/public/health', async (req, res) => {
  const skipPeer = req.query.peer === '0';
  const payload = await buildPublicHealth({
    node: SBX_NODE,
    peerUrl,
    postgres: false,
    panicMode: false,
    skipPeer,
  });
  res.json({ ...payload, ok: true });
});

app.get('/api/public/gov', (_req, res) => {
  res.json({
    updatedAt: new Date().toISOString(),
    node: SBX_NODE,
    peerJurisdiction: 'AGIGOV-VEN',
    peerIso: 'VEN',
    adhesionDocument: 'docs/AGIGOV/CARTA-AGIGOV-SBX.md',
    status: 'sandbox-active',
  });
});

app.listen(port, () => {
  console.log(`[Sandbox API] AGIGOV-SBX http://127.0.0.1:${port}`);
});
