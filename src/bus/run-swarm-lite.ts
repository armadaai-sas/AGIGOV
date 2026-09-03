/**
 * Enjambre mínimo en un solo proceso — ahorra RAM vs 5 contenedores.
 * Roles por defecto: centinela (auditoría 24/7) + comunicador (publicación).
 */
import { spawn, type ChildProcess } from 'node:child_process';

const ROLES = (process.env.SWARM_LITE_ROLES ?? 'centinela,comunicador')
  .split(',')
  .map((r) => r.trim())
  .filter(Boolean);

const children = new Map<string, ChildProcess>();
let shuttingDown = false;

function startWorker(role: string): void {
  const env = {
    ...process.env,
    AGENT_ROLE: role,
    NODE_DID:
      process.env[`NODE_DID_${role.toUpperCase().replace(/-/g, '_')}`]?.trim() ??
      `did:agigov:core:${role}`,
    NODE_OPTIONS: process.env.NODE_OPTIONS ?? '--max-old-space-size=96',
  };

  // Asegura que loadBusNodeConfig resuelva claves scoped por rol
  const child = spawn('npx', ['tsx', 'src/bus/run-worker.ts'], {
    env,
    stdio: 'inherit',
  });

  child.on('exit', (code, signal) => {
    if (shuttingDown) return;
    console.error(`[SwarmLite] ${role} terminó code=${code} signal=${signal}`);
    void shutdown(code ?? 1);
  });

  children.set(role, child);
  console.log(`[SwarmLite] ${role} activo (did=${env.NODE_DID})`);
}

async function shutdown(code = 0): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const [role, child] of children) {
    console.log(`[SwarmLite] deteniendo ${role}...`);
    child.kill('SIGTERM');
  }
  setTimeout(() => process.exit(code), 500);
}

async function main(): Promise<void> {
  if (ROLES.length === 0) {
    throw new Error('SWARM_LITE_ROLES vacío');
  }

  console.log(`[SwarmLite] Roles: ${ROLES.join(', ')}`);
  for (const role of ROLES) startWorker(role);

  process.on('SIGINT', () => void shutdown(0));
  process.on('SIGTERM', () => void shutdown(0));
}

main().catch((error) => {
  console.error('[SwarmLite] Error fatal:', error);
  process.exit(1);
});
