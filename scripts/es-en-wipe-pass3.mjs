import fs from 'node:fs';

function fix(p, pairs) {
  let t = fs.readFileSync(p, 'utf8');
  let c = 0;
  for (const [a, b] of pairs) {
    if (t.includes(a)) {
      t = t.split(a).join(b);
      c += 1;
    } else {
      console.log('MISS', p, a.slice(0, 60));
    }
  }
  if (c) {
    fs.writeFileSync(p, t);
    console.log('updated', p, c);
  }
}

fix('src/i18n/locales/es.ts', [
  ["'pipeline.kicker': 'Pipeline institucional'", "'pipeline.kicker': 'Flujo institucional'"],
  ["'route.step.os.hint': 'Pipeline institucional'", "'route.step.os.hint': 'Flujo institucional'"],
]);

fix('src/citizen/platform/agigovModels.ts', [
  ['Emisión → commit →', 'Emisión → registro →'],
  ['validación → commit →', 'validación → registro →'],
  ['dictamen → commit →', 'dictamen → registro →'],
  ['commit registro', 'asiento en el registro'],
  ['modelo cloud utility', 'modelo de utilidad en la nube'],
]);

fix('src/citizen/content/helpTutorials.ts', [
  ['sandbox autoservicio', 'entorno de prueba autoservicio'],
]);

fix('src/citizen/pages/CnePage.tsx', [
  ['commit firmado', 'asiento firmado'],
]);

fix('src/citizen/platform/modelValidationState.ts', [
  ['commit firmado', 'asiento firmado'],
]);

console.log('done');
