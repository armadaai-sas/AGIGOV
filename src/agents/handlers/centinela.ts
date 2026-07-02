import { upsertEscrow } from '../../db/ledger/index.js';
import { getCoreDb } from '../../db/client.js';
import { advanceProcess, freezeProcess, unfreezeProcess } from '../state-machine.js';
import { isFreezeApproved } from '../../security/panic.js';
import {
  AGENT_DID_SUFFIX,
  mergeEvidence,
} from '../types.js';
import type { AgentContext, AgentHandler } from '../context.js';

function hasAnomaly(bundle: { hashes: string[]; rulesTriggered: string[] }): boolean {
  if (bundle.hashes.length === 0) return true;
  return bundle.rulesTriggered.some((r) =>
    ['anomaly', 'integrity-fail', 'signature-fail'].includes(r),
  );
}

export const centinelaHandler: AgentHandler = async (ctx, message) => {
  const { evidenceBundle, intent, processId } = message.payload;

  if (ctx.panicMode && intent === 'allocate-resources') {
    await freezeProcess({
      processId,
      agentId: 'centinela',
      evidenceBundle,
      originNodeId: ctx.originNodeId,
      reason: 'PANIC_MODE activo',
    });
    return { action: 'FREEZE: PANIC_MODE', nextStatus: 'frozen' };
  }

  if (intent === 'unfreeze-request') {
    if (!isFreezeApproved()) {
      console.warn(`[centinela] RECOVER denegado ${processId} — FREEZE_APPROVED requerido`);
      return { action: 'RECOVER denegado: FREEZE_APPROVED', nextStatus: 'frozen' };
    }

    const checkpoint = await getCoreDb().processCheckpoint.findUnique({
      where: { processId },
    });
    if (checkpoint?.status !== 'frozen') {
      return { action: 'unfreeze ignorado: no congelado', nextStatus: checkpoint?.status };
    }

    await unfreezeProcess({
      processId,
      agentId: 'centinela',
      evidenceBundle,
      originNodeId: ctx.originNodeId,
      approvedBy: ctx.nodeDid,
    });

    console.log(`[centinela] RECOVER ${processId} — human-in-the-loop OK`);
    return { action: 'RECOVER: descongelado', nextStatus: 'received' };
  }

  if (intent === 'validate-request') {
    if (hasAnomaly(evidenceBundle)) {
      await freezeProcess({
        processId,
        agentId: 'centinela',
        evidenceBundle,
        originNodeId: ctx.originNodeId,
        reason: 'Anomalía detectada en evidencia',
      });
      console.warn(`[centinela] FREEZE ${processId} — human-in-the-loop requerido`);
      return { action: 'FREEZE: anomalía', nextStatus: 'frozen' };
    }

    await advanceProcess({
      processId,
      from: 'received',
      to: 'validated',
      agentId: 'centinela',
      evidenceBundle,
      originNodeId: ctx.originNodeId,
    });

    const nextBundle = mergeEvidence(evidenceBundle, { status: 'validated' });
    return {
      action: 'validado',
      nextStatus: 'validated',
      handoff: {
        recipientDid: AGENT_DID_SUFFIX.logistico,
        intent: 'validation-result',
        agent: 'centinela',
        evidenceBundle: nextBundle,
      },
    };
  }

  if (intent === 'allocate-resources') {
    const amount = evidenceBundle.facts.find(
      (f) => typeof f === 'object' && f !== null && 'amount' in f,
    ) as { amount?: number } | undefined;

    await upsertEscrow({
      processId,
      amount: amount?.amount ?? 0,
      status: 'LOCKED',
      threshold: 2,
      signers: [AGENT_DID_SUFFIX.centinela, AGENT_DID_SUFFIX.logistico],
      originNodeId: ctx.originNodeId,
      agentId: 'centinela',
    });

    await advanceProcess({
      processId,
      from: 'decided',
      to: 'committed',
      agentId: 'centinela',
      evidenceBundle,
      originNodeId: ctx.originNodeId,
    });

    const nextBundle = mergeEvidence(evidenceBundle, { status: 'committed' });
    return {
      action: 'escrow commit',
      nextStatus: 'committed',
      handoff: {
        recipientDid: AGENT_DID_SUFFIX.comunicador,
        intent: 'publish-metrics',
        agent: 'centinela',
        evidenceBundle: nextBundle,
      },
    };
  }

  return { action: 'ignored' };
};
