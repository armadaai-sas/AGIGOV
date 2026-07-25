-- AlterTable
ALTER TABLE "InstitutionUser" ADD COLUMN IF NOT EXISTS "iso" TEXT;
ALTER TABLE "InstitutionUser" ADD COLUMN IF NOT EXISTS "regionCode" TEXT;
ALTER TABLE "InstitutionUser" ADD COLUMN IF NOT EXISTS "entityCatalogId" TEXT;
ALTER TABLE "InstitutionUser" ADD COLUMN IF NOT EXISTS "phone" TEXT;
ALTER TABLE "InstitutionUser" ADD COLUMN IF NOT EXISTS "phoneCountryCode" TEXT;
ALTER TABLE "InstitutionUser" ADD COLUMN IF NOT EXISTS "verificationNotes" TEXT;

-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "InstitutionVerificationStatus" AS ENUM ('unverified', 'pending_verification', 'verified', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "InstitutionUser" ADD COLUMN IF NOT EXISTS "verificationStatus" "InstitutionVerificationStatus" NOT NULL DEFAULT 'pending_verification';

CREATE INDEX IF NOT EXISTS "InstitutionUser_verificationStatus_idx" ON "InstitutionUser"("verificationStatus");
