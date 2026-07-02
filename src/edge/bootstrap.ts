import 'dotenv/config';

import { getCoreDb, disconnectCoreDb } from '../db/client.js';
import { disconnectEdgeDb, getEdgeDb } from '../db/edge-client.js';
import { loadEdgeConfig } from './config.js';
import { getEquityPolicy, logEquityPolicy } from './equity.js';

async function main(): Promise<void> {
  const config = loadEdgeConfig();
  const core = getCoreDb();
  const edge = getEdgeDb();

  const territory = await core.territorialNode.findUnique({
    where: { code: config.territoryCode },
  });

  if (!territory) {
    throw new Error(
      `Territorio ${config.territoryCode} no encontrado — ejecuta npm run db:seed`,
    );
  }

  await edge.edgeMeta.upsert({
    where: { id: 'singleton' },
    create: {
      originNodeId: config.originNodeId,
    },
    update: {
      originNodeId: config.originNodeId,
    },
  });

  logEquityPolicy(getEquityPolicy(config), config.originNodeId);

  console.log('[Edge/Bootstrap] Nodo territorial listo:', {
    originNodeId: config.originNodeId,
    territoryCode: config.territoryCode,
    territoryId: territory.id,
    tier: config.tier,
    edgeDb: config.edgeDatabaseUrl,
  });

  await disconnectCoreDb();
  await disconnectEdgeDb();
}

main().catch(async (error) => {
  console.error('[Edge/Bootstrap] Error:', error);
  await disconnectCoreDb();
  await disconnectEdgeDb();
  process.exit(1);
});
