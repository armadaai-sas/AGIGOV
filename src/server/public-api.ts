import 'dotenv/config';

import express from 'express';

import { getCoreDb, disconnectCoreDb } from '../db/client.js';
import { isPanicMode } from '../security/panic.js';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const app = express();
const port = Number(process.env.PUBLIC_API_PORT ?? 3001);

app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
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
          typeof metrics.factCount === 'number'
            ? `${metrics.factCount} hechos verificados registrados en ledger`
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
      where: { status: { in: ['committed', 'published'] } },
      orderBy: { updatedAt: 'desc' },
      take: 20,
      select: {
        processId: true,
        title: true,
        status: true,
        updatedAt: true,
      },
    });

    res.json({
      updatedAt: new Date().toISOString(),
      proposals: actas.map((a) => ({
        id: a.processId,
        title: a.title,
        status: a.status,
        citizenSummary: simplificarTitulo(a.title),
        updatedAt: a.updatedAt.toISOString(),
      })),
    });
  } catch {
    res.status(500).json({ error: 'No se pudieron cargar propuestas' });
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

app.get('/api/public/health', (_req, res) => {
  res.json({ ok: true, service: 'armada-public-api' });
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
