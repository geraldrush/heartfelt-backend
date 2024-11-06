/*
  Warnings:

  - You are about to drop the `Token` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `googleId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "age" INTEGER,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "preference" TEXT,
ADD COLUMN     "race" TEXT,
ADD COLUMN     "story" TEXT,
ALTER COLUMN "googleId" SET NOT NULL,
ALTER COLUMN "tokens" SET DEFAULT 0.0,
ALTER COLUMN "tokens" SET DATA TYPE DOUBLE PRECISION;

-- DropTable
DROP TABLE "Token";
