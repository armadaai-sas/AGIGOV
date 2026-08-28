/**
 * Second-pass ES copy: wipe remaining EN UI tokens (ALLOW, Ledger, Escrow…).
 * Keep product nouns: kernel, Centinela, EGS, API, GitHub, Ed25519, PQC.
 * FREEZE stays as product name only in glossary; UI statuses use Spanish.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const pairs = [
  [/ALLOW · evidencia sostiene/g, 'PERMITIR · la evidencia sostiene'],
  [/Centinela ALLOW/g, 'Centinela PERMITIR'],
  [/'ALLOW'/g, "'PERMITIR'"],
  [/→ FREEZE/g, '→ CONGELAR'],
  [/FREEZE · humano decide/g, 'CONGELAR · humano decide'],
  [/puede FREEZE;/g, 'puede congelar;'],
  [/Centinela y FREEZE/g, 'Centinela y congelación'],
  [/Kernel · Centinela · FREEZE/g, 'Kernel · Centinela · congelación'],
  [/FREEZE de Centinela/g, 'congelación de Centinela'],
  [/ledger y FREEZE/g, 'registro y congelación'],
  [/Centinela \/ FREEZE/g, 'Centinela / congelación'],
  [/'metric': 'FREEZE'/g, "'metric': 'CONGELAR'"],
  [/congelar \(FREEZE\)/g, 'congelar'],
  [/el FREEZE\./g, 'la congelación.'],
  [/· FREEZE/g, '· congelación'],
  [/FREEZE;/g, 'congelar;'],
  [/'PANIC'/g, "'ALERTA'"],
  [/'SYNC'/g, "'SINC.'"],
  [/Ledger público/g, 'Registro público'],
  [/ledger público/g, 'registro público'],
  [/al ledger/g, 'al registro'],
  [/en ledger/g, 'en el registro'],
  [/el ledger/g, 'el registro'],
  [/hashes en ledger/g, 'hashes en el registro'],
  [/Ledger inmutable/g, 'Registro inmutable'],
  [/ledger,/g, 'registro,'],
  [/Escrow inteligente/g, 'Custodia inteligente'],
  [/Escrow institucional/g, 'Custodia institucional'],
  [/Escrow e hitos/g, 'Custodia e hitos'],
  [/'Escrow'/g, "'Custodia'"],
  [/escrow,/g, 'custodia,'],
  [/Baseline firmada/g, 'Línea base firmada'],
  [/Baseline vs/g, 'Línea base vs'],
  [/Cloud o Local/g, 'Nube o local'],
  [/Cloud —/g, 'Nube —'],
  [/'Cloud'/g, "'Nube'"],
  [/Despliegue Cloud/g, 'Despliegue en la nube'],
  // Never replace bare "dashboard" — it breaks i18n keys and API paths.
  [/Success fee/g, 'Comisión de éxito'],
  [/Smart Escrow/g, 'Custodia inteligente'],
  [/fee AGIGOV/g, 'comisión AGIGOV'],
  [/Fee AGIGOV/g, 'Comisión AGIGOV'],
  [/fee simbólico/g, 'comisión simbólica'],
  [/Fee por/g, 'Comisión por'],
  [/fee por/g, 'comisión por'],
  [/sin fee si/g, 'sin comisión si'],
  [/success fee fiscal/g, 'comisión de éxito fiscal'],
  [/Micro-fee/g, 'Microcomisión'],
];

function transform(text) {
  let out = text;
  for (const [re, to] of pairs) out = out.replace(re, to);
  return out;
}

const files = [
  'src/i18n/locales/es.ts',
  'src/citizen/platform/agigovModels.ts',
  'src/citizen/components/landing/LandingAuthoritySection.tsx',
  'src/citizen/components/egs/MinistryHealthPanel.tsx',
  'src/citizen/components/models/EgsDeltaSimulator.tsx',
  'src/citizen/components/HeroPremium.tsx',
  'src/citizen/components/hero/HeroProductReveal.tsx',
  'src/citizen/components/HeroCinematic.tsx',
  'src/citizen/components/LandingAcademia.tsx',
  'src/citizen/components/PilotStatusSection.tsx',
  'src/citizen/components/AppBreadcrumbs.tsx',
  'src/citizen/components/institutional/TrustPackShotHint.tsx',
  'src/citizen/components/institutional/InstitutionPilotWizard.tsx',
  'src/citizen/components/egs/EgsConsoleToolbar.tsx',
  'src/citizen/components/services/ServiceConnectionPanel.tsx',
  'src/citizen/pages/DevelopersPage.tsx',
  'src/citizen/pages/DashboardPage.tsx',
  'src/citizen/pages/ContratosPage.tsx',
  'src/citizen/pages/EgsContractDetailPage.tsx',
  'src/citizen/pages/GlosarioPage.tsx',
  'src/citizen/platform/navConfig.ts',
  'src/citizen/platform/paletteItems.ts',
  'src/citizen/platform/implementations.ts',
  'src/citizen/hero/landingCopy.ts',
];

let n = 0;
for (const rel of files) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) continue;
  const before = fs.readFileSync(p, 'utf8');
  const after = transform(before);
  if (after !== before) {
    fs.writeFileSync(p, after);
    n += 1;
    console.log('updated', rel);
  }
}
console.log('files_changed', n);
