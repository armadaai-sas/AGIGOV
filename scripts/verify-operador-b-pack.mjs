#!/usr/bin/env node
/**
 * Verifica Trust Pack Operador B (prueba-real-2).
 * No inventa PASS: solo comprueba archivos + veredicto en 05-informe.md.
 *
 * Usage: node scripts/verify-operador-b-pack.mjs
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pack = join(root, 'docs/commercial/case-studies/prueba-real-2');
const artifacts = join(pack, 'artifacts');
const informe = join(pack, '05-informe.md');

const REQUIRED = [
  '01-registro.png',
  '02-acceso.png',
  '03-piloto-slug.png',
  '04-modelo-egs.png',
  '05-baseline.png',
  '06-ingest.png',
  '07-centinela.png',
  '08-qclose.png',
  '09-tenant.png',
];

const missing = REQUIRED.filter((f) => !existsSync(join(artifacts, f)));
const present = REQUIRED.filter((f) => existsSync(join(artifacts, f)));
const sizes = Object.fromEntries(
  present.map((f) => {
    const s = statSync(join(artifacts, f));
    return [f, s.size];
  }),
);
const tiny = present.filter((f) => sizes[f] < 8_000);

let informeText = '';
let verdict = 'MISSING';
if (existsSync(informe)) {
  informeText = readFileSync(informe, 'utf8');
  const m = informeText.match(/\|\s*verdict\s*\|\s*\*{0,2}(PASS|FAIL|BLOCKED|PENDING)\*{0,2}/i);
  if (m) verdict = m[1].toUpperCase();
  else if (/veredicto:\s*(PASS|FAIL|BLOCKED)/i.test(informeText)) {
    verdict = informeText.match(/veredicto:\s*(PASS|FAIL|BLOCKED)/i)[1].toUpperCase();
  } else if (/\bPASS\b/.test(informeText) && !/\bPENDING\b/.test(informeText)) {
    verdict = 'PASS?';
  }
}

const packReady =
  missing.length === 0 &&
  tiny.length === 0 &&
  (verdict === 'PASS' || verdict === 'FAIL' || verdict === 'BLOCKED');

const g20 =
  missing.length === 0 && tiny.length === 0 && verdict === 'PASS'
    ? 'GO'
    : verdict === 'FAIL' || verdict === 'BLOCKED'
      ? 'NO-GO'
      : 'NO-GO (PENDING evidence)';

const out = {
  checkedAt: new Date().toISOString(),
  artifactsDir: artifacts,
  present: present.length,
  required: REQUIRED.length,
  missing,
  tinySuspectEmpty: tiny,
  informeVerdict: verdict,
  packScoreable: packReady,
  g20Gate: g20,
  otherFiles: readdirSync(artifacts).filter((f) => !f.startsWith('.') && f !== 'README.md'),
};

console.log(JSON.stringify(out, null, 2));
process.exit(g20 === 'GO' ? 0 : 2);
