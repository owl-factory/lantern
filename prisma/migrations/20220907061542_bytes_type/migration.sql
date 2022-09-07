/*
  Warnings:

  - Changed the type of `hashedPassword` on the `UserSecret` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `salt` on the `UserSecret` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "UserSecret" DROP COLUMN "hashedPassword",
ADD COLUMN     "hashedPassword" BYTEA NOT NULL,
DROP COLUMN "salt",
ADD COLUMN     "salt" BYTEA NOT NULL;
