import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';

const es = readFileSync(new URL('../src/i18n/locales/es.ts', import.meta.url), 'utf8');
const nav = readFileSync(new URL('../src/citizen/platform/deskNav.ts', import.meta.url), 'utf8');
const api = readFileSync(new URL('../src/server/public-api.ts', import.meta.url), 'utf8');

function mustInclude(label, text, needle) {
  if (!text.includes(needle)) {
    console.error(`Falta en ${label}: ${needle}`);
    process.exitCode = 1;
  }
}

mustInclude('portada', es, 'AGIGOV publica lo que hace una institución, con hechos que se pueden revisar.');
mustInclude('portada', es, 'El repositorio público todavía no está abierto.');
mustInclude('menú', nav, "label: 'Ayuda'");
mustInclude('menú', nav, "label: 'Datos del sector'");
mustInclude('menú', nav, "label: 'Ahorro'");
mustInclude('cuenta', api, "path === '/api/ops/auth/verification'");

const base = process.env.BETA_WALK_URL ?? 'http://127.0.0.1:3000';
const chrome = process.env.CHROME_BIN ?? 'google-chrome';

const pages = [
  ['/', 'AGIGOV publica lo que hace una institución, con hechos que se pueden revisar.'],
  ['/escritorio', 'Escritorio'],
  ['/participar', 'Enviar propuesta'],
];

const port = 9333;
const browser = spawn(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--no-first-run',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=/tmp/agigov-beta-walk-${process.pid}`,
], { stdio: 'ignore' });

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let version;
for (let i = 0; i < 40; i++) {
  try {
    version = await fetch(`http://127.0.0.1:${port}/json/version`);
    if (version.ok) break;
  } catch {
    version = null;
  }
  await sleep(250);
}
if (!version?.ok) {
  browser.kill();
  throw new Error('Chrome no abrió el puerto de depuración');
}

const page = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
const ws = new WebSocket(page.webSocketDebuggerUrl);
let seq = 0;
const pending = new Map();
ws.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)(message);
    pending.delete(message.id);
  }
});
await new Promise((resolve, reject) => {
  ws.addEventListener('open', resolve);
  ws.addEventListener('error', reject);
});
function send(method, params = {}) {
  const id = ++seq;
  return new Promise((resolve, reject) => {
    pending.set(id, (message) => {
      if (message.error) reject(new Error(JSON.stringify(message.error)));
      else resolve(message.result);
    });
    ws.send(JSON.stringify({ id, method, params }));
  });
}
await send('Page.enable');
await send('Runtime.enable');

for (const [path, needle] of pages) {
  await send('Page.navigate', { url: base + path });
  await sleep(1800);
  const result = await send('Runtime.evaluate', {
    expression: 'document.body.innerText',
    returnByValue: true,
  });
  const text = result.result?.value ?? '';
  if (!text.includes(needle)) {
    console.error(`La página ${path} no muestra: ${needle}`);
    process.exitCode = 1;
  } else {
    console.log(`ok ${path}`);
  }
}

ws.close();
browser.kill();

if (process.exitCode) process.exit(process.exitCode);
console.log('beta-walk ok');
