import 'dotenv/config';

import express from 'express';

import { getCoreDb, disconnectCoreDb } from '../db/client.js';
import { isPanicMode } from '../security/panic.js';
import {
  registerContribution,
  CARTA_PROCESS_ID,
} from '../pilot/carta-ratification.js';
import { registerCitizenProposal } from '../pilot/citizen-proposals.js';
import { registerIrregularityReport } from '../pilot/citizen-irregularity.js';
import { getEgsContractDetail, getMinistryHealth } from '../pilot/egs-public.js';
import { getPublicProject, listPublicProjects } from '../pilot/projects-public.js';
import { castCneVote, getCneConsultation } from '../pilot/cne-consulta.js';
import {
  getUsageSummary,
  reconcileMeteringWithLedger,
  seedDemoMeteringIfEmpty,
} from '../billing/metering.js';
import { getDatasetById, getPublishedDatasets, runAggregationPipeline } from '../data-trust/aggregation.js';
import { processVesPaymentWebhook } from '../pilot/payment-webhook.js';
import { verifyPilotClosure, PILOT_PROCESS_ID } from '../pilot/multisig-acta.js';
import {
  SBX_PROCESS_ID,
  SBX_PEER_JURISDICTION,
} from '../pilot/sandbox-adhesion.js';
import { buildPublicHealth, VEN_NODE } from '../pilot/network-health.js';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const app = express();
const port = Number(process.env.PUBLIC_API_PORT ?? 3001);

app.use(express.json({ limit: '32kb' }));
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  next();
});

app.options('*', (_req, res) => {
  res.sendStatus(204);
});

/** Sin PII — solo datos publicados post-commit. */
app.get('/api/public/dashboard', async (_req, res) => {
  try {
    const db = getCoreDb();
    const published = await db.processCheckpoint.findMany({
      where: { status: 'published' },
      orderBy: { updatedAt: 'desc' },
      take: 20,
    });

    const reports = published.map((row) => {
      const bundle = row.evidenceBundle as Record<string, unknown>;
      const metrics = (bundle.publicMetrics ?? {}) as Record<string, unknown>;
      return {
        processId: row.processId,
        status: row.status,
        updatedAt: row.updatedAt.toISOString(),
        summary:
          typeof metrics.summary === 'string'
            ? metrics.summary
            : typeof metrics.factCount === 'number'
              ? `${metrics.factCount} hechos verificados registrados en ledger`
              : bundle.cartaRatification
                ? 'Carta AGIGOV-VEN ratificada'
                : bundle.pilotRatification
                  ? 'Piloto nacional ratificado'
                  : 'Gestión transparente publicada',
        metrics,
      };
    });

    const ledgerCount = await db.ledgerEntry.count();
    res.json({
      updatedAt: new Date().toISOString(),
      ledgerEntries: ledgerCount,
      reports,
    });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo cargar el dashboard' });
  }
});

app.get('/api/public/proposals', async (_req, res) => {
  try {
    const db = getCoreDb();
    const actas = await db.acta.findMany({
      where: {
        status: { in: ['received', 'committed', 'published'] },
        NOT: { processId: CARTA_PROCESS_ID },
      },
      orderBy: { updatedAt: 'desc' },
      take: 20,
      select: {
        processId: true,
        title: true,
        status: true,
        updatedAt: true,
      },
    });

    const checkpoints = await db.processCheckpoint.findMany({
      where: { processId: { in: actas.map((a) => a.processId) } },
      select: { processId: true, evidenceBundle: true },
    });
    const summaryByProcess = new Map(
      checkpoints.map((c) => {
        const bundle = c.evidenceBundle as Record<string, unknown>;
        return [c.processId, bundle.citizenSummary as string | undefined];
      }),
    );
    const dictamenByProcess = new Map<string, 'CONFORME' | 'REVISAR' | undefined>(
      checkpoints.map((c) => {
        const bundle = c.evidenceBundle as Record<string, unknown>;
        const d = bundle.dictamen;
        return [
          c.processId,
          d === 'CONFORME' || d === 'REVISAR' ? d : undefined,
        ];
      }),
    );

    res.json({
      updatedAt: new Date().toISOString(),
      proposals: actas.map((a) => ({
        id: a.processId,
        title: a.title,
        status: a.status,
        citizenSummary:
          summaryByProcess.get(a.processId) ?? simplificarTitulo(a.title),
        dictamen: dictamenByProcess.get(a.processId),
        updatedAt: a.updatedAt.toISOString(),
      })),
    });
  } catch {
    res.status(500).json({ error: 'No se pudieron cargar propuestas' });
  }
});

/** Propuesta ciudadana — metadatos sin PII (piloto MAR_NORTH_01). */
app.post('/api/public/proposals', async (req, res) => {
  if (isPanicMode()) {
    res.status(503).json({ error: 'Sistema en FREEZE — propuestas suspendidas' });
    return;
  }

  try {
    const { title, sector, territoryCode, facts } = req.body as {
      title?: string;
      sector?: string;
      territoryCode?: string;
      facts?: Array<{ text?: string; source?: string; date?: string }>;
    };

    const origin = process.env.ORIGIN_NODE_ID?.trim() ?? 'node-mar-north-01';
    const receipt = await registerCitizenProposal(
      {
        title: title ?? '',
        sector: sector ?? '',
        territoryCode,
        facts: (facts ?? []).map((f) => ({
          text: f.text ?? '',
          source: f.source,
          date: f.date,
        })),
      },
      origin,
    );

    res.status(201).json({ ok: true, receipt });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error al registrar propuesta';
    res.status(400).json({ error: msg });
  }
});

app.get('/api/public/supply', async (_req, res) => {
  try {
    const db = getCoreDb();
    const escrows = await db.escrow.groupBy({
      by: ['status'],
      _count: { id: true },
      _sum: { amount: true },
    });

    res.json({
      updatedAt: new Date().toISOString(),
      inventory: escrows.map((e) => ({
        status: e.status,
        count: e._count.id,
        totalAmount: e._sum.amount?.toString() ?? '0',
        currency: 'VES',
      })),
    });
  } catch {
    res.status(500).json({ error: 'No se pudo cargar inventario' });
  }
});

/** Proyectos DAO publicados — escrow + hitos (sin PII). */
app.get('/api/public/projects', async (_req, res) => {
  try {
    const projects = await listPublicProjects();
    const totals = projects.reduce(
      (acc, p) => {
        acc.count += 1;
        acc.raised += parseFloat(p.raisedAmount) || 0;
        acc.contributions += p.contributions;
        return acc;
      },
      { count: 0, raised: 0, contributions: 0 },
    );

    res.json({
      updatedAt: new Date().toISOString(),
      summary: {
        projectCount: totals.count,
        totalRaised: totals.raised.toFixed(4),
        totalContributions: totals.contributions,
        currency: 'VES',
      },
      projects,
    });
  } catch {
    res.status(500).json({ error: 'No se pudieron cargar proyectos' });
  }
});

/** Detalle proyecto + aportes agregados recientes (Paso 9). */
app.get('/api/public/projects/:id', async (req, res) => {
  try {
    const project = await getPublicProject(req.params.id);
    if (!project) {
      res.status(404).json({ error: 'Proyecto no encontrado' });
      return;
    }
    res.json({ updatedAt: new Date().toISOString(), project });
  } catch {
    res.status(500).json({ error: 'No se pudo cargar el proyecto' });
  }
});

/** Salud del Ministerio — cierre trimestral EGS (piloto vial MPPI). */
app.get('/api/public/egs/ministry-health', async (req, res) => {
  try {
    const ministry = typeof req.query.ministry === 'string' ? req.query.ministry : 'MPPI';
    const health = await getMinistryHealth(ministry);
    if (!health) {
      res.status(404).json({
        error: 'Sin datos EGS para este ministerio',
        hint: 'npm run db:seed:egs-pilot',
      });
      return;
    }
    res.json(health);
  } catch {
    res.status(500).json({ error: 'No se pudo cargar salud del ministerio' });
  }
});

/** Cadena de custodia — contrato vial + 5 hitos. */
app.get('/api/public/egs/contracts/:escrowProcessId', async (req, res) => {
  try {
    const detail = await getEgsContractDetail(req.params.escrowProcessId);
    if (!detail) {
      res.status(404).json({ error: 'Contrato EGS no encontrado' });
      return;
    }
    res.json(detail);
  } catch {
    res.status(500).json({ error: 'No se pudo cargar el contrato' });
  }
});

/** Reporte irregularidad ciudadano → conciliador (Paso 13). */
app.post('/api/public/reports/irregularity', async (req, res) => {
  if (isPanicMode()) {
    res.status(503).json({ error: 'Sistema en FREEZE — reportes suspendidos' });
    return;
  }

  try {
    const { category, description, evidenceRef, territoryCode } = req.body as {
      category?: string;
      description?: string;
      evidenceRef?: string;
      territoryCode?: string;
    };

    const origin = process.env.ORIGIN_NODE_ID?.trim() ?? 'node-mar-north-01';
    const receipt = await registerIrregularityReport(
      {
        category: category ?? 'otro',
        description: description ?? '',
        evidenceRef,
        territoryCode,
      },
      origin,
    );

    res.status(201).json({ ok: true, receipt });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error al registrar reporte';
    res.status(400).json({ error: msg });
  }
});

/** Pasarela VES — webhook stub (Paso 7). 👤 Firmar con secreto proveedor en producción. */
app.post('/api/public/payments/webhook', async (req, res) => {
  if (isPanicMode()) {
    res.status(503).json({ error: 'Sistema en FREEZE — pagos suspendidos' });
    return;
  }

  try {
    const origin = process.env.ORIGIN_NODE_ID?.trim() ?? 'node-mar-north-01';
    const result = await processVesPaymentWebhook(req.body, origin);
    res.status(result.ok ? 201 : 422).json(result);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Webhook inválido';
    res.status(400).json({ error: msg });
  }
});

/** CNE-AGIGOV consulta CNE-1 (Paso 12). */
app.get('/api/public/cne/consultation', (_req, res) => {
  try {
    res.json({ updatedAt: new Date().toISOString(), consultation: getCneConsultation() });
  } catch {
    res.status(500).json({ error: 'No se pudo cargar consulta CNE' });
  }
});

app.post('/api/public/cne/vote', (req, res) => {
  if (isPanicMode()) {
    res.status(503).json({ error: 'Sistema en FREEZE — votos suspendidos' });
    return;
  }

  try {
    const { optionId, voterToken } = req.body as { optionId?: string; voterToken?: string };
    if (!optionId) {
      res.status(400).json({ error: 'optionId requerido' });
      return;
    }
    if (!voterToken || voterToken.length < 8) {
      res.status(400).json({ error: 'voterToken anónimo requerido (≥8 chars)' });
      return;
    }
    const receipt = castCneVote(optionId, voterToken);
    res.status(201).json({
      ok: true,
      receipt,
      consultation: getCneConsultation(),
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Voto inválido';
    res.status(400).json({ error: msg });
  }
});

/** IaaU metering demo (M6). */
app.get('/api/public/billing/usage', (req, res) => {
  try {
    seedDemoMeteringIfEmpty();
    const jurisdictionId =
      typeof req.query.jurisdictionId === 'string' ? req.query.jurisdictionId : undefined;
    const period = typeof req.query.period === 'string' ? req.query.period : undefined;
    const summary = getUsageSummary(jurisdictionId, period);
    const reconciliation = reconcileMeteringWithLedger();
    res.json({
      updatedAt: new Date().toISOString(),
      summary,
      reconciliation,
      disclaimer: 'Demo metering — no factura vinculante',
    });
  } catch {
    res.status(500).json({ error: 'No se pudo cargar uso IaaU' });
  }
});

/** Data Trust — catálogo agregados k-anonymized (P2 demo). */
app.get('/api/public/data-trust/datasets', (_req, res) => {
  try {
    const datasets = getPublishedDatasets();
    res.json({
      updatedAt: new Date().toISOString(),
      kAnonymity: 5,
      datasets: datasets.map(({ cells, ...meta }) => ({
        ...meta,
        metricCount: cells.length,
      })),
    });
  } catch {
    res.status(500).json({ error: 'No se pudo cargar catálogo Data Trust' });
  }
});

app.get('/api/public/data-trust/datasets/:id', (req, res) => {
  try {
    const dataset = getDatasetById(req.params.id);
    if (!dataset) {
      res.status(404).json({ error: 'Dataset no encontrado' });
      return;
    }
    res.json({ updatedAt: new Date().toISOString(), dataset });
  } catch {
    res.status(500).json({ error: 'No se pudo cargar dataset' });
  }
});

/** Regenerar pipeline agregación (demo admin). */
app.post('/api/public/data-trust/refresh', (_req, res) => {
  if (isPanicMode()) {
    res.status(503).json({ error: 'Sistema en FREEZE' });
    return;
  }
  try {
    const datasets = runAggregationPipeline();
    res.status(201).json({ ok: true, count: datasets.length, datasets });
  } catch {
    res.status(500).json({ error: 'Pipeline Data Trust falló' });
  }
});

/** Estado piloto nacional multi-sig (Paso 10). */
app.get('/api/public/pilot', async (_req, res) => {
  try {
    const verification = await verifyPilotClosure();
    res.json({
      updatedAt: new Date().toISOString(),
      processId: PILOT_PROCESS_ID,
      ...verification,
    });
  } catch {
    res.status(500).json({ error: 'No se pudo verificar piloto' });
  }
});

/** OpenAPI stub — portal desarrolladores (Paso 6). */
app.get('/api/public/openapi.json', (_req, res) => {
  res.json({
    openapi: '3.0.3',
    info: {
      title: 'AGIGOV Public API',
      version: '1.0.0-pilot',
      description: 'API pública piloto MAR_NORTH_01 — sin PII en respuestas.',
    },
    servers: [{ url: 'http://127.0.0.1:3001' }],
    paths: {
      '/api/public/health': { get: { summary: 'Salud plataforma' } },
      '/api/public/dashboard': { get: { summary: 'Telemetría gestión' } },
      '/api/public/projects': { get: { summary: 'Proyectos DAO' } },
      '/api/public/projects/{id}': { get: { summary: 'Detalle proyecto' } },
      '/api/public/proposals': { get: { summary: 'Propuestas' }, post: { summary: 'Enviar propuesta' } },
      '/api/public/contributions': { post: { summary: 'Aporte piloto VES' } },
      '/api/public/reports/irregularity': { post: { summary: 'Reporte centinela ciudadano' } },
      '/api/public/cne/consultation': { get: { summary: 'Consulta CNE-1' } },
      '/api/public/cne/vote': { post: { summary: 'Voto SET demo cifrado' } },
      '/api/public/billing/usage': { get: { summary: 'Uso IaaU metering demo' } },
      '/api/public/data-trust/datasets': { get: { summary: 'Catálogo Data Trust k-anonymized' } },
      '/api/public/payments/webhook': { post: { summary: 'Webhook pasarela VES (stub)' } },
      '/api/public/pilot': { get: { summary: 'Estado piloto nacional' } },
    },
  });
});

/** Estado ratificación Carta AGIGOV-VEN (sin PII). */
app.get('/api/public/carta', async (_req, res) => {
  try {
    const db = getCoreDb();
    const checkpoint = await db.processCheckpoint.findUnique({
      where: { processId: CARTA_PROCESS_ID },
    });
    const acta = await db.acta.findUnique({ where: { processId: CARTA_PROCESS_ID } });
    const bundle = (checkpoint?.evidenceBundle ?? {}) as Record<string, unknown>;

    res.json({
      updatedAt: new Date().toISOString(),
      processId: CARTA_PROCESS_ID,
      version: String(bundle.cartaVersion ?? '0.1'),
      documentRef: String(bundle.documentRef ?? 'docs/AGIGOV/CARTA-AGIGOV-VEN.md'),
      ratified: bundle.cartaRatification === true,
      actaStatus: acta?.status ?? 'missing',
      checkpointStatus: checkpoint?.status ?? 'missing',
      threshold: Number(bundle.threshold ?? 3),
      signatureCount: Object.keys((bundle.signatures as object) ?? {}).length,
    });
  } catch {
    res.status(500).json({ error: 'No se pudo cargar estado de carta' });
  }
});

/** Aporte económico piloto MAR_NORTH_01 — recibo verificable en ledger. */
app.post('/api/public/contributions', async (req, res) => {
  if (isPanicMode()) {
    res.status(503).json({ error: 'Sistema en FREEZE — aportes suspendidos' });
    return;
  }

  try {
    const { projectId, amount, territoryCode, currency } = req.body as {
      projectId?: string;
      amount?: number;
      territoryCode?: string;
      currency?: string;
    };

    if (!projectId || typeof amount !== 'number') {
      res.status(400).json({ error: 'projectId y amount requeridos' });
      return;
    }

    const origin = process.env.ORIGIN_NODE_ID?.trim() ?? 'node-mar-north-01';
    const receipt = await registerContribution(
      { projectId, amount, territoryCode, currency },
      origin,
    );

    res.status(201).json({
      ok: true,
      message: 'Aporte registrado en ledger (piloto)',
      receipt,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error al registrar aporte';
    res.status(400).json({ error: msg });
  }
});

app.get('/api/public/health', async (req, res) => {
  const skipPeer = req.query.peer === '0';
  const peerUrl =
    process.env.AGIGOV_PEER_HEALTH_URL?.trim() ||
    'http://127.0.0.1:3002/api/public/health';

  let postgres = false;
  try {
    await getCoreDb().$queryRaw`SELECT 1`;
    postgres = true;
  } catch {
    postgres = false;
  }

  const payload = await buildPublicHealth({
    node: VEN_NODE,
    peerUrl,
    postgres,
    panicMode: isPanicMode(),
    skipPeer,
  });

  res.json(payload);
});

/** Jurisdicciones registradas en la red piloto (sin PII). */
app.get('/api/public/gov', async (_req, res) => {
  try {
    const db = getCoreDb();
    const cartaCheckpoint = await db.processCheckpoint.findUnique({
      where: { processId: CARTA_PROCESS_ID },
    });
    const sbxCheckpoint = await db.processCheckpoint.findUnique({
      where: { processId: SBX_PROCESS_ID },
    });
    const cartaBundle = (cartaCheckpoint?.evidenceBundle ?? {}) as Record<string, unknown>;
    const sbxBundle = (sbxCheckpoint?.evidenceBundle ?? {}) as Record<string, unknown>;

    const peerUrl =
      process.env.AGIGOV_PEER_HEALTH_URL?.trim() ||
      'http://127.0.0.1:3002/api/public/health';
    const health = await buildPublicHealth({
      node: VEN_NODE,
      peerUrl,
      postgres: true,
      panicMode: isPanicMode(),
    });

    res.json({
      updatedAt: new Date().toISOString(),
      crossHealthOk: health.crossHealthOk,
      jurisdictions: [
        {
          code: 'AGIGOV-VEN',
          iso: 'VEN',
          documentRef: 'docs/AGIGOV/CARTA-AGIGOV-VEN.md',
          ratified: cartaBundle.cartaRatification === true,
          checkpointStatus: cartaCheckpoint?.status ?? 'missing',
        },
        {
          code: 'AGIGOV-SBX',
          iso: 'SBX',
          documentRef: 'docs/AGIGOV/CARTA-AGIGOV-SBX.md',
          peerOf: SBX_PEER_JURISDICTION,
          adhesion: sbxBundle.sandboxAdhesion === true,
          checkpointStatus: sbxCheckpoint?.status ?? 'missing',
        },
      ],
      peer: health.peer,
    });
  } catch {
    res.status(500).json({ error: 'No se pudo cargar registro de gobiernos' });
  }
});

/** Ops — monitoreo centinela 24/7 (sin PII). */
app.get('/api/ops/health', async (_req, res) => {
  const honeypotLog = join(process.cwd(), 'data/honeypot-alerts.jsonl');
  let postgres = false;
  let ledgerEntries = 0;
  let publishedReports = 0;

  try {
    const db = getCoreDb();
    await db.$queryRaw`SELECT 1`;
    postgres = true;
    ledgerEntries = await db.ledgerEntry.count();
    publishedReports = await db.processCheckpoint.count({
      where: { status: 'published' },
    });
  } catch {
    postgres = false;
  }

  const honeypotAlerts = existsSync(honeypotLog)
    ? 'log-present'
    : 'no-alerts-yet';

  res.json({
    ok: postgres && !isPanicMode(),
    service: 'armada-ops',
    panicMode: isPanicMode(),
    postgres,
    ledgerEntries,
    publishedReports,
    honeypotAlerts,
    checkedAt: new Date().toISOString(),
  });
});

function simplificarTitulo(title: string): string {
  return title
    .replace(/^Dictamen\s+/i, 'Resumen ciudadano: ')
    .replace(/_/g, ' ');
}

app.listen(port, () => {
  console.log(`[Public API] http://127.0.0.1:${port}`);
});

process.on('SIGINT', async () => {
  await disconnectCoreDb();
  process.exit(0);
});
