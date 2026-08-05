/**
 * P9 — Release GO pack: artifacts + Operador B preflight (CLI, not human Trust Pack).
 * Uso: npm run p9:go
 * Escribe dictamen en docs/commercial/case-studies/prueba-real-1/00-GO-DICTAMEN.md
 */
import 'dotenv/config';

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { INSTITUTION_ROUTES } from '../src/citizen/platform/institutionalRoutes.js';

function assert(name: string, cond: boolean): void {
  if (!cond) throw new Error(`P9 FAIL: ${name}`);
  console.log(`  ✓ ${name}`);
}

function pkgScripts(): Record<string, string> {
  const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8')) as {
    scripts?: Record<string, string>;
  };
  return pkg.scripts ?? {};
}

async function main(): Promise<void> {
  console.log('[P9] Release GO pack + Operador B preflight');

  const scripts = pkgScripts();
  const requiredScripts = [
    'audit:run',
    'doctor',
    'p8:verify',
    'api:public',
    'api:sandbox',
    'pilot:onboard',
    'pilot:baseline-ratify',
    'pilot:ingest-demo',
    'pilot:q-close',
  ];
  for (const s of requiredScripts) {
    assert(`script ${s}`, Boolean(scripts[s]));
  }

  assert('P7 runbook', existsSync('docs/P7-AUDIT-GATE.md'));
  assert('P8 runbook', existsSync('docs/P8-OPS-CI.md'));
  assert('P9 runbook', existsSync('docs/P9-RELEASE-GO.md'));
  assert('piloto real doc', existsSync('docs/PILOTO-PRUEBA-REAL.md'));
  assert('PLAN has P9', readFileSync('docs/AGIGOV/PLAN.md', 'utf8').includes('## P9'));

  assert('route register', INSTITUTION_ROUTES.register === '/institucional/registro');
  assert('route login', INSTITUTION_ROUTES.login === '/institucional/acceso');
  assert('route pilot', INSTITUTION_ROUTES.pilot === '/institucional/piloto');

  const appSrc = readFileSync('src/citizen/CitizenApp.tsx', 'utf8');
  assert('CitizenApp register route', appSrc.includes(INSTITUTION_ROUTES.register));
  assert('CitizenApp login route', appSrc.includes(INSTITUTION_ROUTES.login));
  assert('CitizenApp pilot route', appSrc.includes(INSTITUTION_ROUTES.pilot));

  const trustDir = join(process.cwd(), 'docs/commercial/case-studies/prueba-real-1');
  assert('Trust Pack dir', existsSync(trustDir));
  assert('Trust Pack informe', existsSync(join(trustDir, '05-informe.md')));
  assert('Trust Pack health snap', existsSync(join(trustDir, '04-centinela-ops-health.json')));
  assert('Trust Pack ingest', existsSync(join(trustDir, '02-ingest-result.json')));

  const residuals = [
    'IAP v2 ML-DSA/ML-KEM híbrido (piloto territorial)',
    'WireGuard / LoRaWAN RF / Lighthouse Slow 4G / soak 72h wall-clock',
    'Proveedor fiat real (HMAC webhook listo)',
    'Trust Pack Operador B humano firmado (screenshots UI)',
    'CI con Postgres service + p4:finance-e2e obligatorio',
  ];

  const checkedAt = new Date().toISOString();
  const dictamen = `# GO dictamen — P9 Release pack

**Generado:** \`${checkedAt}\`  
**Gate CLI:** \`npm run p9:go\` PASS  
**Predecesores:** P7 \`audit:run\` · P8 \`p8:verify\`

## Veredicto código

**GO-CONDICIONADO** para piloto #4 / Operador B.

| Capa | Estado |
|------|--------|
| Audit P0–P7 | Suite \`audit:run\` + doctor |
| Ops P8 | CI expandido + handshake vivo |
| Rutas institucionales | registro / acceso / piloto cableadas |
| Scripts desbloqueo A | onboard · baseline · ingest · q-close |
| Trust Pack carpeta | \`prueba-real-1/\` con evidencia previa |

## Cierre humano (sigue abierto)

1. Operador B ejecuta \`docs/PILOTO-PRUEBA-REAL.md\` sin fundador.
2. Completa Trust Pack (screenshots + \`05-informe.md\` actualizado).
3. Deploy health OK en nodo de staging/prod-light.

## Residuales post-GO (no bloquean código P9)

${residuals.map((r) => `- ${r}`).join('\n')}

## Comandos de verificación

\`\`\`bash
npm run doctor
npm run audit:run
npm run p8:verify
npm run p9:go
\`\`\`
`;

  mkdirSync(trustDir, { recursive: true });
  const outPath = join(trustDir, '00-GO-DICTAMEN.md');
  writeFileSync(outPath, dictamen, 'utf8');
  assert('dictamen escrito', existsSync(outPath));

  console.log(
    JSON.stringify(
      {
        verdict: 'GO-CONDICIONADO',
        dictamen: 'docs/commercial/case-studies/prueba-real-1/00-GO-DICTAMEN.md',
        residuals,
        routes: INSTITUTION_ROUTES,
      },
      null,
      2,
    ),
  );
  console.log('[P9] OK');
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
