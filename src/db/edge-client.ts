import { PrismaClient } from '../generated/edge/index.js';

const globalForEdge = globalThis as unknown as {
  edgeDb: PrismaClient | undefined;
};

export function getEdgeDb(): PrismaClient {
  if (!globalForEdge.edgeDb) {
    globalForEdge.edgeDb = new PrismaClient();
  }
  return globalForEdge.edgeDb;
}

export async function disconnectEdgeDb(): Promise<void> {
  if (globalForEdge.edgeDb) {
    await globalForEdge.edgeDb.$disconnect();
    globalForEdge.edgeDb = undefined;
  }
}

export type { PrismaClient as EdgeDb };
export * from '../generated/edge/index.js';
