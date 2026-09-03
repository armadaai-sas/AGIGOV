#!/usr/bin/env tsx
/**
 * Emite bloques .env con claves por rol para SWARM_LITE / docker-compose.prod.light.yml
 * Uso: npx tsx scripts/export-swarm-env.ts >> infra/.env.prod
 */
import { generateAgentKeys } from '../src/protocol/index.js';

const ROLES = (process.env.SWARM_LITE_ROLES ?? 'centinela,comunicador')
  .split(',')
  .map((r) => r.trim());

for (const role of ROLES) {
  const did = `did:agigov:core:${role}`;
  const keys = generateAgentKeys(did);
  const suffix = role.toUpperCase().replace(/-/g, '_');

  console.log(`# ${did}`);
  console.log(`NODE_DID_${suffix}=${did}`);
  console.log(
    `NODE_ED25519_SECRET_KEY_B64_${suffix}=${Buffer.from(keys.signing.ed25519SecretKey).toString('base64')}`,
  );
  console.log(
    `NODE_ED25519_PUBLIC_KEY_B64_${suffix}=${Buffer.from(keys.signing.ed25519PublicKey).toString('base64')}`,
  );
  console.log(
    `NODE_X25519_SECRET_KEY_B64_${suffix}=${Buffer.from(keys.encryption.x25519SecretKey).toString('base64')}`,
  );
  console.log(
    `NODE_X25519_PUBLIC_KEY_B64_${suffix}=${Buffer.from(keys.encryption.x25519PublicKey).toString('base64')}`,
  );
  console.log('');
}
