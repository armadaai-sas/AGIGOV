/**
 * OS shell navigation audit — sidebar, palette, footer compact, institutional routes.
 * Run: node scripts/os-nav-audit.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const app = fs.readFileSync(path.join(root, 'src/citizen/CitizenApp.tsx'), 'utf8');
const nav = fs.readFileSync(path.join(root, 'src/citizen/platform/navConfig.ts'), 'utf8');
const palette = fs.readFileSync(path.join(root, 'src/citizen/platform/paletteItems.ts'), 'utf8');
const footer = fs.readFileSync(path.join(root, 'src/citizen/components/SiteFooterCompact.tsx'), 'utf8');
const inst = fs.readFileSync(path.join(root, 'src/citizen/platform/institutionalRoutes.ts'), 'utf8');

const routePaths = [...app.matchAll(/path="([^"]+)"/g)].map((m) => m[1]);

const INSTITUTION_ROUTES = Object.fromEntries(
  [...inst.matchAll(/(\w+):\s*'([^']+)'/g)].map((m) => [m[1], m[2]]),
);

function resolveExpr(expr) {
  let s = expr.trim();
  s = s.replace(/INSTITUTION_ROUTES\.(\w+)/g, (_, k) => INSTITUTION_ROUTES[k] ?? '');
  if ((s.startsWith("'") && s.endsWith("'")) || (s.startsWith('"') && s.endsWith('"'))) {
    return s.slice(1, -1);
  }
  return s;
}

function collectHrefs(src) {
  const out = new Set();
  for (const m of src.matchAll(/to:\s*'([^']+)'/g)) out.add(m[1]);
  for (const m of src.matchAll(/to:\s*"([^"]+)"/g)) out.add(m[1]);
  for (const m of src.matchAll(/to=\{?['"`]([^'"`]+)['"`]\}?/g)) out.add(m[1]);
  return [...out];
}

const hrefs = [...new Set([...collectHrefs(nav), ...collectHrefs(palette), ...collectHrefs(footer)])];

function routeExists(pathname) {
  if (pathname === '/' || pathname === '') return true;
  const clean = pathname.split('?')[0].replace(/\/$/, '') || '/';
  for (const r of routePaths) {
    if (r === '*') continue;
    const rx = new RegExp('^' + r.replace(/:[^/]+/g, '[^/]+').replace(/\*/g, '.*') + '$');
    if (rx.test(clean)) return true;
  }
  if (/^\/modelos\/[^/]+$/.test(clean)) return true;
  return false;
}

function hashExists(href) {
  const id = href.includes('#') ? href.split('#')[1]?.split('?')[0] : null;
  if (!id) return true;
  const files = [
    'src/citizen/pages/InstitutionalPage.tsx',
    'src/citizen/pages/HomePage.tsx',
  ];
  for (const rel of files) {
    try {
      if (fs.readFileSync(path.join(root, rel), 'utf8').includes(`id="${id}"`)) return true;
    } catch {
      /* skip */
    }
  }
  const landingDir = path.join(root, 'src/citizen/components/landing');
  if (fs.existsSync(landingDir)) {
    for (const f of fs.readdirSync(landingDir)) {
      if (!f.endsWith('.tsx')) continue;
      if (fs.readFileSync(path.join(landingDir, f), 'utf8').includes(`id="${id}"`)) return true;
    }
  }
  return false;
}

const issues = [];
const matrix = [];

for (const href of hrefs) {
  if (href.startsWith('http') || href.startsWith('mailto:')) {
    matrix.push({ href, verdict: 'PASS', reason: 'external' });
    continue;
  }
  const hashIdx = href.indexOf('#');
  if (hashIdx >= 0) {
    const base = href.slice(0, hashIdx) || '/';
    const hashPart = href.slice(hashIdx);
    if (base !== '/' && base !== '' && !routeExists(base.split('?')[0])) {
      issues.push({ type: 'no-route', href });
      matrix.push({ href, verdict: 'FAIL', reason: 'no-route' });
      continue;
    }
    if (!hashExists(href)) {
      issues.push({ type: 'hash-missing', href });
      matrix.push({ href, verdict: 'FAIL', reason: 'hash-missing' });
      continue;
    }
    matrix.push({ href, verdict: 'PASS', reason: 'hash-ok' });
    continue;
  }
  const pathname = href.split('?')[0];
  if (!routeExists(pathname)) {
    issues.push({ type: 'no-route', href });
    matrix.push({ href, verdict: 'FAIL', reason: 'no-route' });
  } else {
    matrix.push({ href, verdict: 'PASS', reason: 'route-ok' });
  }
}

console.log(JSON.stringify({ hrefCount: hrefs.length, fail: issues.length, issues, matrix }, null, 2));
if (issues.length) process.exitCode = 1;
