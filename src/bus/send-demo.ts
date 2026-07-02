import 'dotenv/config';

import { DidRegistry } from './did-registry.js';
import { loadBusNodeConfig } from './config.js';
import { SovereignBusWorker } from './mqtt/sovereign-worker.js';
import { SqliteOutbox } from './outbox/sqlite-outbox.js';
import { buildOutboundEnvelope } from './send.js';

async function main(): Promise<void> {
  const recipientDid =
    process.argv[2]?.trim() || 'did:armada:core:logistico';
  const mqttUrl = process.env.MQTT_URL?.trim() || 'mqtt://127.0.0.1:1883';

  const config = loadBusNodeConfig();
  config.mqttUrl = mqttUrl;

  const registry = new DidRegistry();
  registry.loadFromFile(config.registryPath);

  const processId = `proc-demo-${Date.now()}`;

  const { envelope, topic, opaqueId } = buildOutboundEnvelope(
    {
      payload: {
        v: 1,
        processId,
        agent: 'centinela',
        intent: 'validation-result',
        evidenceBundle: {
          processId,
          facts: [{ demo: true, ts: new Date().toISOString() }],
          hashes: ['demo-hash'],
          rulesTriggered: ['e2e-test'],
          status: 'validated',
        },
      },
      sender: config.signing,
      recipientDid,
      shard: config.shard,
    },
    registry,
  );

  const outbox = new SqliteOutbox(config.outboxDbPath);
  const worker = new SovereignBusWorker({
    mqttUrl: config.mqttUrl,
    clientId: `${config.clientId}-sender`,
    shard: config.shard,
    nodeDid: config.nodeDid,
    encryption: config.encryption,
    registry,
    outbox,
    panicMode: config.panicMode,
  });

  await worker.start();
  const result = await worker.publish(envelope, topic, opaqueId, true);
  await worker.stop();
  outbox.close();

  console.log(`[IAP] Enviado (${result}) → ${topic}`);
  console.log(`[IAP] Destinatario: ${recipientDid}`);
}

main().catch((error) => {
  console.error('[IAP] send-demo error:', error);
  process.exit(1);
});
