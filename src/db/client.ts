import { PrismaClient } from '../generated/core/index.js';

const globalForPrisma = globalThis as unknown as {
  coreDb: PrismaClient | undefined;
};

export function getCoreDb(): PrismaClient {
  if (!globalForPrisma.coreDb) {
    globalForPrisma.coreDb = new PrismaClient();
  }
  return globalForPrisma.coreDb;
}

export async function disconnectCoreDb(): Promise<void> {
  if (globalForPrisma.coreDb) {
    await globalForPrisma.coreDb.$disconnect();
    globalForPrisma.coreDb = undefined;
  }
}

export type { PrismaClient as CoreDb };
export * from '../generated/core/index.js';
