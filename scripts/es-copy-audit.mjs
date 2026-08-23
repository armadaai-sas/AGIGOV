/**
 * Spanish copy audit: replace EN jargon / mixed copy in live ES surfaces.
 * Keep product nouns: kernel, Centinela, FREEZE, EGS, API, GitHub, Ed25519…
 * Run: node scripts/es-copy-audit.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const pairs = [
  [/human-in-the-loop/gi, 'decisión humana'],
  [/multi-sig/gi, 'multifirma'],
  [/multisig/gi, 'multifirma'],
  [/Self-serve/g, 'Autoservicio'],
  [/self-serve/g, 'autoservicio'],
  [/Abrir sandbox/g, 'Abrir entorno de prueba'],
  [/abrir sandbox/g, 'abrir entorno de prueba'],
  [/Sandbox institucional/g, 'Entorno de prueba institucional'],
  [/Sandbox =/g, 'Entorno de prueba ='],
  [/Sandbox o /g, 'Entorno de prueba o '],
  [/Sandbox público/g, 'Entorno de prueba público'],
  [/Sandbox en vivo/g, 'Entorno de prueba en vivo'],
  [/en sandbox/gi, 'en el entorno de prueba'],
  [/el sandbox/gi, 'el entorno de prueba'],
  [/un sandbox/gi, 'un entorno de prueba'],
  [/sandbox fiscal/gi, 'entorno de prueba fiscal'],
  [/'Sandbox'/g, "'Entorno de prueba'"],
  [/· Sandbox/g, '· Entorno de prueba'],
  [/Trust Pack/g, 'Paquete de confianza'],
  [/Wizard /g, 'Asistente '],
  [/Baseline multifirma/g, 'Línea base multifirma'],
  [/baseline multifirma/g, 'línea base multifirma'],
  [/Baseline trimestral/g, 'Línea base trimestral'],
  [/baseline trimestral/g, 'línea base trimestral'],
  [/Q-close/g, 'cierre trimestral'],
  [/Q-Close/g, 'Cierre trimestral'],
  [/fee solo/gi, 'comisión solo'],
  [/Fee solo/g, 'Comisión solo'],
  [/Fee AGIGOV/g, 'Comisión AGIGOV'],
  [/fee del operador/gi, 'comisión del operador'],
  [/tenant gratis/gi, 'cuenta gratis'],
  [/creas el tenant/gi, 'creas la cuenta'],
  [/creas un tenant/gi, 'creas una cuenta'],
  [/Slug tenant/g, 'Identificador de cuenta'],
  [/abre un tenant/gi, 'abre una cuenta'],
  [/Reconcile centinela/g, 'Reconciliación Centinela'],
  [/reconcile o /gi, 'reconciliar o '],
  [/OpenAPI pública/g, 'API pública (OpenAPI)'],
  [/Webhook a /g, 'Aviso automático a '],
  [/Registro · tenant/g, 'Registro · cuenta'],
];

function transform(text) {
  let out = text;
  for (const [re, to] of pairs) out = out.replace(re, to);
  out = out.replace(/entorno de prueba entorno de prueba/gi, 'entorno de prueba');
  out = out.replace(/multifirma multifirma/gi, 'multifirma');
  return out;
}

const files = [
  'src/i18n/locales/es.ts',
  'src/citizen/platform/agigovModels.ts',
  'src/citizen/pages/GlosarioPage.tsx',
  'src/citizen/pages/DevelopersPage.tsx',
  'src/citizen/pages/InstitutionalPage.tsx',
  'src/citizen/pages/ModelDetailPage.tsx',
  'src/citizen/pages/EscritorioPage.tsx',
  'src/citizen/pages/TransparenciaPage.tsx',
  'src/citizen/pages/CnePage.tsx',
  'src/citizen/pages/EgsVialConsolePage.tsx',
  'src/citizen/pages/ProjectsPage.tsx',
  'src/citizen/pages/ProjectDetailPage.tsx',
  'src/citizen/content/helpTutorials.ts',
  'src/citizen/platform/navConfig.ts',
  'src/citizen/components/LandingActionDock.tsx',
  'src/citizen/components/HeroCinematic.tsx',
  'src/citizen/components/HeroAccessPaths.tsx',
  'src/citizen/components/LandingAcademia.tsx',
  'src/citizen/components/PilotStatusSection.tsx',
  'src/citizen/components/SiteHeader.tsx',
  'src/citizen/components/PanicBanner.tsx',
  'src/citizen/components/PolicyComparator.tsx',
  'src/citizen/components/DataConnectionState.tsx',
  'src/citizen/components/NetworkBanner.tsx',
  'src/citizen/components/models/EgsDeltaSimulator.tsx',
  'src/citizen/components/landing/LandingAuthoritySection.tsx',
  'src/citizen/components/institutional/TrustPackShotHint.tsx',
  'src/citizen/components/institutional/InstitutionPilotSteps.tsx',
  'src/citizen/components/institutional/InstitutionProfileStep.tsx',
  'src/citizen/pages/InstitutionRegisterPage.tsx',
  'src/citizen/pages/InstitutionAccessPage.tsx',
  'src/citizen/hero/landingCopy.ts',
  'src/citizen/hero/heroRouteCopy.ts',
  'docs/CTA-MATRIX.md',
];

let changed = 0;
for (const rel of files) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) {
    console.log('skip missing', rel);
    continue;
  }
  const before = fs.readFileSync(p, 'utf8');
  const after = transform(before);
  if (after !== before) {
    fs.writeFileSync(p, after);
    changed += 1;
    console.log('updated', rel);
  }
}
console.log('files_changed', changed);
