import { base64ToBytes } from '../protocol/encoding.js';
import type {
  AgentEncryptionKeys,
  AgentSigningKeys,
} from '../protocol/types.js';

export interface BusNodeConfig {
  mqttUrl: string;
  clientId: string;
  shard: string;
  nodeDid: string;
  signing: AgentSigningKeys;
  encryption: AgentEncryptionKeys;
  registryPath: string;
  outboxDbPath: string;
  panicMode: boolean;
  subscribeAudit: boolean;
  flushIntervalMs: number;
}

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Variable de entorno requerida: ${name}`);
  }
  return value;
}

function optionalBool(name: string, fallback = false): boolean {
  const value = process.env[name]?.trim().toLowerCase();
  if (!value) return fallback;
  return value === '1' || value === 'true' || value === 'yes';
}

function optionalInt(name: string, fallback: number): number {
  const value = process.env[name]?.trim();
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function envForRole(base: string, role?: string): string {
  if (role) {
    const suffix = role.toUpperCase().replace(/-/g, '_');
    const scoped = process.env[`${base}_${suffix}`]?.trim();
    if (scoped) return scoped;
  }
  return required(base);
}

export function loadBusNodeConfig(): BusNodeConfig {
  const role = process.env.AGENT_ROLE?.trim();
  const nodeDid = role
    ? (process.env[`NODE_DID_${role.toUpperCase().replace(/-/g, '_')}`]?.trim() ??
      process.env.NODE_DID?.trim() ??
      `did:armada:core:${role}`)
    : required('NODE_DID');

  const ed25519SecretKeyB64 = envForRole('NODE_ED25519_SECRET_KEY_B64', role);
  const ed25519PublicKeyB64 = envForRole('NODE_ED25519_PUBLIC_KEY_B64', role);
  const x25519SecretKeyB64 = envForRole('NODE_X25519_SECRET_KEY_B64', role);
  const x25519PublicKeyB64 = envForRole('NODE_X25519_PUBLIC_KEY_B64', role);

  return {
    mqttUrl: required('MQTT_URL'),
    clientId: process.env.MQTT_CLIENT_ID?.trim() || `armada-${nodeDid.split(':').pop()}`,
    shard: process.env.BUS_SHARD?.trim() || 'core',
    nodeDid,
    signing: {
      did: nodeDid,
      ed25519SecretKey: base64ToBytes(ed25519SecretKeyB64),
      ed25519PublicKey: base64ToBytes(ed25519PublicKeyB64),
    },
    encryption: {
      did: nodeDid,
      x25519SecretKey: base64ToBytes(x25519SecretKeyB64),
      x25519PublicKey: base64ToBytes(x25519PublicKeyB64),
    },
    registryPath:
      process.env.DID_REGISTRY_PATH?.trim() || 'data/did-registry.json',
    outboxDbPath:
      process.env.OUTBOX_DB_PATH?.trim() || 'data/iap-outbox.db',
    panicMode: optionalBool('PANIC_MODE', false),
    subscribeAudit: optionalBool('BUS_SUBSCRIBE_AUDIT', false),
    flushIntervalMs: optionalInt('BUS_FLUSH_INTERVAL_MS', 15_000),
  };
}
