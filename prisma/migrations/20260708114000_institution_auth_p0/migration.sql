-- CreateEnum
CREATE TYPE "InstitutionUserStatus" AS ENUM ('active', 'suspended');

-- CreateTable
CREATE TABLE "InstitutionUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "institutionName" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "officialCode" TEXT,
    "contactName" TEXT,
    "contactRole" TEXT,
    "passwordSalt" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "status" "InstitutionUserStatus" NOT NULL DEFAULT 'active',
    "magicLinkHash" TEXT,
    "magicLinkExpiry" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstitutionUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstitutionSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InstitutionSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InstitutionUser_email_key" ON "InstitutionUser"("email");

-- CreateIndex
CREATE INDEX "InstitutionUser_status_idx" ON "InstitutionUser"("status");

-- CreateIndex
CREATE UNIQUE INDEX "InstitutionSession_tokenHash_key" ON "InstitutionSession"("tokenHash");

-- CreateIndex
CREATE INDEX "InstitutionSession_userId_idx" ON "InstitutionSession"("userId");

-- CreateIndex
CREATE INDEX "InstitutionSession_expiresAt_idx" ON "InstitutionSession"("expiresAt");

-- AddForeignKey
ALTER TABLE "InstitutionSession" ADD CONSTRAINT "InstitutionSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "InstitutionUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
