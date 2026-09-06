#!/usr/bin/env node
// Espeja el equipo de expertos versionado en .github/agents/*.agent.md hacia el
// formato de subagentes que lee el IDE de desarrollo, generándolos en el
// directorio de carga de subagentes del IDE (.cursor/agents/*.md) — esa ruta la
// impone la herramienta y es la única referencia de marca que se conserva, por
// requisito funcional (ver regla en AGENTS.md).
//
// Fuente de verdad: .github/agents/*.agent.md. Regenera tras editarlos:
//   npm run agents:sync
//
// El formato de origen no comparte esquema, así que solo mapeamos campos válidos:
//   name        -> nombre del archivo en kebab-case
//   description -> se conserva (el IDE la usa para decidir delegación)
//   model       -> "inherit" (los IDs de modelo del formato de origen no aplican)
// El cuerpo del prompt (en español) se conserva intacto.

import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(repoRoot, '.github', 'agents');
// Ruta de carga de subagentes impuesta por el IDE de desarrollo (excepción a la
// regla de marca del proyecto; ver AGENTS.md).
const outDir = join(repoRoot, '.cursor', 'agents');

/** Extrae { frontmatter, body } de un .md con front-matter YAML simple. */
function splitFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: raw.trim() };
  const [, fmBlock, body] = match;
  const frontmatter = {};
  for (const line of fmBlock.split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    let value = kv[2].trim();
    // Quita comillas envolventes de valores string.
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    frontmatter[kv[1]] = value;
  }
  return { frontmatter, body: body.trim() };
}

/** Escapa un string para YAML de una sola línea entre comillas dobles. */
function yamlString(value) {
  return `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function main() {
  if (!existsSync(srcDir)) {
    console.error(`[sync-agents] No existe ${srcDir}`);
    process.exit(1);
  }

  mkdirSync(outDir, { recursive: true });

  // Limpia subagentes generados previamente (mantiene el directorio versionado limpio).
  for (const f of readdirSync(outDir).filter((f) => f.endsWith('.md'))) {
    rmSync(join(outDir, f));
  }

  const sources = readdirSync(srcDir)
    .filter((f) => f.endsWith('.agent.md'))
    .sort();

  const generated = [];
  for (const file of sources) {
    const raw = readFileSync(join(srcDir, file), 'utf8');
    const { frontmatter, body } = splitFrontmatter(raw);

    const name = basename(file, '.agent.md'); // p.ej. lead-developer
    const description = frontmatter.description || `Experto AGIGOV: ${name}`;

    const fm = [
      '---',
      `name: ${name}`,
      `description: ${yamlString(description)}`,
      'model: inherit',
      '---',
    ].join('\n');

    const outPath = join(outDir, `${name}.md`);
    writeFileSync(outPath, `${fm}\n\n${body}\n`, 'utf8');
    generated.push(name);
  }

  console.log(`[sync-agents] Generados ${generated.length} subagentes:`);
  for (const n of generated) console.log(`  - ${n}  (invócalo con /${n})`);
}

main();
