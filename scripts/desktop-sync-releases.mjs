#!/usr/bin/env node
/**
 * Actualiza public/desktop/releases.json con URLs de artefactos locales o GitHub Release.
 *
 * Uso:
 *   node scripts/desktop-sync-releases.mjs --version 0.1.0 --base-url https://github.com/org/repo/releases/download/desktop-v0.1.0
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const manifestPath = path.join(__dirname, '../public/desktop/releases.json');

function arg(name) {
  const idx = process.argv.indexOf(name);
  return idx >= 0 ? process.argv[idx + 1] : undefined;
}

const version = arg('--version');
const baseUrl = arg('--base-url')?.replace(/\/$/, '');

const raw = readFileSync(manifestPath, 'utf8');
const manifest = JSON.parse(raw);

if (version) manifest.version = version;
manifest.releasedAt = new Date().toISOString();

if (baseUrl) {
  for (const item of manifest.downloads) {
    item.filename = item.filename.replace(/AGIGOV-[\d.]+/, `AGIGOV-${manifest.version}`);
    item.url = `${baseUrl}/${item.filename}`;
    item.available = true;
  }
}

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`Manifiesto actualizado: v${manifest.version}${baseUrl ? ' (URLs publicadas)' : ''}`);
