import { ed25519 } from '@noble/curves/ed25519.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { utf8ToBytes } from '@noble/hashes/utils.js';

import { base64ToBytes } from '../protocol/encoding.js';

export interface SensorFact {
  resource: string;
  amount: number;
  unit: string;
  territoryId?: string;
}

export interface SignedSensorPayload {
  v: 1;
  devEui: string;
  territoryCode: string;
  timestamp: string;
  facts: SensorFact[];
  signature: string;
  publicKey: string;
}

export function canonicalSensorBytes(payload: Omit<SignedSensorPayload, 'signature' | 'publicKey'>): Uint8Array {
  const canonical = JSON.stringify({
    v: payload.v,
    devEui: payload.devEui,
    territoryCode: payload.territoryCode,
    timestamp: payload.timestamp,
    facts: payload.facts,
  });
  return sha256(utf8ToBytes(canonical));
}

export function verifySensorPayload(payload: SignedSensorPayload): boolean {
  if (payload.v !== 1) return false;
  if (!payload.signature || !payload.publicKey) return false;

  try {
    const message = canonicalSensorBytes(payload);
    const signature = base64ToBytes(payload.signature);
    const publicKey = base64ToBytes(payload.publicKey);
    return ed25519.verify(signature, message, publicKey);
  } catch {
    return false;
  }
}

export function parseSignedSensorPayload(raw: unknown): SignedSensorPayload | null {
  if (!raw || typeof raw !== 'object') return null;
  const p = raw as Partial<SignedSensorPayload>;
  if (
    p.v !== 1 ||
    typeof p.devEui !== 'string' ||
    typeof p.territoryCode !== 'string' ||
    typeof p.timestamp !== 'string' ||
    !Array.isArray(p.facts) ||
    typeof p.signature !== 'string' ||
    typeof p.publicKey !== 'string'
  ) {
    return null;
  }
  return p as SignedSensorPayload;
}
