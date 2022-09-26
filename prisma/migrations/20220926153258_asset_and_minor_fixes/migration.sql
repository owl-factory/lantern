/*
  Warnings:

  - You are about to drop the column `campaignID` on the `Actor` table. All the data in the column will be lost.
  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SceneActor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SceneFile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Actor" DROP CONSTRAINT "Actor_campaignID_fkey";

-- DropForeignKey
ALTER TABLE "Campaign" DROP CONSTRAINT "Campaign_bannerID_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_deletedBy_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_ownedBy_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_updatedBy_fkey";

-- DropForeignKey
ALTER TABLE "SceneActor" DROP CONSTRAINT "SceneActor_actorID_fkey";

-- DropForeignKey
ALTER TABLE "SceneActor" DROP CONSTRAINT "SceneActor_sceneID_fkey";

-- DropForeignKey
ALTER TABLE "SceneFile" DROP CONSTRAINT "SceneFile_fileID_fkey";

-- DropForeignKey
ALTER TABLE "SceneFile" DROP CONSTRAINT "SceneFile_sceneID_fkey";

-- AlterTable
ALTER TABLE "Actor" DROP COLUMN "campaignID";

-- DropTable
DROP TABLE "File";

-- DropTable
DROP TABLE "SceneActor";

-- DropTable
DROP TABLE "SceneFile";

-- CreateTable
CREATE TABLE "Asset" (
    "id" UUID NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "src" TEXT NOT NULL,
    "mimetype" VARCHAR(32) NOT NULL,
    "assetType" VARCHAR(32) NOT NULL,
    "sizeInBytes" INTEGER NOT NULL DEFAULT 0,
    "s3Key" TEXT NOT NULL,
    "s3Path" TEXT NOT NULL,
    "isS3Pending" BOOLEAN NOT NULL DEFAULT true,
    "config" JSONB NOT NULL DEFAULT '{}',
    "ownedBy" UUID,
    "createdAt" TIMESTAMP(3),
    "createdBy" UUID,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" UUID,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" UUID,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_bannerID_fkey" FOREIGN KEY ("bannerID") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignModule" ADD CONSTRAINT "CampaignModule_sourceUserID_fkey" FOREIGN KEY ("sourceUserID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignAccess" ADD CONSTRAINT "CampaignAccess_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignAccess" ADD CONSTRAINT "CampaignAccess_campaignID_fkey" FOREIGN KEY ("campaignID") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_ownedBy_fkey" FOREIGN KEY ("ownedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
