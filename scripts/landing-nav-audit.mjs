/**
 * Full landing navigation crawl — every menu/footer/CTA target.
 * Run: node scripts/landing-nav-audit.mjs
 * Optional: LANDING_BASE=http://127.0.0.1:3010
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const app = fs.readFileSync(path.join(root, 'src/citizen/CitizenApp.tsx'), 'utf8');
const nav = fs.readFileSync(path.join(root, 'src/citizen/components/home/HomeHeroNav.tsx'), 'utf8');
const footer = fs.readFileSync(path.join(root, 'src/citizen/components/SiteFooter.tsx'), 'utf8');
const hero = fs.readFileSync(
  path.join(root, 'src/citizen/components/home/HomeHeroInteractiveStage.tsx'),
  'utf8',
);
const outcomes = fs.readFileSync(
  path.join(root, 'src/citizen/components/landing/LandingOutcomesSection.tsx'),
  'utf8',
);
const home = fs.readFileSync(path.join(root, 'src/citizen/pages/HomePage.tsx'), 'utf8');
const models = fs.readFileSync(path.join(root, 'src/citizen/platform/agigovModels.ts'), 'utf8');
const inst = fs.readFileSync(path.join(root, 'src/citizen/platform/institutionalRoutes.ts'), 'utf8');

const routePaths = [...app.matchAll(/path="([^"]+)"/g)].map((m) => m[1]);
const modelIds = [...models.matchAll(/id:\s*'([^']+)'/g)].map((m) => m[1]);

const INSTITUTION_ROUTES = Object.fromEntries(
  [...inst.matchAll(/(\w+):\s*'([^']+)'/g)].map((m) => [m[1], m[2]]),
);
const EGS_CONSOLE_PATH =
  [...models.matchAll(/EGS_CONSOLE_PATH\s*=\s*'([^']+)'/g)][0]?.[1] ?? '/modelos/egs/consola';
const EGS_MODEL_PATH =
  [...models.matchAll(/EGS_MODEL_PATH\s*=\s*'([^']+)'/g)][0]?.[1] ?? '/modelos/egs';

function resolveExpr(expr) {
  let s = expr.trim();
  s = s.replace(/INSTITUTION_ROUTES\.(\w+)/g, (_, k) => INSTITUTION_ROUTES[k] ?? '');
  s = s.replace(/EGS_CONSOLE_PATH/g, EGS_CONSOLE_PATH);
  s = s.replace(/EGS_MODEL_PATH/g, EGS_MODEL_PATH);
  if ((s.startsWith("'") && s.endsWith("'")) || (s.startsWith('`') && s.endsWith('`')) || (s.startsWith('"') && s.endsWith('"'))) {
    return s.slice(1, -1);
  }
  return s;
}

function collectHrefs(src) {
  const out = new Set();
  for (const m of src.matchAll(/to:\s*([^,\n}]+)/g)) {
    const v = resolveExpr(m[1]);
    if (v.startsWith('/') || v.startsWith('#') || v.startsWith('http')) out.add(v);
  }
  for (const m of src.matchAll(/to=\{?['"`]([^'"`]+)['"`]\}?/g)) out.add(m[1]);
  for (const m of src.matchAll(/href=\{?['"`]([^'"`]+)['"`]\}?/g)) out.add(m[1]);
  for (const m of src.matchAll(/to="([^"]+)"/g)) out.add(m[1]);
  for (const m of src.matchAll(/href="([^"]+)"/g)) out.add(m[1]);
  return [...out];
}

const hrefs = [
  ...new Set([
    ...collectHrefs(nav),
    ...collectHrefs(footer),
    ...collectHrefs(hero),
    ...collectHrefs(outcomes),
  ]),
];

function routeExists(pathname) {
  if (pathname === '/' || pathname === '') return true;
  const clean = pathname.split('?')[0].replace(/\/$/, '') || '/';
  for (const r of routePaths) {
    if (r === '*') continue;
    const rx = new RegExp('^' + r.replace(/:[^/]+/g, '[^/]+').replace(/\*/g, '.*') + '$');
    if (rx.test(clean)) return true;
  }
  const mm = clean.match(/^\/modelos\/([^/]+)$/);
  if (mm && modelIds.includes(mm[1])) return true;
  if (clean === '/modelos/egs/consola') return true;
  return false;
}

const BASE = process.env.LANDING_BASE || 'http://127.0.0.1:3010';
const issues = [];
const ok = [];
const matrix = [];

const homeIdsNeeded = new Set();
for (const h of hrefs) {
  if (h.startsWith('/#')) homeIdsNeeded.add(h.slice(2).split('?')[0]);
  if (h.startsWith('#')) homeIdsNeeded.add(h.slice(1).split('?')[0]);
  const hashMatch = h.match(/#([a-z0-9_-]+)/i);
  if (hashMatch && (h.startsWith('/?') || h.startsWith('/#'))) homeIdsNeeded.add(hashMatch[1]);
}

for (const id of homeIdsNeeded) {
  const inSource =
    home.includes(`id="${id}"`) ||
    fs
      .readdirSync(path.join(root, 'src/citizen/components'), { recursive: true })
      .some((f) => {
        if (!String(f).endsWith('.tsx')) return false;
        const p = path.join(root, 'src/citizen/components', f);
        try {
          return fs.readFileSync(p, 'utf8').includes(`id="${id}"`);
        } catch {
          return false;
        }
      });
  if (!inSource) {
    issues.push({ type: 'hash-missing', href: `/#${id}` });
    matrix.push({ href: `/#${id}`, verdict: 'FAIL', reason: 'hash-missing' });
  } else {
    ok.push(`hash:#${id}`);
    matrix.push({ href: `/#${id}`, verdict: 'PASS', reason: 'hash-in-source' });
  }
}

for (const href of hrefs) {
  if (href.startsWith('http') || href.startsWith('mailto:')) {
    ok.push(`external:${href}`);
    matrix.push({ href, verdict: 'PASS', reason: 'external' });
    continue;
  }
  if (href.startsWith('#') || href.startsWith('/#')) continue;

  const url = new URL(href, 'http://local');
  const pathname = url.pathname;
  if (!routeExists(pathname)) {
    issues.push({ type: 'no-route', href });
    matrix.push({ href, verdict: 'FAIL', reason: 'no-route' });
    continue;
  }

  try {
    const res = await fetch(BASE + pathname + url.search, { redirect: 'follow' });
    if (!res.ok) {
      issues.push({ type: 'http', href, status: res.status });
      matrix.push({ href, verdict: 'FAIL', reason: `http-${res.status}` });
    } else {
      ok.push(`route:${pathname}${url.search}`);
      matrix.push({ href, verdict: 'PASS', reason: `http-${res.status}` });
    }
  } catch (e) {
    issues.push({ type: 'fetch', href, detail: String(e) });
    matrix.push({ href, verdict: 'FAIL', reason: String(e) });
  }
}

const summary = {
  base: BASE,
  hrefCount: hrefs.length,
  ok: ok.length,
  fail: issues.length,
  issues,
  matrix,
};
console.log(JSON.stringify(summary, null, 2));
if (issues.length) process.exitCode = 1;
