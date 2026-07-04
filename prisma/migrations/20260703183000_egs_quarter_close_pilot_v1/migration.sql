-- EGS Piloto Vial — QuarterClose schema v1

CREATE TYPE "EgsPilotStatus" AS ENUM ('draft', 'active', 'closed', 'frozen');

CREATE TYPE "QuarterCloseStatus" AS ENUM (
  'DRAFT',
  'BASELINE_LOCKED',
  'COLLECTING',
  'PENDING_VALIDATION',
  'DELTA_CALCULATED',
  'SPLIT_APPROVED',
  'PUBLISHED',
  'FROZEN'
);

CREATE TABLE "BudgetLinePilot" (
    "id" TEXT NOT NULL,
    "ministryCode" TEXT NOT NULL,
    "budgetCode" TEXT NOT NULL,
    "programName" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'VES',
    "pilotStatus" "EgsPilotStatus" NOT NULL DEFAULT 'draft',
    "originNodeId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BudgetLinePilot_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BaselineAct" (
    "id" TEXT NOT NULL,
    "budgetLinePilotId" TEXT NOT NULL,
    "fiscalYear" INTEGER NOT NULL,
    "historicalMonths" INTEGER NOT NULL DEFAULT 24,
    "annualAmountBaseline" DECIMAL(18,4) NOT NULL,
    "seasonalFactorQ1" DECIMAL(8,4) NOT NULL DEFAULT 1,
    "seasonalFactorQ2" DECIMAL(8,4) NOT NULL DEFAULT 1,
    "seasonalFactorQ3" DECIMAL(8,4) NOT NULL DEFAULT 1,
    "seasonalFactorQ4" DECIMAL(8,4) NOT NULL DEFAULT 1,
    "contentHash" TEXT NOT NULL,
    "actaProcessId" TEXT NOT NULL,
    "signedAt" TIMESTAMP(3),
    "signers" JSONB NOT NULL,
    "originNodeId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BaselineAct_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "QuarterClose" (
    "id" TEXT NOT NULL,
    "budgetLinePilotId" TEXT NOT NULL,
    "fiscalYear" INTEGER NOT NULL,
    "quarter" INTEGER NOT NULL,
    "status" "QuarterCloseStatus" NOT NULL DEFAULT 'DRAFT',
    "baselineTrimestral" DECIMAL(18,4) NOT NULL,
    "gastosVerificados" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "ajustesFuerzaMayor" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "calculoAhorroFinal" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "reinversionAmount" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "meritPoolAmount" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "agigovFeeAmount" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'VES',
    "treasuryRef" TEXT,
    "ledgerProcessId" TEXT,
    "contentHash" TEXT,
    "signedAt" TIMESTAMP(3),
    "signers" JSONB,
    "originNodeId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuarterClose_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "QuarterCloseRelease" (
    "id" TEXT NOT NULL,
    "quarterCloseId" TEXT NOT NULL,
    "escrowId" TEXT NOT NULL,
    "milestoneIndex" INTEGER NOT NULL,
    "amount" DECIMAL(18,4) NOT NULL,
    "evidenceRef" TEXT NOT NULL,
    "verifiedAt" TIMESTAMP(3) NOT NULL,
    "originNodeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuarterCloseRelease_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ForceMajeureAdjustment" (
    "id" TEXT NOT NULL,
    "quarterCloseId" TEXT NOT NULL,
    "amount" DECIMAL(18,4) NOT NULL,
    "reason" TEXT NOT NULL,
    "actaProcessId" TEXT NOT NULL,
    "approvedAt" TIMESTAMP(3) NOT NULL,
    "originNodeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ForceMajeureAdjustment_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Escrow" ADD COLUMN "budgetLinePilotId" TEXT;

CREATE UNIQUE INDEX "BudgetLinePilot_ministryCode_budgetCode_key" ON "BudgetLinePilot"("ministryCode", "budgetCode");
CREATE INDEX "BudgetLinePilot_pilotStatus_idx" ON "BudgetLinePilot"("pilotStatus");
CREATE INDEX "BudgetLinePilot_updatedAt_idx" ON "BudgetLinePilot"("updatedAt");

CREATE UNIQUE INDEX "BaselineAct_contentHash_key" ON "BaselineAct"("contentHash");
CREATE UNIQUE INDEX "BaselineAct_actaProcessId_key" ON "BaselineAct"("actaProcessId");
CREATE INDEX "BaselineAct_budgetLinePilotId_idx" ON "BaselineAct"("budgetLinePilotId");
CREATE INDEX "BaselineAct_fiscalYear_idx" ON "BaselineAct"("fiscalYear");

CREATE UNIQUE INDEX "QuarterClose_budgetLinePilotId_fiscalYear_quarter_key" ON "QuarterClose"("budgetLinePilotId", "fiscalYear", "quarter");
CREATE UNIQUE INDEX "QuarterClose_ledgerProcessId_key" ON "QuarterClose"("ledgerProcessId");
CREATE UNIQUE INDEX "QuarterClose_contentHash_key" ON "QuarterClose"("contentHash");
CREATE INDEX "QuarterClose_status_idx" ON "QuarterClose"("status");
CREATE INDEX "QuarterClose_fiscalYear_quarter_idx" ON "QuarterClose"("fiscalYear", "quarter");
CREATE INDEX "QuarterClose_updatedAt_idx" ON "QuarterClose"("updatedAt");

CREATE UNIQUE INDEX "QuarterCloseRelease_quarterCloseId_escrowId_milestoneIndex_key" ON "QuarterCloseRelease"("quarterCloseId", "escrowId", "milestoneIndex");
CREATE INDEX "QuarterCloseRelease_quarterCloseId_idx" ON "QuarterCloseRelease"("quarterCloseId");
CREATE INDEX "QuarterCloseRelease_escrowId_idx" ON "QuarterCloseRelease"("escrowId");

CREATE INDEX "ForceMajeureAdjustment_quarterCloseId_idx" ON "ForceMajeureAdjustment"("quarterCloseId");

CREATE INDEX "Escrow_budgetLinePilotId_idx" ON "Escrow"("budgetLinePilotId");

ALTER TABLE "BaselineAct" ADD CONSTRAINT "BaselineAct_budgetLinePilotId_fkey" FOREIGN KEY ("budgetLinePilotId") REFERENCES "BudgetLinePilot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "QuarterClose" ADD CONSTRAINT "QuarterClose_budgetLinePilotId_fkey" FOREIGN KEY ("budgetLinePilotId") REFERENCES "BudgetLinePilot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "QuarterCloseRelease" ADD CONSTRAINT "QuarterCloseRelease_quarterCloseId_fkey" FOREIGN KEY ("quarterCloseId") REFERENCES "QuarterClose"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "QuarterCloseRelease" ADD CONSTRAINT "QuarterCloseRelease_escrowId_fkey" FOREIGN KEY ("escrowId") REFERENCES "Escrow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ForceMajeureAdjustment" ADD CONSTRAINT "ForceMajeureAdjustment_quarterCloseId_fkey" FOREIGN KEY ("quarterCloseId") REFERENCES "QuarterClose"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Escrow" ADD CONSTRAINT "Escrow_budgetLinePilotId_fkey" FOREIGN KEY ("budgetLinePilotId") REFERENCES "BudgetLinePilot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
