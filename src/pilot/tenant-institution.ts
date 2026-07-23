import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import type { JurisdictionIso } from '../config/sovereign/jurisdictions.js';
import { DidRegistry } from '../bus/did-registry.js';
import { isoFromMinistryCode } from './pilot-jurisdiction-profiles.js';
import { generateAgentKeys } from '../protocol/index.js';
import { bytesToBase64 } from '../protocol/encoding.js';

const TENANTS_DIR = join(process.cwd(), 'data', 'pilot-tenants');
const REGISTRY_PATH =
  process.env.DID_REGISTRY_PATH?.trim() || join(process.cwd(), 'data', 'did-registry.json');

export type InstitutionSignerRole = 'ministerio' | 'contraloria' | 'centinela';

export type InstitutionKeyRecord = {
  did: string;
  role: InstitutionSignerRole;
  ed25519PublicKeyB64: string;
  ed25519SecretKeyB64: string;
  x25519PublicKeyB64: string;
};

export type InstitutionKeysFile = {
  slug: string;
  ministryCode: string;
  signers: InstitutionKeyRecord[];
  createdAt: string;
};

export function didNamespaceForIso(iso: JurisdictionIso): string {
  const map: Record<JurisdictionIso, string> = {
    VEN: 'ven',
    COL: 'col',
    USA: 'usa',
    SBX: 'sbx',
    GEN: 'global',
  };
  return map[iso] ?? 'global';
}

export function buildInstitutionSigners(ministryCode: string, iso?: JurisdictionIso): string[] {
  const jurisdiction = iso ?? isoFromMinistryCode(ministryCode);
  const ns = didNamespaceForIso(jurisdiction);
  const code = ministryCode.toLowerCase();
  return [
    `did:armada:${ns}:ministerio:${code}`,
    `did:armada:${ns}:contraloria:${code}`,
    `did:armada:${ns}:centinela:${code}`,
  ];
}

export function institutionKeysPath(slug: string): string {
  return join(TENANTS_DIR, `${slug}.institution-keys.json`);
}

export function generateInstitutionKeys(
  slug: string,
  ministryCode: string,
): InstitutionKeysFile {
  const roles: InstitutionSignerRole[] = ['ministerio', 'contraloria', 'centinela'];
  const signers: InstitutionKeyRecord[] = buildInstitutionSigners(
    ministryCode,
    isoFromMinistryCode(ministryCode),
  ).map(
    (did, i) => {
      const keys = generateAgentKeys(did);
      return {
        did,
        role: roles[i]!,
        ed25519PublicKeyB64: bytesToBase64(keys.signing.ed25519PublicKey),
        ed25519SecretKeyB64: bytesToBase64(keys.signing.ed25519SecretKey),
        x25519PublicKeyB64: bytesToBase64(keys.encryption.x25519PublicKey),
      };
    },
  );

  return {
    slug,
    ministryCode,
    signers,
    createdAt: new Date().toISOString(),
  };
}

export function saveInstitutionKeys(file: InstitutionKeysFile): string {
  if (!existsSync(TENANTS_DIR)) mkdirSync(TENANTS_DIR, { recursive: true });
  const path = institutionKeysPath(file.slug);
  writeFileSync(path, `${JSON.stringify(file, null, 2)}\n`, 'utf8');
  return path;
}

export function loadInstitutionKeys(slug: string): InstitutionKeysFile | null {
  const path = institutionKeysPath(slug);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf8')) as InstitutionKeysFile;
}

/** Registra claves públicas en did-registry local (merge, sin sobrescribir core). */
export function mergeInstitutionKeysIntoRegistry(file: InstitutionKeysFile): void {
  const registry = new DidRegistry();
  if (existsSync(REGISTRY_PATH)) {
    registry.loadFromFile(REGISTRY_PATH);
  }

  for (const signer of file.signers) {
    registry.register({
      did: signer.did,
      ed25519PublicKeyB64: signer.ed25519PublicKeyB64,
      x25519PublicKeyB64: signer.x25519PublicKeyB64,
    });
  }

  mkdirSync(dirname(REGISTRY_PATH), { recursive: true });
  registry.saveToFile(REGISTRY_PATH);
}

export function loadDidRegistry(): DidRegistry {
  const registry = new DidRegistry();
  if (existsSync(REGISTRY_PATH)) {
    registry.loadFromFile(REGISTRY_PATH);
  }
  return registry;
}
