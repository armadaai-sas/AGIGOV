/**
 * Pass 2: Spanish UI leftovers (ALLOW/Ledger/Escrow/FREEZE…).
 * Only edits user-visible strings — never bare "dashboard" identifiers/paths.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function fix(rel, pairs) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) {
    console.log('missing', rel);
    return;
  }
  let t = fs.readFileSync(p, 'utf8');
  const before = t;
  for (const [a, b] of pairs) {
    t = typeof a === 'string' ? t.split(a).join(b) : t.replace(a, b);
  }
  if (t !== before) {
    fs.writeFileSync(p, t);
    console.log('updated', rel);
  }
}

fix('src/i18n/locales/es.ts', [
  ['Centinela, FREEZE, PQC', 'Centinela, congelación, PQC'],
  ['Centinela, FREEZE, registro', 'Centinela, congelación, registro'],
  ['hitos en escrow → gate centinela', 'hitos en custodia → filtro centinela'],
  ['IaaU, Data Trust y evidencia', 'IaaU, fideicomiso de datos y evidencia'],
  ['IaaU, Data Trust, evidencia', 'IaaU, fideicomiso de datos, evidencia'],
  ['contratos en escrow ·', 'contratos en custodia ·'],
  ['sin PII; gestión', 'sin datos personales; gestión'],
  ['electoral, escrow u otro', 'electoral, custodia u otro'],
  ['rastro · evidencia · gate ·', 'rastro · evidencia · filtro ·'],
  ['Entrada → evidencia → gate →', 'Entrada → evidencia → filtro →'],
]);

fix('src/citizen/pages/GlosarioPage.tsx', [
  ["term: 'Ledger'", "term: 'Registro'"],
  ["term: 'FREEZE'", "term: 'Congelación'"],
  ['FREEZE evita', 'la congelación evita'],
  ['hito de escrow', 'hito de custodia'],
  ['muestra escrow en', 'muestra custodia en'],
]);

fix('src/citizen/components/HeroCinematic.tsx', [["label: 'Ledger'", "label: 'Registro'"]]);
fix('src/citizen/hero/governanceNodes.ts', [["label: 'Ledger'", "label: 'Registro'"]]);
fix('src/citizen/components/PanicBanner.tsx', [['Sistema en FREEZE', 'Sistema congelado']]);
fix('src/citizen/components/PolicyComparator.tsx', [
  ['FREEZE activo (centinela)', 'Congelación activa (centinela)'],
]);
fix('src/citizen/components/CentinelaReportForm.tsx', [
  ["label: 'Escrow / fondos'", "label: 'Custodia / fondos'"],
]);
fix('src/citizen/components/LandingAcademia.tsx', [
  [
    'Ledger, propuesta, dictamen y escrow',
    'Registro, propuesta, dictamen y custodia',
  ],
]);
fix('src/citizen/components/LandingTelemetryPanel.tsx', [
  [
    "Registro: 'Ledger inmutable:",
    "Registro: 'Registro inmutable:",
  ],
]);
fix('src/citizen/components/institutional/TrustPackShotHint.tsx', [
  ['OK o FREEZE legible', 'OK o CONGELAR legible'],
]);
fix('src/citizen/pages/ContratosPage.tsx', [['Escrow por hitos', 'Custodia por hitos']]);
fix('src/citizen/pages/EgsContractDetailPage.tsx', [
  ['Escrow Institucional', 'Custodia institucional'],
]);
fix('src/citizen/components/AppBreadcrumbs.tsx', [
  ['Escrow · Contratos', 'Custodia · Contratos'],
]);
fix('src/citizen/platform/paletteItems.ts', [
  ["label: 'Escrow · Contratos'", "label: 'Custodia · Contratos'"],
  ['hitos centinela escrow', 'hitos centinela custodia'],
]);
fix('src/citizen/platform/navConfig.ts', [
  ['API · OpenAPI · integradores', 'API · especificación · integradores'],
  ['Escrow · cadena de custodia', 'Custodia · cadena de evidencia'],
  ["hint: 'Escrow ciudadano'", "hint: 'Custodia ciudadana'"],
]);
fix('src/citizen/pages/DevelopersPage.tsx', [
  [
    "desc: 'Webhook HMAC (pasarela pendiente — no es cobro bancario en prod)'",
    "desc: 'Aviso HTTP firmado HMAC (pasarela pendiente — no es cobro bancario en prod)'",
  ],
  ["desc: 'OpenAPI stub'", "desc: 'Especificación OpenAPI (stub)'"],
  ["desc: 'Propuesta ciudadana (sin PII)'", "desc: 'Propuesta ciudadana (sin datos personales)'"],
  ['OpenAPI stub\n', 'Especificación OpenAPI (stub)\n'],
  ['aporte ledger.', 'aporte al registro.'],
]);
fix('src/citizen/components/services/ServiceConnectionPanel.tsx', [
  ["label: 'Ledger / Postgres'", "label: 'Registro / Postgres'"],
]);
fix('src/citizen/components/models/EgsDeltaSimulator.tsx', [
  ['Baseline presupuestario', 'Línea base presupuestaria'],
  ['Fee EGS', 'Comisión EGS'],
]);
fix('src/citizen/hero/landingCopy.ts', [
  ['centinela FREEZE,', 'centinela congela,'],
  ['sin PII; gestión', 'sin datos personales; gestión'],
  ["LANDING_EXECUTION_TITLE = 'Pipeline institucional'", "LANDING_EXECUTION_TITLE = 'Flujo institucional'"],
]);
fix('src/citizen/hero/heroRouteCopy.ts', [
  ['dashboard publicable', 'panel publicable'],
  ["hint: 'Pipeline institucional'", "hint: 'Flujo institucional'"],
]);
fix('src/citizen/components/HeroPremium.tsx', [
  ['sin PII expuesta', 'sin datos personales expuestos'],
]);

fix('src/citizen/platform/agigovModels.ts', [
  [
    "flow: 'Baseline → ejecución → reconciliación → Cierre trimestral → reparto'",
    "flow: 'Línea base → ejecución → reconciliación → Cierre trimestral → reparto'",
  ],
  ['sin PII pública', 'sin datos personales públicos'],
  ['sin PII en registro', 'sin datos personales en el registro'],
  ['FREEZE centinela ante', 'Congelación centinela ante'],
  ["name: 'Escrow Institucional'", "name: 'Custodia institucional'"],
  ["shortName: 'Ledger'", "shortName: 'Registro'"],
  ['Dashboard público sin PII', 'Panel público sin datos personales'],
  ['Pipeline institucional auditable', 'Flujo institucional auditable'],
  ['(FREEZE)', '(congelación)'],
  ['Ledger entries +', 'Entradas del registro +'],
  ["name: 'Data Trust Partnership'", "name: 'Alianza de fideicomiso de datos'"],
  ["shortName: 'Data Trust'", "shortName: 'Fideicomiso'"],
  ['sin PII para decisiones', 'sin datos personales para decisiones'],
  ['Pipeline ETL de agregación', 'Flujo ETL de agregación'],
  ['OpenAPI para integradores', 'Especificación OpenAPI para integradores'],
  ['Escrow recibe', 'Custodia recibe'],
  ['Escrow LOCKED', 'Custodia BLOQUEADA'],
  ['Escrow acumula', 'Custodia acumula'],
  ["mechanism: 'Fee simbólico", "mechanism: 'Comisión simbólica"],
  ['incidente FREEZE', 'incidente de congelación'],
]);

console.log('pass2 done');
