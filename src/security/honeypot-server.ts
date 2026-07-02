import 'dotenv/config';

import express from 'express';
import { appendFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import mqtt from 'mqtt';

const port = Number(process.env.HONEYPOT_PORT ?? 8088);
const mqttUrl = process.env.MQTT_URL?.trim() || 'mqtt://127.0.0.1:1883';
const shard = process.env.BUS_SHARD?.trim() || 'core';
const alertLog = join(process.cwd(), 'data/honeypot-alerts.jsonl');

function logAlert(event: Record<string, unknown>): void {
  mkdirSync(join(process.cwd(), 'data'), { recursive: true });
  const line = `${JSON.stringify({ ...event, at: new Date().toISOString() })}\n`;
  appendFileSync(alertLog, line);
  console.warn('[Honeypot] ALERTA', line.trim());
}

let mqttClient: mqtt.MqttClient | null = null;

function publishAudit(event: Record<string, unknown>): void {
  if (!mqttClient?.connected) return;
  const topic = `armada/v1/${shard}/audit/honeypot`;
  mqttClient.publish(topic, JSON.stringify(event), { qos: 1 });
}

function trap(path: string, vector: string) {
  return (req: express.Request, res: express.Response) => {
    const event = {
      vector,
      path,
      ip: req.ip,
      userAgent: req.get('user-agent') ?? 'unknown',
      method: req.method,
    };
    logAlert(event);
    publishAudit(event);
    res.status(404).send('Not Found');
  };
}

const app = express();
app.set('trust proxy', true);

const decoys = [
  ['/admin', 'fake-admin-panel'],
  ['/admin-old', 'legacy-admin'],
  ['/wp-login.php', 'wordpress-decoy'],
  ['/api/internal/keys', 'key-exfil-probe'],
  ['/.env', 'env-scrape'],
];

for (const [path, vector] of decoys) {
  app.all(path, trap(path, vector));
  app.all(`${path}/*`, trap(`${path}/*`, vector));
}

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'armada-honeypot', decoys: decoys.length });
});

app.listen(port, () => {
  console.log(`[Honeypot] Decoys activos :${port} → ${alertLog}`);
  mqttClient = mqtt.connect(mqttUrl, { clientId: 'armada-honeypot' });
  mqttClient.on('connect', () => {
    console.log(`[Honeypot] Audit MQTT → armada/v1/${shard}/audit/honeypot`);
  });
});
