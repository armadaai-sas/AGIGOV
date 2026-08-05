/**
 * Registra resultado de panic drill trimestral en data/panic-drill-log.jsonl
 * y opcionalmente ejecuta el drill.
 *
 * Uso:
 *   npm run panic:quarterly           # corre drill + log
 *   npm run panic:quarterly -- --status-only
 */
import 'dotenv/config';

import { spawnSync } from 'node:child_process';
import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DATA = join(process.cwd(), 'data');
const LOG = join(DATA, 'panic-drill-log.jsonl');
const QUARTER_MS = 90 * 24 * 60 * 60 * 1000;

type DrillLog = {
  at: string;
  ok: boolean;
  passed?: number;
  failed?: number;
  note: string;
};

function readLogs(): DrillLog[] {
  if (!existsSync(LOG)) return [];
  return readFileSync(LOG, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((l) => JSON.parse(l) as DrillLog);
}

function lastDrill(): DrillLog | null {
  const logs = readLogs();
  return logs.length ? logs[logs.length - 1]! : null;
}

function main(): void {
  const statusOnly = process.argv.includes('--status-only');
  if (!existsSync(DATA)) mkdirSync(DATA, { recursive: true });

  if (statusOnly) {
    const last = lastDrill();
    const age = last ? Date.now() - new Date(last.at).getTime() : Number.POSITIVE_INFINITY;
    const due = age > QUARTER_MS;
    console.log(
      JSON.stringify(
        {
          lastDrill: last,
          daysSince: last ? Math.round(age / (24 * 60 * 60 * 1000)) : null,
          quarterlyDue: due || !last,
          maxDays: 90,
        },
        null,
        2,
      ),
    );
    if (due || !last) process.exitCode = 2;
    return;
  }

  console.log('[PanicQuarterly] Running npm run panic:drill …');
  const result = spawnSync('npm', ['run', 'panic:drill'], {
    cwd: process.cwd(),
    encoding: 'utf8',
    env: process.env,
  });
  const out = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
  const match = out.match(/Resultado:\s*(\d+)\s*OK,\s*(\d+)\s*FAIL/);
  const passed = match ? Number(match[1]) : 0;
  const failed = match ? Number(match[2]) : result.status === 0 ? 0 : 1;
  const ok = result.status === 0 && failed === 0;

  const entry: DrillLog = {
    at: new Date().toISOString(),
    ok,
    passed,
    failed,
    note: ok ? 'FREEZE→ROTATE→RECOVER OK' : 'drill failed — revisar panic:drill',
  };
  appendFileSync(LOG, `${JSON.stringify(entry)}\n`);
  console.log('[PanicQuarterly] logged →', LOG);
  console.log(JSON.stringify(entry, null, 2));
  if (!ok) process.exit(1);
}

main();
