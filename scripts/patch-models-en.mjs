import fs from 'node:fs';

const p = 'src/i18n/locales/en.ts';
let s = fs.readFileSync(p, 'utf8');

const reps = [
  ["'nav.marketing.apps': 'Apps'", "'nav.marketing.apps': 'Models'"],
  ["'nav.marketing.apps.all': 'All apps'", "'nav.marketing.apps.all': 'All models'"],
  ["'nav.marketing.apps.gov': 'Government apps'", "'nav.marketing.apps.gov': 'Government models'"],
  ["'nav.marketing.apps.biz': 'Business apps'", "'nav.marketing.apps.biz': 'Business models'"],
  ["'nav.marketing.apps.citizen': 'Citizen apps'", "'nav.marketing.apps.citizen': 'Citizen models'"],
  ["'nav.marketing.products': 'Apps'", "'nav.marketing.products': 'Models'"],
  ["'nav.marketing.products.apps': 'All apps'", "'nav.marketing.products.apps': 'All models'"],
  ["'nav.marketing.business.sec.models': 'Apps'", "'nav.marketing.business.sec.models': 'Models'"],
  ["'nav.marketing.business.catalog': 'Business apps'", "'nav.marketing.business.catalog': 'Business models'"],
  ["'landing.footer.models': 'Apps'", "'landing.footer.models': 'Models'"],
  ["'landing.footer.link.apps': 'All apps'", "'landing.footer.link.apps': 'All models'"],
  ["'landing.footer.link.modelsAll': 'All apps'", "'landing.footer.link.modelsAll': 'All models'"],
  ["'landing.footer.link.catalog': 'Apps'", "'landing.footer.link.catalog': 'Models'"],
];

for (const [a, b] of reps) {
  if (!s.includes(a)) console.log('MISS', a);
  else s = s.split(a).join(b);
}

fs.writeFileSync(p, s);
console.log('ok');
