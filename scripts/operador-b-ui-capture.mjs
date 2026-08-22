#!/usr/bin/env node
/**
 * Operador B UI capture against live do-prod-light (Playwright).
 * Runs in GitHub Actions — not on the founder PC.
 *
 * Env:
 *   AGIGOV_LIVE_URL  default http://137.184.66.163
 *   ARTIFACTS_DIR    default docs/commercial/case-studies/prueba-real-2/artifacts
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = (process.env.AGIGOV_LIVE_URL ?? 'http://137.184.66.163').replace(/\/$/, '');
const ARTIFACTS = process.env.ARTIFACTS_DIR
  ? join(root, process.env.ARTIFACTS_DIR)
  : join(root, 'docs/commercial/case-studies/prueba-real-2/artifacts');
const INFORME = join(root, 'docs/commercial/case-studies/prueba-real-2/05-informe.md');

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const email = `opb-ci-${Date.now()}@agigov-test.local`;
const password = 'ProbePass123!';
const startedAt = new Date().toISOString();

mkdirSync(ARTIFACTS, { recursive: true });

async function shot(page, name) {
  const path = join(ARTIFACTS, name);
  await page.screenshot({ path, fullPage: false });
  console.log(`shot ${name}`);
}

async function clickRole(page, name, opts = {}) {
  await page.getByRole('button', { name, ...opts }).first().click({ timeout: 60_000 });
}

/** Tour modal blocks clicks after first escritorio visit. */
async function dismissOnboarding(page) {
  const dialog = page.locator('[role="dialog"].agigov-onboarding, .agigov-onboarding[role="dialog"]');
  if (await dialog.count() === 0) return;
  const skip = page.locator('button.agigov-onboarding-skip');
  if (await skip.count()) {
    await skip.first().click({ timeout: 5_000 }).catch(() => undefined);
  } else {
    await page.getByRole('button', { name: /^Cerrar$/i }).first().click({ timeout: 5_000 }).catch(() => undefined);
  }
  await dialog.waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => undefined);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    locale: 'es-CO',
  });
  const page = await context.newPage();
  page.setDefaultTimeout(60_000);

  try {
    // B1 — registro
    await page.goto(`${BASE}/institucional/registro`, { waitUntil: 'networkidle' });
    await dismissOnboarding(page);
    await page.getByRole('combobox', { name: /Región/i }).selectOption('ANT');
    await page.getByRole('combobox', { name: /Entidad/i }).selectOption('col-alc-medellin');
    await page.getByRole('textbox', { name: /Correo institucional/i }).fill(email);
    await page.getByRole('textbox', { name: /Número \(sin código/i }).fill('3001112233');
    await page.getByRole('textbox', { name: /Contacto institucional/i }).fill('Operador B CI');
    await page.getByRole('textbox', { name: /Cargo/i }).fill('Director Finanzas');
    await page.getByRole('textbox', { name: /^Contraseña$/i }).fill(password);
    await page.getByRole('textbox', { name: /Confirmar contraseña/i }).fill(password);
    const confirm = page.getByRole('checkbox', { name: /Confirmo que es una solicitud/i });
    if (!(await confirm.isChecked())) await confirm.check({ force: true });
    await dismissOnboarding(page);
    await clickRole(page, /Crear cuenta e ir al escritorio/i);
    await page.waitForURL(/\/escritorio/, { timeout: 90_000 });
    await dismissOnboarding(page);
    await page.getByRole('button', { name: /Cerrar sesión/i }).waitFor({ timeout: 30_000 });
    await shot(page, '01-registro.png');

    // B2 — logout → login
    await dismissOnboarding(page);
    await page.getByRole('button', { name: /Cerrar sesión/i }).click();
    await page.goto(`${BASE}/institucional/acceso`, { waitUntil: 'networkidle' });
    await dismissOnboarding(page);
    await page.locator('input[type="email"], input[name="email"]').first().fill(email);
    await page.locator('input[type="password"]').first().fill(password);
    await clickRole(page, /Entrar al escritorio/i);
    await page.waitForURL(/\/escritorio/, { timeout: 60_000 });
    await dismissOnboarding(page);
    await page.getByRole('button', { name: /Cerrar sesión/i }).waitFor({ timeout: 30_000 });
    await shot(page, '02-acceso.png');

    // B3 — piloto provision (unique slug + ministry/budget — DB unique on ministry+budget)
    await page.goto(`${BASE}/institucional/piloto`, { waitUntil: 'networkidle' });
    await dismissOnboarding(page);
    const runId = String(Date.now());
    const uniqueSlug = `opb-ci-${runId}`.slice(0, 48);
    const uniqueMinistry = `OPB${runId.slice(-6)}`.toUpperCase();
    const uniqueBudget = `B-${runId.slice(-8)}`;
    await page.getByRole('textbox', { name: /Código ministerio/i }).fill(uniqueMinistry);
    await page.getByRole('textbox', { name: /Código rubro|rubro presupuestario/i }).fill(uniqueBudget);
    const slugInput = page.getByRole('textbox', { name: /Slug del tenant/i });
    await slugInput.waitFor({ timeout: 30_000 });
    await slugInput.fill(uniqueSlug);
    const provisionBtn = page.getByRole('button', { name: /Crear tenant sandbox/i });
    await provisionBtn.waitFor({ state: 'visible', timeout: 30_000 });
    const provisionWait = page.waitForResponse(
      (r) => r.url().includes('/api/ops/tenants/provision') && r.request().method() === 'POST',
      { timeout: 90_000 },
    );
    await provisionBtn.click();
    const provisionRes = await provisionWait;
    if (!provisionRes.ok()) {
      const body = await provisionRes.text().catch(() => '');
      await shot(page, '03-piloto-fail.png');
      throw new Error(`provision HTTP ${provisionRes.status()}: ${body.slice(0, 500)}`);
    }
    await page.getByTestId('pilot-slug-banner').or(page.getByText(/Tenant:/i)).waitFor({
      timeout: 30_000,
    });
    await shot(page, '03-piloto-slug.png');
    await clickRole(page, /^Continuar$/i);

    // B4 — modelo EGS
    await page.getByText(/Efficiency Gain Share \(EGS\)/i).waitFor({ timeout: 30_000 });
    await shot(page, '04-modelo-egs.png');
    await clickRole(page, /^Continuar$/i);

    // B5 — baseline
    await page.getByRole('button', { name: /Registrar institución/i }).click();
    await page.getByText(/baseline_pending|ingest_ready|onboarding/i).first().waitFor({ timeout: 90_000 }).catch(() => {});
    await page.waitForTimeout(1500);
    await page.getByRole('button', { name: /Ratificar baseline/i }).click();
    await page.getByText(/ingest_ready/i).waitFor({ timeout: 90_000 });
    await shot(page, '05-baseline.png');
    await clickRole(page, /^Continuar$/i);

    // B6 — ingest
    await page.getByRole('button', { name: /Enviar 3 hitos demo/i }).click();
    await page.getByText(/Accepted|Aceptad/i).waitFor({ timeout: 90_000 });
    await shot(page, '06-ingest.png');
    await clickRole(page, /^Continuar$/i);

    // B7 — centinela / reconcile
    await page.getByText(/Centinela|Quarter status|Estado del trimestre|reconcile/i).first().waitFor({ timeout: 60_000 });
    await page.waitForTimeout(2000);
    await shot(page, '07-centinela.png');
    await clickRole(page, /^Continuar$/i);

    // B8 — q-close
    await page.getByRole('button', { name: /Publicar Q-close/i }).click();
    await page.getByText(/Publicado|published/i).first().waitFor({ timeout: 90_000 });
    await shot(page, '08-qclose.png');
    await clickRole(page, /^Continuar$/i);

    // B9 — tenant dashboard / consola
    await page.waitForTimeout(1500);
    const consoleLink = page.getByRole('link', { name: /Consola EGS/i }).first();
    if (await consoleLink.count()) {
      await consoleLink.click();
      await page.waitForLoadState('networkidle');
    }
    await shot(page, '09-tenant.png');

    const endedAt = new Date().toISOString();
    writeFileSync(
      INFORME,
      `# Informe Operador B — prueba-real-2

| field | value |
|-------|-------|
| startedAt | ${startedAt} |
| endedAt | ${endedAt} |
| environment | do-prod-light · ${BASE} |
| actor | GitHub Actions Playwright (Operador B surrogate) |
| B solo | sí (sin fundador mid-run) |
| email | ${email} |
| stamp | ${stamp} |
| verdict | **PASS** |

## Pasos

| # | Evidencia |
|---|-----------|
| 1 Registro | \`artifacts/01-registro.png\` |
| 2 Acceso | \`artifacts/02-acceso.png\` |
| 3 Piloto slug | \`artifacts/03-piloto-slug.png\` |
| 4 Modelo EGS | \`artifacts/04-modelo-egs.png\` |
| 5 Baseline | \`artifacts/05-baseline.png\` |
| 6 Ingest ×3 | \`artifacts/06-ingest.png\` |
| 7 Centinela | \`artifacts/07-centinela.png\` |
| 8 Q-close | \`artifacts/08-qclose.png\` |
| 9 Tenant | \`artifacts/09-tenant.png\` |

Corrida UI live vía CI. Backend previamente verificado en \`11-API-PROBE.md\`.
`,
      'utf8',
    );
    console.log(JSON.stringify({ ok: true, email, startedAt, endedAt, artifacts: ARTIFACTS }));
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
