import fs from 'node:fs';

const p = 'src/i18n/locales/es.ts';
let t = fs.readFileSync(p, 'utf8');
const pairs = [
  ["'hero.diagram.node.multifirma': 'Línea base multifirma'", "'hero.diagram.node.multisig': 'Línea base multifirma'"],
  ["'hero.diagram.node.publish': 'Dashboard ciudadano'", "'hero.diagram.node.publish': 'Panel ciudadano'"],
  ["'hero.cinematic.micro': 'Entrada → proceso → gate → resultado'", "'hero.cinematic.micro': 'Entrada → proceso → filtro → resultado'"],
  ['estado de reconcile', 'estado de reconciliación'],
  ['5 estados · ledger inmutable', '5 estados · registro inmutable'],
  ['miran el mismo ledger.', 'miran el mismo registro.'],
  ['(EGS, custodia, ledger)', '(EGS, custodia, registro)'],
];
for (const [a, b] of pairs) {
  if (!t.includes(a)) console.log('MISS', a);
  else {
    t = t.split(a).join(b);
    console.log('OK', a.slice(0, 50));
  }
}
fs.writeFileSync(p, t);
console.log('written');
