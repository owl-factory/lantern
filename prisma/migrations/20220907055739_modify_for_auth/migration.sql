/*
  Warnings:

  - You are about to alter the column `storageUsed` on the `User` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `maximumStorage` on the `User` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to drop the column `passwordHash` on the `UserSecret` table. All the data in the column will be lost.
  - Added the required column `hashedPassword` to the `UserSecret` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salt` to the `UserSecret` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "storageUsed" SET DATA TYPE INTEGER,
ALTER COLUMN "maximumStorage" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "UserSecret" DROP COLUMN "passwordHash",
ADD COLUMN     "hashedPassword" TEXT NOT NULL,
ADD COLUMN     "salt" INTEGER NOT NULL;
