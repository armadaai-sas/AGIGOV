-- CreateEnum
CREATE TYPE "PilotTenantStatus" AS ENUM ('provisioning', 'active', 'suspended', 'closed');

-- CreateTable
CREATE TABLE "PilotTenant" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "ministryCode" TEXT NOT NULL,
    "budgetCode" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "programName" TEXT NOT NULL,
    "territoryCode" TEXT NOT NULL DEFAULT 'VEN_VIAL_PILOT_01',
    "fiscalYear" INTEGER NOT NULL DEFAULT 2026,
    "quarter" INTEGER NOT NULL DEFAULT 2,
    "status" "PilotTenantStatus" NOT NULL DEFAULT 'provisioning',
    "ingestTokenHash" TEXT NOT NULL,
    "budgetLinePilotId" TEXT,
    "originNodeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PilotTenant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PilotTenant_slug_key" ON "PilotTenant"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PilotTenant_ministryCode_budgetCode_key" ON "PilotTenant"("ministryCode", "budgetCode");

-- CreateIndex
CREATE INDEX "PilotTenant_status_idx" ON "PilotTenant"("status");

-- CreateIndex
CREATE INDEX "PilotTenant_ministryCode_idx" ON "PilotTenant"("ministryCode");
