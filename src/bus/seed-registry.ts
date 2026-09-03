import { mkdirSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';

import { DidRegistry } from './did-registry.js';
import { generateAgentKeys } from '../protocol/index.js';

const registryPath =
  process.argv[2]?.trim() || process.env.DID_REGISTRY_PATH || 'data/did-registry.json';

const agents = [
  'did:agigov:core:centinela',
  'did:agigov:core:logistico',
  'did:agigov:core:soberano',
  'did:agigov:core:conciliador',
  'did:agigov:core:comunicador',
] as const;

const registry = new DidRegistry();
const generated: Array<{ did: string; keys: ReturnType<typeof generateAgentKeys> }> = [];

for (const did of agents) {
  const keys = generateAgentKeys(did);
  registry.register(
    DidRegistry.fromKeys(
      did,
      keys.signing.ed25519PublicKey,
      keys.encryption.x25519PublicKey,
    ),
  );
  generated.push({ did, keys });
}

mkdirSync(dirname(registryPath), { recursive: true });
registry.saveToFile(registryPath);

console.log(`Registry escrito en ${registryPath}`);
console.log('');
console.log('Claves de demo (NO usar en producción):');
for (const { did, keys } of generated) {
  console.log(`\n# ${did}`);
  console.log(`NODE_DID=${did}`);
  console.log(
    `NODE_ED25519_SECRET_KEY_B64=${Buffer.from(keys.signing.ed25519SecretKey).toString('base64')}`,
  );
  console.log(
    `NODE_ED25519_PUBLIC_KEY_B64=${Buffer.from(keys.signing.ed25519PublicKey).toString('base64')}`,
  );
  console.log(
    `NODE_X25519_SECRET_KEY_B64=${Buffer.from(keys.encryption.x25519SecretKey).toString('base64')}`,
  );
  console.log(
    `NODE_X25519_PUBLIC_KEY_B64=${Buffer.from(keys.encryption.x25519PublicKey).toString('base64')}`,
  );
}

if (!existsSync('data')) {
  console.log('\nDirectorio data/ creado.');
}
