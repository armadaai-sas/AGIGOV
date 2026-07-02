-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ProcessStatus" AS ENUM ('received', 'validated', 'decided', 'committed', 'published', 'frozen');

-- CreateEnum
CREATE TYPE "EscrowStatus" AS ENUM ('PENDING', 'LOCKED', 'RELEASED', 'FROZEN');

-- CreateEnum
CREATE TYPE "LedgerEntryType" AS ENUM ('VOTE', 'ESCROW', 'ACTA', 'TRUST_EDGE', 'PROCESS');

-- CreateTable
CREATE TABLE "TerritorialNode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "originNodeId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TerritorialNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Citizen" (
    "id" TEXT NOT NULL,
    "did" TEXT NOT NULL,
    "displayName" TEXT,
    "territoryId" TEXT NOT NULL,
    "originNodeId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Citizen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "payloadHash" TEXT NOT NULL,
    "citizenDid" TEXT NOT NULL,
    "territoryId" TEXT NOT NULL,
    "processId" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "originNodeId" TEXT NOT NULL,
    "committedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Escrow" (
    "id" TEXT NOT NULL,
    "processId" TEXT NOT NULL,
    "territoryId" TEXT,
    "amount" DECIMAL(18,4) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'VES',
    "status" "EscrowStatus" NOT NULL DEFAULT 'PENDING',
    "threshold" INTEGER NOT NULL,
    "signers" JSONB NOT NULL,
    "originNodeId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Escrow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Acta" (
    "id" TEXT NOT NULL,
    "processId" TEXT NOT NULL,
    "territoryId" TEXT,
    "title" TEXT NOT NULL,
    "contentHash" TEXT NOT NULL,
    "sovereignDid" TEXT NOT NULL,
    "status" "ProcessStatus" NOT NULL DEFAULT 'received',
    "originNodeId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Acta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrustNode" (
    "id" TEXT NOT NULL,
    "citizenDid" TEXT NOT NULL,
    "territoryId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "originNodeId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrustNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrustEdge" (
    "id" TEXT NOT NULL,
    "fromNodeId" TEXT NOT NULL,
    "toNodeId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "evidenceRef" TEXT NOT NULL,
    "originNodeId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TrustEdge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LedgerEntry" (
    "id" TEXT NOT NULL,
    "entryType" "LedgerEntryType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "entityHash" TEXT NOT NULL,
    "processId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "evidenceRef" TEXT NOT NULL,
    "committedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessCheckpoint" (
    "id" TEXT NOT NULL,
    "processId" TEXT NOT NULL,
    "status" "ProcessStatus" NOT NULL DEFAULT 'received',
    "agentId" TEXT NOT NULL,
    "evidenceBundle" JSONB NOT NULL,
    "originNodeId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProcessCheckpoint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TerritorialNode_code_key" ON "TerritorialNode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "TerritorialNode_originNodeId_key" ON "TerritorialNode"("originNodeId");

-- CreateIndex
CREATE INDEX "TerritorialNode_updatedAt_idx" ON "TerritorialNode"("updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Citizen_did_key" ON "Citizen"("did");

-- CreateIndex
CREATE INDEX "Citizen_territoryId_idx" ON "Citizen"("territoryId");

-- CreateIndex
CREATE INDEX "Citizen_updatedAt_idx" ON "Citizen"("updatedAt");

-- CreateIndex
CREATE INDEX "Citizen_originNodeId_idx" ON "Citizen"("originNodeId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_payloadHash_key" ON "Vote"("payloadHash");

-- CreateIndex
CREATE INDEX "Vote_territoryId_idx" ON "Vote"("territoryId");

-- CreateIndex
CREATE INDEX "Vote_processId_idx" ON "Vote"("processId");

-- CreateIndex
CREATE INDEX "Vote_citizenDid_idx" ON "Vote"("citizenDid");

-- CreateIndex
CREATE UNIQUE INDEX "Escrow_processId_key" ON "Escrow"("processId");

-- CreateIndex
CREATE INDEX "Escrow_status_idx" ON "Escrow"("status");

-- CreateIndex
CREATE INDEX "Escrow_updatedAt_idx" ON "Escrow"("updatedAt");

-- CreateIndex
CREATE INDEX "Escrow_originNodeId_idx" ON "Escrow"("originNodeId");

-- CreateIndex
CREATE INDEX "Escrow_territoryId_idx" ON "Escrow"("territoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Acta_processId_key" ON "Acta"("processId");

-- CreateIndex
CREATE UNIQUE INDEX "Acta_contentHash_key" ON "Acta"("contentHash");

-- CreateIndex
CREATE INDEX "Acta_status_idx" ON "Acta"("status");

-- CreateIndex
CREATE INDEX "Acta_updatedAt_idx" ON "Acta"("updatedAt");

-- CreateIndex
CREATE INDEX "Acta_territoryId_idx" ON "Acta"("territoryId");

-- CreateIndex
CREATE UNIQUE INDEX "TrustNode_citizenDid_key" ON "TrustNode"("citizenDid");

-- CreateIndex
CREATE INDEX "TrustNode_territoryId_idx" ON "TrustNode"("territoryId");

-- CreateIndex
CREATE INDEX "TrustNode_updatedAt_idx" ON "TrustNode"("updatedAt");

-- CreateIndex
CREATE INDEX "TrustEdge_updatedAt_idx" ON "TrustEdge"("updatedAt");

-- CreateIndex
CREATE INDEX "TrustEdge_originNodeId_idx" ON "TrustEdge"("originNodeId");

-- CreateIndex
CREATE UNIQUE INDEX "TrustEdge_fromNodeId_toNodeId_key" ON "TrustEdge"("fromNodeId", "toNodeId");

-- CreateIndex
CREATE UNIQUE INDEX "LedgerEntry_entityHash_key" ON "LedgerEntry"("entityHash");

-- CreateIndex
CREATE INDEX "LedgerEntry_processId_idx" ON "LedgerEntry"("processId");

-- CreateIndex
CREATE INDEX "LedgerEntry_entryType_idx" ON "LedgerEntry"("entryType");

-- CreateIndex
CREATE INDEX "LedgerEntry_committedAt_idx" ON "LedgerEntry"("committedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProcessCheckpoint_processId_key" ON "ProcessCheckpoint"("processId");

-- CreateIndex
CREATE INDEX "ProcessCheckpoint_status_idx" ON "ProcessCheckpoint"("status");

-- CreateIndex
CREATE INDEX "ProcessCheckpoint_updatedAt_idx" ON "ProcessCheckpoint"("updatedAt");

-- CreateIndex
CREATE INDEX "ProcessCheckpoint_originNodeId_idx" ON "ProcessCheckpoint"("originNodeId");

-- AddForeignKey
ALTER TABLE "Citizen" ADD CONSTRAINT "Citizen_territoryId_fkey" FOREIGN KEY ("territoryId") REFERENCES "TerritorialNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_citizenDid_fkey" FOREIGN KEY ("citizenDid") REFERENCES "Citizen"("did") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_territoryId_fkey" FOREIGN KEY ("territoryId") REFERENCES "TerritorialNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Escrow" ADD CONSTRAINT "Escrow_territoryId_fkey" FOREIGN KEY ("territoryId") REFERENCES "TerritorialNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Acta" ADD CONSTRAINT "Acta_territoryId_fkey" FOREIGN KEY ("territoryId") REFERENCES "TerritorialNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrustNode" ADD CONSTRAINT "TrustNode_citizenDid_fkey" FOREIGN KEY ("citizenDid") REFERENCES "Citizen"("did") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrustNode" ADD CONSTRAINT "TrustNode_territoryId_fkey" FOREIGN KEY ("territoryId") REFERENCES "TerritorialNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrustEdge" ADD CONSTRAINT "TrustEdge_fromNodeId_fkey" FOREIGN KEY ("fromNodeId") REFERENCES "TrustNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrustEdge" ADD CONSTRAINT "TrustEdge_toNodeId_fkey" FOREIGN KEY ("toNodeId") REFERENCES "TrustNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
