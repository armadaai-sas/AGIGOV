import 'dotenv/config';

import mqtt from 'mqtt';
import { ed25519 } from '@noble/curves/ed25519.js';

import { bytesToBase64 } from '../protocol/encoding.js';
import type { SignedSensorPayload } from './payload-verify.js';
import { canonicalSensorBytes } from './payload-verify.js';

const mqttUrl = process.env.MQTT_URL?.trim() || 'mqtt://127.0.0.1:1883';
const topic = process.env.LORAWAN_DEMO_TOPIC?.trim() || 'lorawan/demo/up';

async function main(): Promise<void> {
  const privateKey = ed25519.utils.randomSecretKey();
  const publicKey = ed25519.getPublicKey(privateKey);

  const body: Omit<SignedSensorPayload, 'signature' | 'publicKey'> = {
    v: 1,
    devEui: 'demo-sensor-001',
    territoryCode: process.env.TERRITORY_CODE?.trim() || 'MAR_NORTH_01',
    timestamp: new Date().toISOString(),
    facts: [{ resource: 'agua', amount: 850, unit: 'litros' }],
  };

  const signature = ed25519.sign(canonicalSensorBytes(body), privateKey);
  const payload: SignedSensorPayload = {
    ...body,
    signature: bytesToBase64(signature),
    publicKey: bytesToBase64(publicKey),
  };

  const client = mqtt.connect(mqttUrl, { clientId: 'armada-lorawan-demo-pub' });

  client.on('connect', () => {
    client.publish(topic, JSON.stringify(payload), { qos: 1 }, (err) => {
      if (err) {
        console.error('[LoRaWAN/Demo] Publish error:', err);
        process.exit(1);
      }
      console.log(`[LoRaWAN/Demo] Publicado en ${topic}`, payload);
      client.end();
    });
  });
}

main().catch((error) => {
  console.error('[LoRaWAN/Demo] Error:', error);
  process.exit(1);
});
