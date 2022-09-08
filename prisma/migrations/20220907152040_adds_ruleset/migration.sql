/*
  Warnings:

  - You are about to alter the column `storageUsed` on the `User` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `maximumStorage` on the `User` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "storageUsed" SET DATA TYPE INTEGER,
ALTER COLUMN "maximumStorage" SET DATA TYPE INTEGER;

-- CreateTable
CREATE TABLE "Ruleset" (
    "id" UUID NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "alias" VARCHAR(64),
    "isOfficial" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "actorFields" JSONB NOT NULL,
    "rules" JSONB NOT NULL,

    CONSTRAINT "Ruleset_pkey" PRIMARY KEY ("id")
);
