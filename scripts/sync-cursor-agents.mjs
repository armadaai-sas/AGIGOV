#!/usr/bin/env node
// Espeja el equipo de expertos versionado en .github/agents/*.agent.md (formato
// GitHub Copilot) hacia subagentes de Cursor en .cursor/agents/*.md, que Cursor
// sí reconoce (invocables con /nombre y auto-delegables por su `description`).
//
// Fuente de verdad: .github/agents/*.agent.md. Regenera tras editarlos:
//   npm run agents:sync-cursor
//
// Copilot no comparte esquema con Cursor, así que solo mapeamos campos válidos:
//   name        -> nombre del archivo en kebab-case (requisito de Cursor)
//   description -> se conserva (Cursor la usa para decidir delegación)
//   model       -> "inherit" (los IDs de modelo de Copilot no son válidos en Cursor)
// El cuerpo del prompt (en español) se conserva intacto.

import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(repoRoot, '.github', 'agents');
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
    console.error(`[sync-cursor-agents] No existe ${srcDir}`);
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

  console.log(
    `[sync-cursor-agents] Generados ${generated.length} subagentes en .cursor/agents/:`,
  );
  for (const n of generated) console.log(`  - ${n}  (invócalo con /${n})`);
}

main();
