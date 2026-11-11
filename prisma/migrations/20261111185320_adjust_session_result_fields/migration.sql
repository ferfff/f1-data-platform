/*
  Warnings:

  - You are about to drop the column `number` on the `DriverTeamSeason` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DriverTeamSeason" DROP COLUMN "number";

-- AlterTable
ALTER TABLE "SessionResult" ADD COLUMN     "fastestLapRank" INTEGER,
ADD COLUMN     "number" INTEGER;
