import fs from 'node:fs';

/** Merge prior split sheets, then re-split more aggressively for first-viewport critical CSS. */

function extractRules(css) {
  const headMatch = css.match(/^[\s\S]*?@layer components\s*\{/);
  if (!headMatch) return [];
  let body = css.slice(headMatch[0].length).replace(/\}\s*$/, '');
  const rules = [];
  let i = 0;
  while (i < body.length) {
    while (i < body.length && /\s/.test(body[i])) i++;
    if (i >= body.length) break;
    if (body.startsWith('/*', i)) {
      const e = body.indexOf('*/', i + 2);
      i = e < 0 ? body.length : e + 2;
      continue;
    }
    const selStart = i;
    let inStr = null;
    let found = false;
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
        found = true;
        break;
      }
    }
    if (!found) break;
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
  return rules;
}

function extractKeyframes(css) {
  const out = [];
  const re = /@keyframes\s+([^{\s]+)\s*\{/g;
  let m;
  while ((m = re.exec(css))) {
    const name = m[1];
    let i = m.index + m[0].length - 1;
    let depth = 0;
    const start = m.index;
    for (; i < css.length; i++) {
      if (css[i] === '{') depth++;
      if (css[i] === '}') {
        depth--;
        if (depth === 0) {
          i++;
          break;
        }
      }
    }
    out.push({ name, text: css.slice(start, i) });
  }
  return out;
}

const landing = fs.readFileSync('src/styles/landing.css', 'utf8');
const below = fs.readFileSync('src/styles/landing-below.css', 'utf8');
const consoleCss = fs.readFileSync('src/citizen/components/home/hero-console.css', 'utf8');
const appCss = fs.readFileSync('src/styles/app.css', 'utf8');

const rules = [...extractRules(landing), ...extractRules(below), ...extractRules(consoleCss)];
const seen = new Set();
const uniq = [];
for (const r of rules) {
  const key = r.sel + '|' + r.body;
  if (seen.has(key)) continue;
  seen.add(key);
  uniq.push(r);
}

// Progress lives in app.css today — pull into critical landing.
const progressRules = extractRules(appCss).filter((r) => /hero-screen-progress|hero-story-visual|hero-evidence-demo/.test(r.sel));
for (const r of progressRules) {
  const key = r.sel + '|' + r.body;
  if (seen.has(key)) continue;
  seen.add(key);
  uniq.push(r);
}

const keyframes = [
  ...extractKeyframes(landing),
  ...extractKeyframes(below),
  ...extractKeyframes(consoleCss),
];
const kfSeen = new Set();
const uniqKf = [];
for (const k of keyframes) {
  if (kfSeen.has(k.name)) continue;
  kfSeen.add(k.name);
  uniqKf.push(k);
}

/** First viewport only (brand + title + CTA + slot + nav + progress). */
function isCritical(sel) {
  return (
    /^(html\.)?landing-snap-root/.test(sel) ||
    /^\.landing-manifest/.test(sel) ||
    /^\.landing-display-title/.test(sel) ||
    /^\.landing-lead\b/.test(sel) ||
    /^\.hero-landing-track/.test(sel) ||
    /^\.hero-product-reveal-track/.test(sel) ||
    /^\.hero-cinematic-(stage|stage-bg|inner|brand|title|subline|micro|trust|actions|scroll)\b/.test(sel) ||
    /^\.hero-brand-btn/.test(sel) ||
    /^\.hero-mobile-cta/.test(sel) ||
    /^\.hero-console-slot\b/.test(sel) ||
    /^\.hero-trust-legacy-grid\b/.test(sel) ||
    /^\.hero-trust-scroll-hint\b/.test(sel) ||
    /^\.hero-trust-legacy--light\.hero-landing/.test(sel) ||
    /^\.hero-trust-legacy--light \.hero-trust-scroll-hint/.test(sel) ||
    /^\.hero-trust-nav/.test(sel) ||
    /^\.hero-screen-progress/.test(sel) ||
    /^@keyframes cinematic-/.test(sel)
  );
}

function isDeferredHero(sel) {
  return (
    /hero-console|hero-route|hero-cta-stage|hero-cta-(copy|visual|layout|kicker|title|lead|actions|trust|micro)\b|hero-brand-float|hero-brand-kicker|hero-cinematic-float|hero-cinematic-live|hero-model-card|hero-evidence|hero-trust-details|hero-trust-compare|hero-trust-pipeline|hero-demo-click|hero-story-/.test(
      sel,
    ) || /^@keyframes hero-(brand-float|demo-click|scan|cinematic-kenburns)/.test(sel)
  );
}

function isBelow(sel) {
  return /landing-(section|compare|model|solution|dock|feed|learn|challenge|cta|btn|hero-metrics|flow|guide|console|preview|page|hero|kicker|title|actions|scroll|metric|link|infrastructure|float)/.test(
    sel,
  );
}

const crit = [];
const deferred = [];
const belowOut = [];
const orphan = [];

for (const r of uniq) {
  if (isCritical(r.sel)) crit.push(r);
  else if (isDeferredHero(r.sel)) deferred.push(r);
  else if (isBelow(r.sel)) belowOut.push(r);
  else orphan.push(r);
}

// Prefer not to lose styles: orphans that look hero-* go deferred; rest below.
for (const r of orphan) {
  if (/^(\.hero-|@keyframes hero-)/.test(r.sel)) deferred.push(r);
  else belowOut.push(r);
}

const critKf = uniqKf.filter((k) => /^cinematic-/.test(k.name));
const defKf = uniqKf.filter((k) => !/^cinematic-/.test(k.name));

const fmt = (a) => a.map((r) => `${r.sel} ${r.body}`).join('\n\n');
const fmtKf = (a) => a.map((k) => k.text).join('\n\n');

console.log('crit', crit.length, Math.round(fmt(crit).length / 1024) + 'KB', '+kf', critKf.length);
console.log('deferred', deferred.length, Math.round(fmt(deferred).length / 1024) + 'KB', '+kf', defKf.length);
console.log('below', belowOut.length, Math.round(fmt(belowOut).length / 1024) + 'KB');

const critCss = `/* Landing critical — first viewport hero only */
@import "tailwindcss/utilities.css" layer(utilities);
@reference "./base.css";

@source "../citizen/pages/HomePage.tsx";
@source "../citizen/components/home/HomeHero.tsx";
@source "../citizen/components/home/HomeHeroNav.tsx";
@source "../citizen/components/home/HomeHeroProgress.tsx";
@source "../citizen/components/home/HomeHeroMobileCta.tsx";
@source "../citizen/components/AgigovLogo.tsx";

@layer components {
${fmt(crit)}

${fmtKf(critKf)}
}
`;

const belowCss = `/* Landing below-fold — lazy with Landing* components */
@import "tailwindcss/utilities.css" layer(utilities);
@reference "./base.css";

@source "../citizen/components/landing/**/*.{tsx,ts}";
@source "../citizen/components/HeroWelcome.tsx";
@source "../citizen/components/HeroMiniTelemetry.tsx";
@source "../citizen/components/LandingTelemetryPanel.tsx";
@source "../citizen/components/LandingAcademia.tsx";
@source "../citizen/components/FloatingLandingNav.tsx";

@layer components {
${fmt(belowOut)}
}
`;

const deferredFile = `/* Hero deferred stages — console / route / CTA (lazy) */
@import "tailwindcss/utilities.css" layer(utilities);
@reference "../../../styles/base.css";

@source "./HomeHeroConsole.tsx";
@source "./HomeHeroConsoleDemo.tsx";
@source "./HomeHeroFloatingConsole.tsx";
@source "./HomeHeroRouteStage.tsx";
@source "./HomeHeroCtaStage.tsx";
@source "./HomeHeroEvidenceDemo.tsx";
@source "./HomeHeroModelCard.tsx";

@layer components {
${fmt(deferred)}

${fmtKf(defKf)}
}
`;

fs.writeFileSync('src/styles/landing.css', critCss);
fs.writeFileSync('src/styles/landing-below.css', belowCss);
fs.writeFileSync('src/citizen/components/home/hero-console.css', deferredFile);

// Strip progress/evidence from app.css (now in landing / deferred)
let app = appCss;
const appRules = extractRules(appCss);
const keepApp = appRules.filter(
  (r) => !/hero-screen-progress|hero-story-visual|hero-evidence-demo/.test(r.sel),
);
const appHead = appCss.match(/^[\s\S]*?@layer components\s*\{/)?.[0];
if (appHead) {
  // Find end of components layer carefully — rewrite whole components body for matched removals only via line filter is hard; do targeted block removal.
  for (const r of appRules) {
    if (/hero-screen-progress|hero-story-visual|hero-evidence-demo/.test(r.sel)) {
      const block = `${r.sel} ${r.body}`;
      app = app.replace(block, '');
    }
  }
  fs.writeFileSync('src/styles/app.css', app.replace(/\n{3,}/g, '\n\n'));
  console.log('app.css stripped progress/evidence; kept', keepApp.length, 'of', appRules.length);
}

console.log('ok');
