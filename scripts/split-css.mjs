import fs from 'node:fs';

const src = fs.readFileSync('src/index.css', 'utf8');
const lines = src.split(/\n/);

function extractBlock(startPattern) {
  const start = lines.findIndex((l) => l.startsWith(startPattern));
  if (start < 0) throw new Error('missing ' + startPattern);
  let depth = 0;
  let started = false;
  for (let i = start; i < lines.length; i++) {
    for (const ch of lines[i]) {
      if (ch === '{') {
        depth++;
        started = true;
      }
      if (ch === '}') {
        depth--;
        if (started && depth === 0) {
          return { start, end: i, text: lines.slice(start, i + 1).join('\n') };
        }
      }
    }
  }
  throw new Error('unclosed ' + startPattern);
}

const theme = extractBlock('@theme');
const base = extractBlock('@layer base');
const compStart = lines.findIndex((l) => l.startsWith('@layer components'));
const body = lines.slice(compStart + 1, lines.length - 1).join('\n');

/** @type {{sel:string, body:string}[]} */
const rules = [];
let i = 0;
while (i < body.length) {
  while (i < body.length && /\s/.test(body[i])) i++;
  if (i >= body.length) break;
  if (body.startsWith('/*', i)) {
    const end = body.indexOf('*/', i + 2);
    i = end < 0 ? body.length : end + 2;
    continue;
  }
  const selStart = i;
  let inStr = null;
  let foundBrace = false;
  for (; i < body.length; i++) {
    const c = body[i];
    if (inStr) {
      if (c === inStr && body[i - 1] !== '\\') inStr = null;
      continue;
    }
    if (c === '"' || c === "'") {
      inStr = c;
      continue;
    }
    if (c === '{') {
      foundBrace = true;
      break;
    }
  }
  if (!foundBrace) break;
  const sel = body.slice(selStart, i).trim();
  const blockStart = i;
  let depth = 0;
  inStr = null;
  for (; i < body.length; i++) {
    const c = body[i];
    if (inStr) {
      if (c === inStr && body[i - 1] !== '\\') inStr = null;
      continue;
    }
    if (c === '"' || c === "'") {
      inStr = c;
      continue;
    }
    if (c === '{') depth++;
    if (c === '}') {
      depth--;
      if (depth === 0) {
        i++;
        break;
      }
    }
  }
  rules.push({ sel, body: body.slice(blockStart, i) });
}

function classify(sel) {
  const s = sel.replace(/\s+/g, ' ');
  if (/hero-film|hero-premium|hero-constellation|hero-backdrop|\.hero-node\b|@keyframes hero-film/.test(s)) {
    return 'archive';
  }
  if (
    /landing-|hero-cinematic|hero-landing|hero-brand|hero-trust-|home-hero|landing-snap|landing-manifest|landing-display|hero-console-cinematic|hero-console-slot|hero-console|hero-metric|hero-cta|hero-scroll|hero-progress|hero-mobile|hero-route|hero-demo/.test(
      s,
    )
  ) {
    return 'landing';
  }
  if (/^@keyframes/.test(s) && /landing|cinematic|hero-brand|console|trust|progress/.test(s)) {
    return 'landing';
  }
  if (/agigov-/.test(s) || /\[data-agigov/.test(s)) return 'shared';
  return 'app';
}

const buckets = { landing: [], app: [], archive: [], shared: [] };
for (const r of rules) buckets[classify(r.sel)].push(r);

for (const [k, v] of Object.entries(buckets)) {
  const bytes = v.reduce((n, r) => n + r.sel.length + r.body.length, 0);
  console.log(k, v.length, 'rules', Math.round(bytes / 1024) + 'KB');
}

fs.mkdirSync('src/styles', { recursive: true });

const themeAndBase = `${theme.text}\n\n${base.text}\n`;
const fmt = (arr) => arr.map((r) => `${r.sel} ${r.body}`).join('\n\n');

const baseCss = `/* Critical theme + preflight — every route */
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "../citizen/theme/trust-light.css";
@import "../citizen/theme/hero-trust.css";

${themeAndBase}

@layer components {
${fmt(buckets.shared)}
}
`;

const landingCss = `/* Landing utilities + cinematic hero — HomePage only */
@import "tailwindcss/utilities.css" layer(utilities);

@source "../citizen/pages/HomePage.tsx";
@source "../citizen/components/home/**/*.{tsx,ts}";
@source "../citizen/components/landing/**/*.{tsx,ts}";
@source "../citizen/components/hero/**/*.{tsx,ts}";
@source "../citizen/components/AgigovLogo.tsx";
@source "../citizen/components/FloatingLandingNav.tsx";
@source "../citizen/hero/**/*.{tsx,ts}";
@source "../citizen/context/PlatformContext.tsx";

@layer components {
${fmt(buckets.landing)}
}
`;

const appCss = `/* App chrome — deferred until leaving '/' */
@import "tailwindcss/utilities.css" layer(utilities);

@source "../citizen/**/*.{tsx,ts}";
@source not "../citizen/pages/HomePage.tsx";
@source not "../citizen/components/home/**";
@source not "../citizen/components/landing/**";

@layer components {
${fmt(buckets.app)}
}
`;

const archiveCss = `/* Unused film/premium hero styles */
@layer components {
${fmt(buckets.archive)}
}
`;

fs.writeFileSync('src/styles/base.css', baseCss);
fs.writeFileSync('src/styles/landing.css', landingCss);
fs.writeFileSync('src/styles/app.css', appCss);
fs.writeFileSync('src/citizen/theme/hero-archive.css', archiveCss);

fs.writeFileSync(
  'src/index.css',
  `/* Compat entry (full). Prod uses styles/base + landing/app splits via JS imports. */
@import "./styles/base.css";
@import "./styles/landing.css";
@import "./styles/app.css";
`,
);

console.log('written');
console.log('base', Math.round(baseCss.length / 1024) + 'KB');
console.log('landing', Math.round(landingCss.length / 1024) + 'KB');
console.log('app', Math.round(appCss.length / 1024) + 'KB');
console.log('archive', Math.round(archiveCss.length / 1024) + 'KB');
