/**
 * Smoke tests pre-producción — sin DB requerida.
 */
import { assessConformity, loadWhitepaper } from '../src/agents/whitepaper/index.js';
import { PanicActiveError, assertLedgerWritable } from '../src/security/panic.js';

function assert(name: string, condition: boolean): void {
  if (!condition) throw new Error(`Smoke FAIL: ${name}`);
  console.log(`  ✓ ${name}`);
}

async function main(): Promise<void> {
  console.log('[Smoke] Pre-production checks');

  process.env.PANIC_MODE = 'true';
  try {
    assertLedgerWritable();
    throw new Error('expected panic');
  } catch (e) {
    assert('panic guard activo', e instanceof PanicActiveError);
  }

  process.env.PANIC_MODE = 'false';
  assertLedgerWritable();
  assert('panic guard inactivo', true);

  const sections = loadWhitepaper();
  assert('whitepaper cargado', sections.length >= 4);

  const result = assessConformity('transparencia y legitimidad', sections);
  assert('whitepaper assess', typeof result.score === 'number');

  console.log('[Smoke] OK');
}

main().catch((error) => {
  console.error('[Smoke] FAIL:', error);
  process.exit(1);
});
