/**
 * Claves Ed25519 durables para signatarios del acta piloto nacional.
 * Archivo gitignored — no demo keygen efímero por corrida.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { DidRegistry } from '../bus/did-registry.js';
import { generateAgentKeys } from '../protocol/index.js';
import { bytesToBase64 } from '../protocol/encoding.js';

const TENANTS_DIR = join(process.cwd(), 'data', 'pilot-tenants');
const REGISTRY_PATH =
  process.env.DID_REGISTRY_PATH?.trim() || join(process.cwd(), 'data', 'did-registry.json');

export type PilotCoreKeyRecord = {
  did: string;
  role: string;
  ed25519PublicKeyB64: string;
  ed25519SecretKeyB64: string;
  x25519PublicKeyB64: string;
};

export type PilotCoreKeysFile = {
  processId: string;
  signers: PilotCoreKeyRecord[];
  createdAt: string;
};

export function pilotCoreKeysPath(): string {
  return (
    process.env.PILOT_CORE_KEYS_PATH?.trim() ||
    join(TENANTS_DIR, 'nacional.core-keys.json')
  );
}

function roleFromDid(did: string): string {
  const parts = did.split(':');
  return parts[parts.length - 1] ?? 'signer';
}

/** Env override: NODE_ED25519_SECRET_KEY_B64_SOBERANO (+ PUBLIC) por rol. */
function loadSignerFromEnv(did: string): PilotCoreKeyRecord | null {
  const role = roleFromDid(did).toUpperCase().replace(/-/g, '_');
  const secret = process.env[`NODE_ED25519_SECRET_KEY_B64_${role}`]?.trim();
  const pub = process.env[`NODE_ED25519_PUBLIC_KEY_B64_${role}`]?.trim();
  const xPub = process.env[`NODE_X25519_PUBLIC_KEY_B64_${role}`]?.trim();
  if (!secret || !pub) return null;
  return {
    did,
    role: roleFromDid(did),
    ed25519PublicKeyB64: pub,
    ed25519SecretKeyB64: secret,
    x25519PublicKeyB64: xPub ?? '',
  };
}

export function loadPilotCoreKeys(): PilotCoreKeysFile | null {
  const path = pilotCoreKeysPath();
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf8')) as PilotCoreKeysFile;
}

export function savePilotCoreKeys(file: PilotCoreKeysFile): string {
  if (!existsSync(TENANTS_DIR)) mkdirSync(TENANTS_DIR, { recursive: true });
  const path = pilotCoreKeysPath();
  writeFileSync(path, `${JSON.stringify(file, null, 2)}\n`, 'utf8');
  return path;
}

export function mergePilotCoreKeysIntoRegistry(file: PilotCoreKeysFile): void {
  const registry = new DidRegistry();
  if (existsSync(REGISTRY_PATH)) {
    registry.loadFromFile(REGISTRY_PATH);
  }
  for (const signer of file.signers) {
    registry.register({
      did: signer.did,
      ed25519PublicKeyB64: signer.ed25519PublicKeyB64,
      x25519PublicKeyB64: signer.x25519PublicKeyB64 || '',
    });
  }
  mkdirSync(dirname(REGISTRY_PATH), { recursive: true });
  registry.saveToFile(REGISTRY_PATH);
}

/**
 * Carga claves desde env (prod) o archivo durable; genera una vez si no existen.
 */
export function ensurePilotCoreKeys(
  processId: string,
  signerDids: string[],
): PilotCoreKeysFile {
  const fromEnv: PilotCoreKeyRecord[] = [];
  for (const did of signerDids) {
    const rec = loadSignerFromEnv(did);
    if (rec) fromEnv.push(rec);
  }
  if (fromEnv.length === signerDids.length) {
    const file: PilotCoreKeysFile = {
      processId,
      signers: fromEnv,
      createdAt: new Date().toISOString(),
    };
    mergePilotCoreKeysIntoRegistry(file);
    return file;
  }

  const existing = loadPilotCoreKeys();
  if (existing?.signers?.length) {
    const byDid = new Map(existing.signers.map((s) => [s.did, s]));
    if (signerDids.every((d) => byDid.has(d))) {
      mergePilotCoreKeysIntoRegistry(existing);
      return existing;
    }
  }

  const signers: PilotCoreKeyRecord[] = signerDids.map((did) => {
    const keys = generateAgentKeys(did);
    return {
      did,
      role: roleFromDid(did),
      ed25519PublicKeyB64: bytesToBase64(keys.signing.ed25519PublicKey),
      ed25519SecretKeyB64: bytesToBase64(keys.signing.ed25519SecretKey),
      x25519PublicKeyB64: bytesToBase64(keys.encryption.x25519PublicKey),
    };
  });

  const file: PilotCoreKeysFile = {
    processId,
    signers,
    createdAt: new Date().toISOString(),
  };
  const path = savePilotCoreKeys(file);
  mergePilotCoreKeysIntoRegistry(file);
  console.log(`[Pilot] Claves core durables: ${path}`);
  return file;
}

export function loadPilotDidRegistry(): DidRegistry {
  const registry = new DidRegistry();
  if (existsSync(REGISTRY_PATH)) {
    registry.loadFromFile(REGISTRY_PATH);
  }
  return registry;
}