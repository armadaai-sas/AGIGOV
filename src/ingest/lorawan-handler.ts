import 'dotenv/config';

import mqtt from 'mqtt';

import { disconnectCoreDb } from '../db/client.js';
import { disconnectEdgeDb } from '../db/edge-client.js';
import { loadEdgeConfig } from '../edge/config.js';
import {
  parseSignedSensorPayload,
  verifySensorPayload,
} from './payload-verify.js';
import { sensorPayloadToOutbox } from './to-outbox.js';

const TOPICS = [
  'lorawan/+/up',
  'application/+/device/+/event/up',
];

function extractPayload(message: Buffer): unknown {
  const text = message.toString('utf8');
  try {
    const parsed = JSON.parse(text) as Record<string, unknown>;
    if (parsed.object && typeof parsed.object === 'object') {
      return parsed.object;
    }
    if (parsed.data && typeof parsed.data === 'object') {
      return parsed.data;
    }
    return parsed;
  } catch {
    return null;
  }
}

async function handleMessage(topic: string, message: Buffer): Promise<void> {
  const raw = extractPayload(message);
  const payload = parseSignedSensorPayload(raw);

  if (!payload) {
    console.warn(`[LoRaWAN] Payload no reconocido en ${topic}`);
    return;
  }

  if (!verifySensorPayload(payload)) {
    console.warn(`[LoRaWAN] Firma inválida devEui=${payload.devEui}`);
    return;
  }

  const config = loadEdgeConfig();
  const result = await sensorPayloadToOutbox(payload, config.originNodeId);
  console.log(
    `[LoRaWAN] Encolado ${result.processId} outbox=${result.outboxId}`,
  );
}

async function main(): Promise<void> {
  const config = loadEdgeConfig();

  const client = mqtt.connect(config.mqttUrl, {
    clientId: `armada-lorawan-${config.originNodeId}`,
    reconnectPeriod: 5_000,
  });

  const shutdown = async (signal: string) => {
    console.log(`[LoRaWAN] ${signal} — deteniendo...`);
    client.end(true);
    await disconnectCoreDb();
    await disconnectEdgeDb();
    process.exit(0);
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));

  client.on('connect', () => {
    for (const topic of TOPICS) {
      client.subscribe(topic, (err) => {
        if (err) console.error(`[LoRaWAN] Subscribe error ${topic}:`, err);
        else console.log(`[LoRaWAN] Suscrito ${topic}`);
      });
    }
    console.log(`[LoRaWAN] Handler activo → ${config.mqttUrl}`);
  });

  client.on('message', (topic, message) => {
    void handleMessage(topic, message).catch((error) => {
      console.error('[LoRaWAN] Error procesando mensaje:', error);
    });
  });

  client.on('error', (error) => {
    console.error('[LoRaWAN] MQTT error:', error.message);
  });
}

main().catch(async (error) => {
  console.error('[LoRaWAN] Error fatal:', error);
  await disconnectCoreDb();
  await disconnectEdgeDb();
  process.exit(1);
});
