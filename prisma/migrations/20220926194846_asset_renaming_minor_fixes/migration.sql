/*
  Warnings:

  - You are about to drop the column `campaignID` on the `Actor` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Actor" DROP CONSTRAINT "Actor_campaignID_fkey";

-- AlterTable
ALTER TABLE "Actor" DROP COLUMN "campaignID";

-- AddForeignKey
ALTER TABLE "CampaignModule" ADD CONSTRAINT "CampaignModule_sourceUserID_fkey" FOREIGN KEY ("sourceUserID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignAccess" ADD CONSTRAINT "CampaignAccess_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignAccess" ADD CONSTRAINT "CampaignAccess_campaignID_fkey" FOREIGN KEY ("campaignID") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
