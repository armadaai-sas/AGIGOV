import mqtt, { type MqttClient } from 'mqtt';

import type { DidRegistry } from '../did-registry.js';
import { SqliteOutbox } from '../outbox/sqlite-outbox.js';
import { resolveAuditTopic, parseArmadaTopic } from '../routing.js';
import type {
  AgentEncryptionKeys,
  OpenEnvelopeResult,
  SignedAgentEnvelope,
} from '../../protocol/types.js';
import {
  InMemoryReplayGuard,
  verifyAndOpenEnvelope,
} from '../../protocol/index.js';

export type MessageHandler = (
  result: OpenEnvelopeResult,
  meta: { topic: string; shard: string; opaqueId: string },
) => void | Promise<void>;

export interface SovereignBusWorkerOptions {
  /** URL del broker MQTT (accesible vía WireGuard, ej. mqtt://10.8.0.1:1883). */
  mqttUrl: string;
  clientId: string;
  shard: string;
  nodeDid: string;
  encryption: AgentEncryptionKeys;
  registry: DidRegistry;
  outbox: SqliteOutbox;
  replayGuard?: InMemoryReplayGuard;
  panicMode?: boolean;
  /** Suscribirse a copias de auditoría (rol centinela). */
  subscribeAudit?: boolean;
  /** Reintentos de flush al conectar y cada intervalo. */
  flushIntervalMs?: number;
  maxPublishAttempts?: number;
}

export class SovereignBusWorker {
  private client: MqttClient | null = null;
  private flushTimer: ReturnType<typeof setInterval> | null = null;
  private handler: MessageHandler | null = null;
  private readonly replayGuard: InMemoryReplayGuard;
  private readonly processedInbound = new Set<string>();

  constructor(private readonly options: SovereignBusWorkerOptions) {
    this.replayGuard = options.replayGuard ?? new InMemoryReplayGuard();
  }

  onMessage(handler: MessageHandler): void {
    this.handler = handler;
  }

  async start(): Promise<void> {
    if (this.client) return;

    await new Promise<void>((resolve, reject) => {
      this.client = mqtt.connect(this.options.mqttUrl, {
        clientId: this.options.clientId,
        clean: false,
        reconnectPeriod: 5_000,
        connectTimeout: 10_000,
        queueQoSZero: false,
      });

      this.client.once('connect', () => resolve());
      this.client.once('error', reject);
    });

    const subscribeTopic = `armada/v1/${this.options.shard}/#`;
    await this.subscribe(subscribeTopic);

    if (this.options.subscribeAudit) {
      await this.subscribe(resolveAuditTopic(this.options.shard));
    }

    this.client!.on('message', (topic, payload) => {
      void this.handleIncoming(topic, payload.toString('utf8'));
    });

    await this.flushOutbox();

    const interval = this.options.flushIntervalMs ?? 15_000;
    this.flushTimer = setInterval(() => {
      void this.flushOutbox();
    }, interval);
  }

  async stop(): Promise<void> {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    if (this.client) {
      await new Promise<void>((resolve) => {
        this.client!.end(false, {}, () => resolve());
      });
      this.client = null;
    }
  }

  /** Publica envelope; si MQTT falla, encola en SQLite. */
  async publish(
    envelope: SignedAgentEnvelope,
    topic: string,
    opaqueId: string,
    publishAuditCopy = true,
  ): Promise<'sent' | 'queued'> {
    try {
      await this.mqttPublish(topic, envelope);
      if (publishAuditCopy) {
        await this.mqttPublish(
          resolveAuditTopic(this.options.shard),
          envelope,
        );
      }
      return 'sent';
    } catch (error) {
      this.options.outbox.enqueue({
        envelope,
        shard: this.options.shard,
        opaqueId,
        topic,
        publishAuditCopy,
      });
      return 'queued';
    }
  }

  /** Drena cola offline hacia MQTT (idempotente por messageId). */
  async flushOutbox(): Promise<number> {
    if (!this.client?.connected) return 0;

    const pending = this.options.outbox.fetchPending();
    let sent = 0;

    for (const entry of pending) {
      this.options.outbox.markSending(entry.messageId);
      try {
        await this.mqttPublish(entry.topic, entry.envelope);
        if (entry.publishAuditCopy) {
          await this.mqttPublish(
            resolveAuditTopic(entry.shard),
            entry.envelope,
          );
        }
        this.options.outbox.markSent(entry.messageId);
        sent += 1;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Error desconocido MQTT';
        this.options.outbox.markFailed(entry.messageId, message);
        if (entry.attempts + 1 >= (this.options.maxPublishAttempts ?? 8)) {
          continue;
        }
        this.options.outbox.resetFailedToPending(entry.messageId);
      }
    }

    return sent;
  }

  private async subscribe(topic: string): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.client!.subscribe(topic, { qos: 1 }, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }

  private mqttPublish(
    topic: string,
    envelope: SignedAgentEnvelope,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client!.publish(
        topic,
        JSON.stringify(envelope),
        { qos: 1, retain: false },
        (error) => {
          if (error) reject(error);
          else resolve();
        },
      );
    });
  }

  private async handleIncoming(topic: string, raw: string): Promise<void> {
    const parsedTopic = parseArmadaTopic(topic);
    if (!parsedTopic) return;

    let envelope: SignedAgentEnvelope;
    try {
      envelope = JSON.parse(raw) as SignedAgentEnvelope;
    } catch {
      return;
    }

    const inboundKey = `${envelope.messageId}:${envelope.nonce}`;
    if (this.processedInbound.has(inboundKey)) return;

    const isAudit = parsedTopic.opaqueId === 'audit';
    const isForUs =
      envelope.recipientDid === this.options.nodeDid ||
      (isAudit && this.options.subscribeAudit);

    if (!isForUs) return;

    try {
      const opened = verifyAndOpenEnvelope({
        envelope,
        recipient: this.options.encryption,
        resolveSenderPublicKey: (did) =>
          this.options.registry.resolveSenderPublicKey(did),
        replayGuard: this.replayGuard,
        panicMode: this.options.panicMode,
      });

      this.processedInbound.add(inboundKey);
      if (this.handler) {
        await this.handler(opened, {
          topic,
          shard: parsedTopic.shard,
          opaqueId: parsedTopic.opaqueId,
        });
      }
    } catch {
      // Envelope inválido: centinela lo detectaría en audit; no propagar.
    }
  }
}
