import 'dotenv/config';

import express from 'express';
import type { Request, Response, NextFunction } from 'express';

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
  reconcileMeteringWithCheckpoints,
  seedDemoMeteringIfEmpty,
  estimateIaauInvoiceUsd,
} from '../billing/metering.js';
import { buildChargeCatalog } from '../billing/catalog.js';
import { assertFreeCostZero, resolvePlan } from '../billing/plan.js';
import { getBillingFreeze, clearBillingFreeze } from '../billing/freeze.js';
import { computeEgsFeeInvoice } from '../billing/egs-fee.js';
import { claimTenantSeat, getTenantSeats, setTenantSaasPlan } from '../billing/seats.js';
import type { AgigovPlan } from '../billing/plan.js';
import { getDatasetById, getPublishedDatasets, runAggregationPipeline } from '../data-trust/aggregation.js';
import {
  processVesPaymentWebhook,
  WebhookAuthError,
} from '../pilot/payment-webhook.js';
import { verifyPilotClosure, PILOT_PROCESS_ID } from '../pilot/multisig-acta.js';
import {
  authenticateTenantIngest,
  ingestPilotMilestones,
  type IngestRow,
} from '../pilot/tenant-ingest.js';
import { listPilotTenants, provisionPilotTenant } from '../pilot/tenant-provision.js';
import { getPilotProfileForIso } from '../pilot/pilot-jurisdiction-profiles.js';
import {
  getTenantBaselineStatus,
  onboardPilotTenant,
  ratifyPilotTenantBaseline,
} from '../pilot/tenant-onboarding.js';
import { runTenantQuarterClosePipeline } from '../pilot/tenant-q-close.js';
import {
  listFederationOutbox,
  mirrorFederationOutbox,
  readFederationInbox,
} from '../pilot/federation-inbox.js';
import {
  SBX_PROCESS_ID,
  SBX_PEER_JURISDICTION,
} from '../pilot/sandbox-adhesion.js';
import { buildPublicHealth, type NodeIdentity } from '../pilot/network-health.js';
import {
  JURISDICTIONS,
  SUPPORTED_CURRENCIES,
  SUPPORTED_LOCALES,
  buildPublicSovereignConfig,
  nodeIdentityFromEnv,
} from '../config/sovereign/index.js';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  loginInstitutionUser,
  registerInstitutionUser,
  requestInstitutionMagicLink,
  resolveInstitutionSession,
  revokeInstitutionSession,
  setInstitutionVerificationStatus,
  toSessionResponse,
  verifyInstitutionMagicLink,
} from './institution-auth.js';
import { sendBaselineReadyEmail } from './email/index.js';

const app = express();
const port = Number(process.env.PUBLIC_API_PORT ?? 3001);
const NODE: NodeIdentity = nodeIdentityFromEnv();

type RequestWithRawBody = Request & { rawBody?: string };

app.use(
  express.json({
    limit: '32kb',
    verify: (req, _res, buf) => {
      const url = req.url ?? '';
      if (url.includes('/payments/webhook')) {
        (req as RequestWithRawBody).rawBody = buf.toString('utf8');
      }
    },
  }),
);
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
  next();
});

app.options('*', (_req, res) => {
  res.sendStatus(204);
});

type OpsAuthRequest = Request & {
  institutionSession?: Awaited<ReturnType<typeof resolveInstitutionSession>>;
};

function isOpsAuthExcluded(path: string): boolean {
  return (
    path === '/api/ops/health' ||
    path.startsWith('/api/ops/auth/') ||
    path.startsWith('/api/ops/ingest/')
  );
}

async function requireOpsAuth(req: OpsAuthRequest, res: Response, next: NextFunction) {
  if (!req.path.startsWith('/api/ops/')) {
    next();
    return;
  }
  if (isOpsAuthExcluded(req.path)) {
    next();
    return;
  }

  const staticOpsKey = process.env.AGIGOV_OPS_API_KEY?.trim();
  const suppliedOpsKey = String(req.headers['x-ops-key'] ?? '').trim();
  if (staticOpsKey && suppliedOpsKey && suppliedOpsKey === staticOpsKey) {
    next();
    return;
  }

  const session = await resolveInstitutionSession(req.headers.authorization);
  if (!session) {
    res.status(401).json({ error: 'ops_auth_required' });
    return;
  }
  req.institutionSession = session;
  next();
}

app.use((req, res, next) => {
  void requireOpsAuth(req as OpsAuthRequest, res, next).catch(() => {
    res.status(500).json({ error: 'ops_auth_guard_failed' });
  });
});

app.post('/api/ops/auth/register', async (req, res) => {
  if (isPanicMode()) {
    res.status(503).json({ error: 'PANIC_MODE: auth suspendida' });
    return;
  }
  try {
    const body = req.body as {
      email?: string;
      password?: string;
      institutionName?: string;
      entityType?: string;
      officialCode?: string;
      contactName?: string;
      contactRole?: string;
      iso?: string;
      regionCode?: string;
      entityCatalogId?: string;
      phone?: string;
      phoneCountryCode?: string;
    };
    const session = await registerInstitutionUser({
      email: body.email ?? '',
      password: body.password ?? '',
      institutionName: body.institutionName ?? '',
      entityType: body.entityType ?? 'other',
      officialCode: body.officialCode,
      contactName: body.contactName,
      contactRole: body.contactRole,
      iso: body.iso,
      regionCode: body.regionCode,
      entityCatalogId: body.entityCatalogId,
      phone: body.phone,
      phoneCountryCode: body.phoneCountryCode,
    });
    res.status(201).json(session);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'auth_register_error';
    const status = msg === 'email_already_registered' ? 409 : 400;
    res.status(status).json({ error: msg });
  }
});

app.post('/api/ops/auth/login', async (req, res) => {
  try {
    const body = req.body as { email?: string; password?: string };
    const session = await loginInstitutionUser(body.email ?? '', body.password ?? '');
    res.json(session);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'auth_login_error';
    const status = msg === 'invalid_credentials' ? 401 : 400;
    res.status(status).json({ error: msg });
  }
});

/** Ops: marcar verificación institucional tras revisión humana de canales públicos. */
app.post('/api/ops/auth/verification', async (req, res) => {
  if (isPanicMode()) {
    res.status(503).json({ error: 'PANIC_MODE: auth suspendida' });
    return;
  }
  try {
    const body = req.body as {
      email?: string;
      status?: 'unverified' | 'pending_verification' | 'verified' | 'rejected';
      notes?: string;
    };
    const user = await setInstitutionVerificationStatus({
      email: body.email ?? '',
      status: body.status ?? 'pending_verification',
      notes: body.notes,
    });
    res.json({ ok: true, user });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'verification_error';
    const status = msg === 'invalid_verification_status' ? 400 : 404;
    res.status(status).json({ error: msg });
  }
});

app.get('/api/ops/auth/session', async (req, res) => {
  const session = await resolveInstitutionSession(req.headers.authorization);
  if (!session) {
    res.status(401).json({ error: 'invalid_session' });
    return;
  }
  res.json(toSessionResponse(session));
});

app.post('/api/ops/auth/logout', async (req, res) => {
  await revokeInstitutionSession(req.headers.authorization);
  res.status(204).end();
});

app.post('/api/ops/auth/magic-link/request', async (req, res) => {
  const body = req.body as { email?: string };
  try {
    const result = await requestInstitutionMagicLink(body.email ?? '');
    res.status(202).json(result);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'magic_link_request_error';
    res.status(400).json({ error: msg });
  }
});

app.post('/api/ops/auth/magic-link/verify', async (req, res) => {
  const body = req.body as { token?: string };
  try {
    const session = await verifyInstitutionMagicLink(body.token ?? '');
    res.json(session);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'magic_link_verify_error';
    res.status(401).json({ error: msg });
  }
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

/** Pasarela VES — webhook con HMAC (`X-Agigov-Signature`). */
app.post('/api/public/payments/webhook', async (req, res) => {
  if (isPanicMode()) {
    res.status(503).json({ error: 'Sistema en FREEZE — pagos suspendidos' });
    return;
  }

  try {
    const origin = process.env.ORIGIN_NODE_ID?.trim() ?? 'node-mar-north-01';
    const withRaw = req as RequestWithRawBody;
    const rawBody = withRaw.rawBody ?? JSON.stringify(req.body ?? {});
    const result = await processVesPaymentWebhook(req.body, origin, {
      rawBody,
      signatureHeader:
        (req.header('X-Agigov-Signature') ?? req.header('x-agigov-signature')) || undefined,
    });
    res.status(result.ok ? 201 : 422).json(result);
  } catch (error) {
    if (error instanceof WebhookAuthError) {
      res.status(401).json({ error: error.message });
      return;
    }
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

/** IaaU metering + catálogo cobro P0/P1. */
app.get('/api/public/billing/usage', async (req, res) => {
  try {
    seedDemoMeteringIfEmpty();
    const jurisdictionId =
      typeof req.query.jurisdictionId === 'string' ? req.query.jurisdictionId : undefined;
    const period = typeof req.query.period === 'string' ? req.query.period : undefined;
    const summary = getUsageSummary(jurisdictionId, period);
    let reconciliation;
    try {
      reconciliation = await reconcileMeteringWithCheckpoints(getCoreDb(), {
        freezeOnFail: true,
      });
    } catch {
      reconciliation = reconcileMeteringWithLedger({ freezeOnFail: true });
    }
    const invoice = estimateIaauInvoiceUsd(jurisdictionId, period);
    const freeGuard = assertFreeCostZero();
    res.json({
      updatedAt: new Date().toISOString(),
      plan: resolvePlan(),
      summary,
      reconciliation,
      invoice,
      freeGuard: {
        ok: freeGuard.ok,
        violations: freeGuard.violations,
        caps: freeGuard.caps,
        hosting: freeGuard.hosting,
      },
      billingFreeze: getBillingFreeze(),
      disclaimer:
        resolvePlan() === 'free'
          ? 'Plan free — IaaU/EGS no facturables; BYO infra'
          : reconciliation.billable
            ? 'Estimación IaaU — conciliar antes de factura vinculante'
            : 'Facturación no billable (freeze o reconcile)',
    });
  } catch {
    res.status(500).json({ error: 'No se pudo cargar uso IaaU' });
  }
});

app.get('/api/public/billing/catalog', (_req, res) => {
  try {
    const catalog = buildChargeCatalog();
    const freeGuard = assertFreeCostZero();
    res.json({
      updatedAt: new Date().toISOString(),
      ...catalog,
      freeGuard,
      egsSplit: { reinversion: 0.7, meritPool: 0.2, agigovFee: 0.1 },
    });
  } catch {
    res.status(500).json({ error: 'No se pudo cargar catálogo de cobro' });
  }
});

app.post('/api/public/billing/egs-preview', (req, res) => {
  try {
    const body = req.body as {
      baselineTrimestral?: number;
      gastosVerificados?: number;
      ajustesFuerzaMayor?: number;
      currency?: string;
    };
    const baseline = Number(body.baselineTrimestral);
    const gastos = Number(body.gastosVerificados);
    if (!Number.isFinite(baseline) || !Number.isFinite(gastos)) {
      res.status(400).json({ error: 'baselineTrimestral y gastosVerificados requeridos' });
      return;
    }
    const invoice = computeEgsFeeInvoice({
      baselineTrimestral: baseline,
      gastosVerificados: gastos,
      ajustesFuerzaMayor: Number(body.ajustesFuerzaMayor) || 0,
      currency: body.currency,
      egsAddonEnabled: (process.env.AGIGOV_EGS_ADDON ?? '1').trim() !== '0',
    });
    res.json({
      updatedAt: new Date().toISOString(),
      plan: resolvePlan(),
      ...invoice,
    });
  } catch (e) {
    res.status(400).json({
      error: e instanceof Error ? e.message : 'EGS preview inválido',
    });
  }
});

/** Ops: levantar FREEZE de facturación tras auditoría humana. */
app.post('/api/ops/billing/unfreeze', (req, res) => {
  if (isPanicMode()) {
    res.status(503).json({ error: 'PANIC_MODE' });
    return;
  }
  const key = process.env.AGIGOV_OPS_API_KEY?.trim();
  if (key && req.header('X-Ops-Key') !== key) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  res.json({ ok: true, billingFreeze: clearBillingFreeze() });
});

/** P1: seats SaaS por tenant. */
app.get('/api/ops/tenants/:slug/seats', async (req, res) => {
  try {
    const seats = await getTenantSeats(getCoreDb(), req.params.slug);
    if (!seats) {
      res.status(404).json({ error: 'Tenant no encontrado' });
      return;
    }
    res.json({ updatedAt: new Date().toISOString(), ...seats });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : 'seats error' });
  }
});

app.post('/api/ops/tenants/:slug/seats/claim', async (req, res) => {
  if (isPanicMode()) {
    res.status(503).json({ error: 'PANIC_MODE' });
    return;
  }
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email : '';
    const seats = await claimTenantSeat(getCoreDb(), req.params.slug, email);
    res.json({ ok: true, ...seats });
  } catch (e) {
    res.status(400).json({ error: e instanceof Error ? e.message : 'claim inválido' });
  }
});

app.post('/api/ops/tenants/:slug/saas-plan', async (req, res) => {
  if (isPanicMode()) {
    res.status(503).json({ error: 'PANIC_MODE' });
    return;
  }
  const key = process.env.AGIGOV_OPS_API_KEY?.trim();
  if (key && req.header('X-Ops-Key') !== key) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    const plan = String(req.body?.plan ?? '') as AgigovPlan;
    if (!['free', 'saas', 'sovereign'].includes(plan)) {
      res.status(400).json({ error: 'plan debe ser free|saas|sovereign' });
      return;
    }
    const seatLimit =
      typeof req.body?.seatLimit === 'number' ? req.body.seatLimit : undefined;
    const seats = await setTenantSaasPlan(getCoreDb(), req.params.slug, plan, seatLimit);
    res.json({ ok: true, ...seats });
  } catch (e) {
    res.status(400).json({ error: e instanceof Error ? e.message : 'saas-plan inválido' });
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
      '/api/public/gov': { get: { summary: 'Jurisdicciones AGIGOV-[ISO] en red' } },
      '/api/public/federation/outbox': {
        get: { summary: 'Hashes published para peer mirror (P5)' },
      },
      '/api/public/federation/mirror': {
        post: { summary: 'Espejar outbox peer en inbox local' },
      },
      '/api/public/dashboard': { get: { summary: 'Telemetría gestión' } },
      '/api/public/projects': { get: { summary: 'Proyectos DAO' } },
      '/api/public/projects/{id}': { get: { summary: 'Detalle proyecto' } },
      '/api/public/proposals': { get: { summary: 'Propuestas' }, post: { summary: 'Enviar propuesta' } },
      '/api/public/contributions': { post: { summary: 'Aporte piloto VES' } },
      '/api/public/reports/irregularity': { post: { summary: 'Reporte centinela ciudadano' } },
      '/api/public/cne/consultation': { get: { summary: 'Consulta CNE-1' } },
      '/api/public/cne/vote': { post: { summary: 'Voto SET demo cifrado' } },
      '/api/public/billing/usage': {
        get: { summary: 'Uso IaaU + invoice + freeGuard + freeze + checkpoint reconcile P1' },
      },
      '/api/public/billing/catalog': { get: { summary: 'Catálogo cobro P0/P1 (seats SaaS)' } },
      '/api/public/billing/egs-preview': { post: { summary: 'Preview fee EGS 10% Δ' } },
      '/api/ops/tenants/{slug}/seats': { get: { summary: 'Cupo seats SaaS del tenant' } },
      '/api/ops/tenants/{slug}/seats/claim': { post: { summary: 'Claim seat operador' } },
      '/api/ops/tenants/{slug}/saas-plan': { post: { summary: 'Set plan SaaS del tenant (ops key)' } },
      '/api/public/data-trust/datasets': { get: { summary: 'Catálogo Data Trust k-anonymized' } },
      '/api/public/payments/webhook': {
        post: { summary: 'Webhook pasarela VES (HMAC X-Agigov-Signature)' },
      },
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

/** Configuración soberana del nodo — autoritativa para ledger; PWA puede sobreescribir display. */
app.get('/api/public/config', (_req, res) => {
  const cfg = buildPublicSovereignConfig();
  res.json({
    updatedAt: new Date().toISOString(),
    iso: cfg.iso,
    jurisdictionCode: cfg.jurisdictionCode,
    label: cfg.label,
    currency: cfg.currency,
    locale: cfg.locale,
    timezone: cfg.timezone,
    territoryCode: cfg.territoryCode,
    supportedJurisdictions: Object.values(JURISDICTIONS).map((j) => ({
      iso: j.iso,
      jurisdictionCode: j.jurisdictionCode,
      label: j.label,
      currency: j.currency,
      locale: j.locale,
      status: j.status,
    })),
    supportedLocales: [...SUPPORTED_LOCALES],
    supportedCurrencies: [...SUPPORTED_CURRENCIES],
    note:
      'Preferencia de usuario en PWA no altera ledger. Geo-hint solo sugiere COP en Colombia.',
  });
});

/** Defaults de piloto por país — sin secretos (PWA wizard). */
app.get('/api/public/pilot/defaults', (req, res) => {
  const isoRaw = typeof req.query.iso === 'string' ? req.query.iso : 'VEN';
  const profile = getPilotProfileForIso(isoRaw);
  const j = JURISDICTIONS[profile.iso];
  res.json({
    iso: profile.iso,
    jurisdictionCode: j?.jurisdictionCode ?? 'AGIGOV',
    currency: profile.currency,
    slug: profile.slug,
    ministryCode: profile.ministryCode,
    budgetCode: profile.budgetCode,
    displayName: profile.displayName,
    programName: profile.programName,
    territoryCode: profile.territoryCode,
    fiscalYear: 2026,
    quarter: 2,
  });
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
    node: NODE,
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
      node: NODE,
      peerUrl,
      postgres: true,
      panicMode: isPanicMode(),
    });

    res.json({
      updatedAt: new Date().toISOString(),
      crossHealthOk: health.crossHealthOk,
      cartaBase: 'docs/AGIGOV/CARTA-AGIGOV-BASE.md',
      jurisdictions: [
        {
          code: 'AGIGOV-VEN',
          iso: 'VEN',
          status: JURISDICTIONS.VEN.status,
          documentRef: JURISDICTIONS.VEN.documentRef,
          ratified: cartaBundle.cartaRatification === true,
          checkpointStatus: cartaCheckpoint?.status ?? 'missing',
        },
        {
          code: 'AGIGOV-COL',
          iso: 'COL',
          status: JURISDICTIONS.COL.status,
          documentRef: JURISDICTIONS.COL.documentRef,
          ratified: false,
          checkpointStatus: 'pilot-profile-only',
          currency: 'COP',
          note: 'Perfil UX + anexo; sin adhesión multi-sig aún',
        },
        {
          code: 'AGIGOV-USA',
          iso: 'USA',
          status: JURISDICTIONS.USA.status,
          documentRef: JURISDICTIONS.USA.documentRef,
          ratified: false,
          checkpointStatus: 'pilot-profile-only',
          currency: 'USD',
          note: 'Perfil UX; usar ANEXO-LOCAL-TEMPLATE',
        },
        {
          code: 'AGIGOV-SBX',
          iso: 'SBX',
          status: JURISDICTIONS.SBX.status,
          documentRef: JURISDICTIONS.SBX.documentRef,
          peerOf: SBX_PEER_JURISDICTION,
          adhesion: sbxBundle.sandboxAdhesion === true,
          checkpointStatus: sbxCheckpoint?.status ?? 'missing',
        },
      ],
      peer: health.peer,
      federationInboxCount: readFederationInbox().length,
    });
  } catch {
    res.status(500).json({ error: 'No se pudo cargar registro de gobiernos' });
  }
});

/** P5 — outbox de hashes published (interop thin, sin PII). */
app.get('/api/public/federation/outbox', async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const items = await listFederationOutbox(limit);
    res.json({
      updatedAt: new Date().toISOString(),
      jurisdiction: process.env.AGIGOV_JURISDICTION?.trim() || 'AGIGOV-VEN',
      count: items.length,
      items,
    });
  } catch {
    res.status(500).json({ error: 'No se pudo cargar federation outbox' });
  }
});

/** P5 — espejo local del outbox de un peer (SBX u otro). */
app.post('/api/public/federation/mirror', async (req, res) => {
  if (isPanicMode()) {
    res.status(503).json({ error: 'PANIC_MODE' });
    return;
  }
  try {
    const body = req.body as {
      sourceJurisdiction?: string;
      items?: Array<{
        processId: string;
        status: string;
        originNodeId: string;
        contentHash: string;
        updatedAt: string;
      }>;
    };
    const source = body.sourceJurisdiction?.trim() || 'AGIGOV-PEER';
    const items = Array.isArray(body.items) ? body.items : [];
    if (items.length === 0) {
      res.status(400).json({ error: 'items[] requerido' });
      return;
    }
    const written = mirrorFederationOutbox(items, source);
    res.status(201).json({
      ok: true,
      mirrored: written.length,
      inboxTotal: readFederationInbox().length,
      receipts: written,
    });
  } catch (e) {
    res.status(400).json({
      error: e instanceof Error ? e.message : 'mirror inválido',
    });
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
    plan: resolvePlan(),
    billingFreeze: getBillingFreeze(),
    checkedAt: new Date().toISOString(),
  });
});

/** Fase A — provisionar tenant desde wizard institucional (sandbox / ops local). */
app.post('/api/ops/tenants/provision', async (req, res) => {
  if (isPanicMode()) {
    res.status(503).json({ error: 'PANIC_MODE: provision suspendida' });
    return;
  }

  const body = req.body as {
    iso?: string;
    slug?: string;
    ministryCode?: string;
    budgetCode?: string;
    displayName?: string;
    programName?: string;
    territoryCode?: string;
    fiscalYear?: number;
    quarter?: number;
    annualBaseline?: number;
  };

  const iso = (body.iso?.trim() || 'VEN').toUpperCase();
  const profile = getPilotProfileForIso(iso);

  try {
    const result = await provisionPilotTenant({
      iso: profile.iso,
      slug: body.slug?.trim() || profile.slug,
      ministryCode: body.ministryCode?.trim() || profile.ministryCode,
      budgetCode: body.budgetCode?.trim() || profile.budgetCode,
      displayName: body.displayName?.trim() || profile.displayName,
      programName: body.programName?.trim() || profile.programName,
      territoryCode: body.territoryCode?.trim() || profile.territoryCode,
      fiscalYear: body.fiscalYear ?? 2026,
      quarter: body.quarter ?? 2,
      annualBaseline:
        typeof body.annualBaseline === 'number' && body.annualBaseline > 0
          ? body.annualBaseline
          : undefined,
    });

    res.status(201).json({
      slug: result.slug,
      ministryCode: result.ministryCode,
      budgetCode: result.budgetCode,
      currency: result.currency,
      firstEscrowRef: result.firstEscrowRef,
      consoleUrl: result.consoleUrl,
      ingestUrl: result.ingestUrl,
      healthUrl: result.healthUrl,
      ingestToken: result.ingestToken,
      credentialsPath: result.credentialsPath,
    });
  } catch (e) {
    res.status(500).json({
      error: e instanceof Error ? e.message : 'Error al provisionar tenant',
    });
  }
});

/** Fase A — tenants piloto (sin tokens; solo metadatos publicables). */
app.get('/api/ops/tenants', async (_req, res) => {
  try {
    const tenants = await listPilotTenants();
    res.json({
      tenants: tenants.map((t) => ({
        slug: t.slug,
        ministry: t.ministryCode,
        budgetCode: t.budgetCode,
        displayName: t.displayName,
        status: t.status,
        fiscalYear: t.fiscalYear,
        quarter: t.quarter,
        onboardingStatus: t.onboardingStatus,
        provisionedAt: t.createdAt.toISOString(),
      })),
      count: tenants.length,
    });
  } catch (e) {
    res.status(500).json({
      error: e instanceof Error ? e.message : 'No se pudo listar tenants piloto',
    });
  }
});

/** Fase A — ingest firmado por ministerio (Bearer token por tenant). */
app.post('/api/ops/ingest/:slug', async (req, res) => {
  if (isPanicMode()) {
    res.status(503).json({ error: 'PANIC_MODE: ingest suspendido' });
    return;
  }

  const slug = String(req.params.slug ?? '').trim();
  if (!slug) {
    res.status(400).json({ error: 'slug requerido' });
    return;
  }

  const auth = await authenticateTenantIngest(slug, req.headers.authorization);
  if (auth.ok === false) {
    const statusByReason: Record<string, number> = {
      missing_bearer: 401,
      invalid_token: 401,
      unknown_tenant: 404,
      tenant_not_active: 403,
      baseline_not_ratified: 403,
    };
    res.status(statusByReason[auth.reason] ?? 401).json({ error: auth.reason });
    return;
  }

  const body = req.body as { rows?: IngestRow[] };
  const rows = Array.isArray(body?.rows) ? body.rows : [];
  if (rows.length === 0) {
    res.status(400).json({ error: 'body.rows[] requerido (al menos una fila)' });
    return;
  }

  try {
    const db = getCoreDb();
    const result = await ingestPilotMilestones(db, slug, rows);
    res.json(result);
  } catch (e) {
    res.status(500).json({
      error: e instanceof Error ? e.message : 'Error en ingest piloto',
    });
  }
});

/** Fase B — estado onboarding institucional del tenant. */
app.get('/api/ops/tenants/:slug/onboarding', async (req, res) => {
  const slug = String(req.params.slug ?? '').trim();
  try {
    const status = await getTenantBaselineStatus(slug);
    if (!status) {
      res.status(404).json({ error: 'tenant_not_found' });
      return;
    }
    res.json(status);
  } catch (e) {
    res.status(500).json({
      error: e instanceof Error ? e.message : 'Error onboarding status',
    });
  }
});

/** Fase B — registro institucional + DID + baseline multi-sig. */
app.post('/api/ops/tenants/:slug/onboard', async (req, res) => {
  if (isPanicMode()) {
    res.status(503).json({ error: 'PANIC_MODE: onboard suspendido' });
    return;
  }
  const slug = String(req.params.slug ?? '').trim();
  try {
    const result = await onboardPilotTenant(slug);
    res.json(result);
  } catch (e) {
    res.status(500).json({
      error: e instanceof Error ? e.message : 'Error en onboard piloto',
    });
  }
});

/** Fase B — ratificar baseline con claves institucionales (DidRegistry). */
app.post('/api/ops/tenants/:slug/baseline/ratify', async (req, res) => {
  if (isPanicMode()) {
    res.status(503).json({ error: 'PANIC_MODE: ratify suspendido' });
    return;
  }
  const slug = String(req.params.slug ?? '').trim();
  try {
    const result = await ratifyPilotTenantBaseline(slug);

    const authReq = req as OpsAuthRequest;
    const sessionUser = authReq.institutionSession?.user;
    if (
      sessionUser?.email &&
      (result as { onboardingStatus?: string }).onboardingStatus === 'ingest_ready'
    ) {
      const status = await getTenantBaselineStatus(slug);
      const tenantRow = await getCoreDb().pilotTenant.findUnique({
        where: { slug },
        select: { budgetCode: true },
      });
      void sendBaselineReadyEmail({
        institutionName: sessionUser.institutionName,
        email: sessionUser.email,
        slug,
        ministryCode: status?.ministryCode ?? '—',
        budgetCode: tenantRow?.budgetCode ?? '—',
      }).catch((err) => {
        console.error('[email] baseline_ready failed:', err);
      });
    }

    res.json(result);
  } catch (e) {
    res.status(500).json({
      error: e instanceof Error ? e.message : 'Error ratificando baseline',
    });
  }
});

/** Fase C — centinela reconcilia y opcionalmente publica Q-close. */
app.post('/api/ops/tenants/:slug/q-close', async (req, res) => {
  if (isPanicMode()) {
    res.status(503).json({ error: 'PANIC_MODE: q-close suspendido' });
    return;
  }
  const slug = String(req.params.slug ?? '').trim();
  const publish = Boolean((req.body as { publish?: boolean })?.publish);
  try {
    const db = getCoreDb();
    const result = await runTenantQuarterClosePipeline(db, slug, { publish });
    res.status(result.ok ? 200 : 409).json(result);
  } catch (e) {
    res.status(500).json({
      error: e instanceof Error ? e.message : 'Error en Q-close',
    });
  }
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
