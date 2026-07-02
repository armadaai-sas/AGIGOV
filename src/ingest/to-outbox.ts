import { getCoreDb } from '../db/client.js';
import { enqueueSyncMutation } from '../db/sync/outbox.js';
import { payloadHash } from '../db/sync/conflicts.js';
import type { SignedSensorPayload } from './payload-verify.js';

export interface IngestResult {
  processId: string;
  outboxId: string;
  payloadHash: string;
}

/** Convierte uplink LoRaWAN verificado en mutación de proceso en outbox edge. */
export async function sensorPayloadToOutbox(
  payload: SignedSensorPayload,
  originNodeId: string,
): Promise<IngestResult> {
  const core = getCoreDb();
  const territory = await core.territorialNode.findUnique({
    where: { code: payload.territoryCode },
  });

  if (!territory) {
    throw new Error(`Territorio desconocido: ${payload.territoryCode}`);
  }

  const processId = `proc-lora-${payload.devEui}-${Date.now()}`;
  const bundle = {
    processId,
    facts: payload.facts.map((f) => ({
      ...f,
      territoryId: f.territoryId ?? territory.id,
    })),
    hashes: [payloadHash({ devEui: payload.devEui, timestamp: payload.timestamp })],
    rulesTriggered: ['lorawan-signature-ok'],
    status: 'received',
    devEui: payload.devEui,
    ingestedAt: new Date().toISOString(),
  };

  const entry = await enqueueSyncMutation({
    mutationType: 'create',
    entityType: 'process',
    entityId: processId,
    payload: {
      processId,
      status: 'received',
      agentId: 'centinela',
      evidenceBundle: bundle,
      version: 1,
    },
    originNodeId,
  });

  return {
    processId,
    outboxId: entry.id,
    payloadHash: entry.payloadHash,
  };
}
