#!/usr/bin/env tsx
/**
 * Ops — actualizar verificación institucional (revisión humana).
 *
 * Uso:
 *   npx tsx scripts/institution-set-verification.ts email@dominio.com verified
 *   npx tsx scripts/institution-set-verification.ts email@dominio.com rejected "No responde canal público"
 */
import 'dotenv/config';

import { disconnectCoreDb } from '../src/db/client.js';
import {
  setInstitutionVerificationStatus,
  type InstitutionVerificationStatus,
} from '../src/server/institution-auth.js';

const email = process.argv[2]?.trim();
const status = process.argv[3]?.trim() as InstitutionVerificationStatus | undefined;
const notes = process.argv[4]?.trim();

async function main(): Promise<void> {
  if (!email || !status) {
    console.error(
      'Uso: npx tsx scripts/institution-set-verification.ts <email> <unverified|pending_verification|verified|rejected> [notas]',
    );
    process.exit(1);
  }
  const user = await setInstitutionVerificationStatus({ email, status, notes });
  console.log(JSON.stringify(user, null, 2));
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectCoreDb();
  });
