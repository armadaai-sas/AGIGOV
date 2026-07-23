-- Fase B/C — onboarding institucional + baseline multi-sig por tenant
CREATE TYPE "PilotOnboardingStatus" AS ENUM (
  'pending',
  'registered',
  'baseline_pending',
  'baseline_ratified',
  'ingest_ready'
);

ALTER TABLE "PilotTenant" ADD COLUMN "onboardingStatus" "PilotOnboardingStatus" NOT NULL DEFAULT 'pending';
ALTER TABLE "PilotTenant" ADD COLUMN "baselineActaProcessId" TEXT;
ALTER TABLE "PilotTenant" ADD COLUMN "institutionSigners" JSONB;
ALTER TABLE "PilotTenant" ADD COLUMN "baselineSignatures" JSONB;
ALTER TABLE "PilotTenant" ADD COLUMN "multisigThreshold" INTEGER NOT NULL DEFAULT 3;

CREATE INDEX "PilotTenant_onboardingStatus_idx" ON "PilotTenant"("onboardingStatus");

-- Tenants ya activos (Fase A) siguen con ingest sin re-onboard
UPDATE "PilotTenant" SET "onboardingStatus" = 'ingest_ready' WHERE "status" = 'active';
