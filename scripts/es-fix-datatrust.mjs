import fs from 'node:fs';

const p = 'src/i18n/locales/es.ts';
let t = fs.readFileSync(p, 'utf8');
const pairs = [
  ['Capas de evidencia y data trust para empresas', 'Capas de evidencia y fideicomiso de datos para empresas'],
  ['Evidencia, data trust e integridad', 'Evidencia, fideicomiso de datos e integridad'],
];
for (const [a, b] of pairs) {
  if (!t.includes(a)) console.log('MISS', a);
  else {
    t = t.split(a).join(b);
    console.log('OK', a);
  }
}
fs.writeFileSync(p, t);
