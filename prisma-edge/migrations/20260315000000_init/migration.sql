-- CreateTable
CREATE TABLE "SyncOutbox" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mutationType" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "payloadHash" TEXT NOT NULL,
    "originNodeId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "syncedAt" DATETIME
);

-- CreateTable
CREATE TABLE "EdgeMeta" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "originNodeId" TEXT NOT NULL,
    "lastSyncAt" DATETIME,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SyncOutbox_payloadHash_key" ON "SyncOutbox"("payloadHash");

-- CreateIndex
CREATE INDEX "SyncOutbox_status_createdAt_idx" ON "SyncOutbox"("status", "createdAt");

-- CreateIndex
CREATE INDEX "SyncOutbox_originNodeId_idx" ON "SyncOutbox"("originNodeId");
