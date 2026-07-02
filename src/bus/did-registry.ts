import { readFileSync, writeFileSync, existsSync } from 'node:fs';

import { base64ToBytes, bytesToBase64 } from '../protocol/encoding.js';

export interface DidRecord {
  did: string;
  ed25519PublicKeyB64: string;
  x25519PublicKeyB64: string;
  revoked?: boolean;
  rotatedAt?: number;
}

export interface DidRegistryFile {
  v: 1;
  records: DidRecord[];
}

/** Registro local de DIDs Armada (sin registry centralizado en v1). */
export class DidRegistry {
  private readonly records = new Map<string, DidRecord>();

  register(record: DidRecord): void {
    if (record.revoked) {
      throw new Error(`No registrar DID revocado: ${record.did}`);
    }
    this.records.set(record.did, { ...record });
  }

  revoke(did: string, rotatedAt = Date.now()): void {
    const existing = this.records.get(did);
    if (!existing) return;
    this.records.set(did, { ...existing, revoked: true, rotatedAt });
  }

  get(did: string): DidRecord | undefined {
    const record = this.records.get(did);
    if (!record || record.revoked) return undefined;
    return record;
  }

  resolveEd25519PublicKey(did: string): Uint8Array | undefined {
    const record = this.get(did);
    return record ? base64ToBytes(record.ed25519PublicKeyB64) : undefined;
  }

  resolveX25519PublicKey(did: string): Uint8Array | undefined {
    const record = this.get(did);
    return record ? base64ToBytes(record.x25519PublicKeyB64) : undefined;
  }

  resolveSenderPublicKey(did: string): Uint8Array | undefined {
    return this.resolveEd25519PublicKey(did);
  }

  list(): DidRecord[] {
    return [...this.records.values()].filter((r) => !r.revoked);
  }

  static fromKeys(
    did: string,
    ed25519PublicKey: Uint8Array,
    x25519PublicKey: Uint8Array,
  ): DidRecord {
    return {
      did,
      ed25519PublicKeyB64: bytesToBase64(ed25519PublicKey),
      x25519PublicKeyB64: bytesToBase64(x25519PublicKey),
    };
  }

  loadFromFile(path: string): void {
    if (!existsSync(path)) {
      throw new Error(`DID registry no encontrado: ${path}`);
    }
    const parsed = JSON.parse(readFileSync(path, 'utf8')) as DidRegistryFile;
    if (parsed.v !== 1) {
      throw new Error('DID registry versión no soportada');
    }
    for (const record of parsed.records) {
      this.register(record);
    }
  }

  saveToFile(path: string): void {
    const payload: DidRegistryFile = {
      v: 1,
      records: [...this.records.values()],
    };
    writeFileSync(path, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  }
}
