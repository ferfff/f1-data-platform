/*
  Warnings:

  - You are about to drop the `Endpoint` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('PRACTICE', 'QUALIFYING', 'SPRINT_SHOOTOUT', 'SPRINT', 'RACE');

-- DropTable
DROP TABLE "Endpoint";

-- CreateTable
CREATE TABLE "Circuit" (
    "id" SERIAL NOT NULL,
    "circuitRef" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "altitude" INTEGER NOT NULL,
    "url" TEXT,

    CONSTRAINT "Circuit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Constructor" (
    "id" SERIAL NOT NULL,
    "constructorRef" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "url" TEXT,

    CONSTRAINT "Constructor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" SERIAL NOT NULL,
    "driverRef" TEXT NOT NULL,
    "code" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "url" TEXT,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DriverTeamSeason" (
    "id" SERIAL NOT NULL,
    "driverId" INTEGER NOT NULL,
    "seasonId" INTEGER NOT NULL,
    "constructorId" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,

    CONSTRAINT "DriverTeamSeason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Race" (
    "id" SERIAL NOT NULL,
    "seasonId" INTEGER NOT NULL,
    "round" INTEGER NOT NULL,
    "circuitId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TIMESTAMP(3),
    "url" TEXT,

    CONSTRAINT "Race_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RaceSession" (
    "id" SERIAL NOT NULL,
    "raceId" INTEGER NOT NULL,
    "type" "SessionType" NOT NULL,
    "sessionNumber" INTEGER NOT NULL DEFAULT 1,
    "date" TIMESTAMP(3),
    "time" TIMESTAMP(3),

    CONSTRAINT "RaceSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Season" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "url" TEXT,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionResult" (
    "id" SERIAL NOT NULL,
    "raceSessionId" INTEGER NOT NULL,
    "driverId" INTEGER NOT NULL,
    "constructorId" INTEGER NOT NULL,
    "position" INTEGER,
    "grid" INTEGER,
    "points" DOUBLE PRECISION,
    "laps" INTEGER,
    "status" TEXT,
    "fastestLap" INTEGER,
    "fastestLapTime" TEXT,
    "q1" TEXT,
    "q2" TEXT,
    "q3" TEXT,

    CONSTRAINT "SessionResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Circuit_circuitRef_key" ON "Circuit"("circuitRef");

-- CreateIndex
CREATE UNIQUE INDEX "Constructor_constructorRef_key" ON "Constructor"("constructorRef");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_driverRef_key" ON "Driver"("driverRef");

-- CreateIndex
CREATE UNIQUE INDEX "DriverTeamSeason_driverId_seasonId_constructorId_key" ON "DriverTeamSeason"("driverId", "seasonId", "constructorId");

-- CreateIndex
CREATE UNIQUE INDEX "Race_seasonId_round_key" ON "Race"("seasonId", "round");

-- CreateIndex
CREATE UNIQUE INDEX "RaceSession_raceId_type_sessionNumber_key" ON "RaceSession"("raceId", "type", "sessionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Season_year_key" ON "Season"("year");

-- CreateIndex
CREATE UNIQUE INDEX "SessionResult_raceSessionId_driverId_key" ON "SessionResult"("raceSessionId", "driverId");

-- AddForeignKey
ALTER TABLE "DriverTeamSeason" ADD CONSTRAINT "DriverTeamSeason_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverTeamSeason" ADD CONSTRAINT "DriverTeamSeason_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverTeamSeason" ADD CONSTRAINT "DriverTeamSeason_constructorId_fkey" FOREIGN KEY ("constructorId") REFERENCES "Constructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Race" ADD CONSTRAINT "Race_circuitId_fkey" FOREIGN KEY ("circuitId") REFERENCES "Circuit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Race" ADD CONSTRAINT "Race_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaceSession" ADD CONSTRAINT "RaceSession_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionResult" ADD CONSTRAINT "SessionResult_raceSessionId_fkey" FOREIGN KEY ("raceSessionId") REFERENCES "RaceSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionResult" ADD CONSTRAINT "SessionResult_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionResult" ADD CONSTRAINT "SessionResult_constructorId_fkey" FOREIGN KEY ("constructorId") REFERENCES "Constructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
