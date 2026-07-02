#!/usr/bin/env tsx
/**
 * Simulación del protocolo de pánico: FREEZE → ROTATE → RECOVER
 * No requiere Postgres. Validaciones E2E en prod → docs/PRE-PRODUCTION.md
 */
import { DidRegistry } from '../src/bus/did-registry.js';
import {
  createSignedEnvelope,
  generateAgentKeys,
  verifyAndOpenEnvelope,
} from '../src/protocol/index.js';
import { InMemoryReplayGuard } from '../src/protocol/replay.js';
import { MUTABLE_INTENTS, ProtocolError } from '../src/protocol/types.js';
import {
  PanicActiveError,
  assertLedgerWritable,
  capturePanicSnapshot,
} from '../src/security/panic.js';
import { assessConformity, loadWhitepaper } from '../src/agents/whitepaper/index.js';
import { AGENT_DID_SUFFIX } from '../src/agents/types.js';

function step(label: string): void {
  console.log(`\n[PanicDrill] === ${label} ===`);
}

async function main(): Promise<void> {
  let passed = 0;
  let failed = 0;

  const ok = (name: string) => {
    console.log(`  ✓ ${name}`);
    passed += 1;
  };
  const fail = (name: string, err: unknown) => {
    console.error(`  ✗ ${name}:`, err instanceof Error ? err.message : err);
    failed += 1;
  };

  step('1. FREEZE — ledger read-only');
  process.env.PANIC_MODE = 'true';
  delete process.env.FREEZE_APPROVED;
  try {
    assertLedgerWritable();
    fail('ledger debe rechazar escrituras', 'no lanzó error');
  } catch (e) {
    if (e instanceof PanicActiveError) ok('assertLedgerWritable bloquea mutaciones');
    else fail('assertLedgerWritable', e);
  }
  try {
    assertLedgerWritable({ allowFreeze: true });
    ok('FREEZE status permitido durante pánico');
  } catch (e) {
    fail('allowFreeze', e);
  }
  console.log('  snapshot:', capturePanicSnapshot());

  step('2. IAP — intents mutables bloqueados');
  const sender = generateAgentKeys(AGENT_DID_SUFFIX.centinela);
  const recipient = generateAgentKeys(AGENT_DID_SUFFIX.logistico);
  const registry = new DidRegistry();
  registry.register(
    DidRegistry.fromKeys(
      sender.signing.did,
      sender.signing.ed25519PublicKey,
      sender.encryption.x25519PublicKey,
    ),
  );

  for (const intent of MUTABLE_INTENTS.slice(0, 2)) {
    const envelope = createSignedEnvelope({
      payload: {
        v: 1,
        processId: 'proc-panic-drill',
        agent: 'centinela',
        intent,
        evidenceBundle: {
          processId: 'proc-panic-drill',
          facts: [],
          hashes: ['abc'],
          rulesTriggered: [],
          status: 'received',
        },
      },
      sender: sender.signing,
      recipient: recipient.encryption,
    });

    try {
      await verifyAndOpenEnvelope({
        envelope,
        recipient: recipient.encryption,
        resolveSenderPublicKey: (did) => registry.resolveEd25519PublicKey(did),
        replayGuard: new InMemoryReplayGuard(),
        panicMode: true,
      });
      fail(`IAP debe bloquear ${intent}`, 'no lanzó error');
    } catch (e) {
      if (e instanceof ProtocolError && e.code === 'PANIC_BLOCKED') {
        ok(`IAP bloquea ${intent}`);
      } else {
        fail(`IAP ${intent}`, e);
      }
    }
  }

  step('3. ROTATE — revocar DID comprometido');
  const compromisedDid = AGENT_DID_SUFFIX.logistico;
  registry.revoke(compromisedDid);
  if (!registry.get(compromisedDid)) ok(`DID revocado: ${compromisedDid}`);
  else fail('revoke DID', 'aún resoluble');

  step('4. RECOVER — checklist pre des-freeze');
  process.env.PANIC_MODE = 'false';
  process.env.FREEZE_APPROVED = 'true';
  try {
    assertLedgerWritable();
    ok('ledger writable tras desactivar PANIC_MODE');
  } catch (e) {
    fail('post-recover ledger', e);
  }
  console.log('  snapshot:', capturePanicSnapshot());
  console.log('  → operador ejecuta unfreeze-request en centinela con FREEZE_APPROVED=true');

  step('5. Whitepaper indexado (soberano)');
  try {
    const sections = loadWhitepaper();
    const assessment = assessConformity(
      'Propuesta de transparencia autonomia legitimidad participacion resiliencia innovacion equidad territorial',
      sections,
    );
    if (sections.length >= 4 && assessment.conforme) {
      ok(`whitepaper ${sections.length} secciones, conformidad=${assessment.score.toFixed(2)}`);
    } else {
      fail('whitepaper', `secciones=${sections.length} conforme=${assessment.conforme}`);
    }
  } catch (e) {
    fail('whitepaper', e);
  }

  console.log(`\n[PanicDrill] Resultado: ${passed} OK, ${failed} FAIL`);
  if (failed > 0) process.exit(1);
  console.log('[PanicDrill] Validaciones prod (72h soak, RF LoRaWAN, multi-sig piloto) → Fase 6 cierre');
}

main().catch((error) => {
  console.error('[PanicDrill] Error fatal:', error);
  process.exit(1);
});
