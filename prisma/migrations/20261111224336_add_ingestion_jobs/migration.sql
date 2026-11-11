-- CreateEnum
CREATE TYPE "IngestionJobStatus" AS ENUM ('QUEUED', 'RUNNING', 'COMPLETED', 'COMPLETED_WITH_ERRORS', 'FAILED');

-- CreateTable
CREATE TABLE "IngestionJob" (
    "id" SERIAL NOT NULL,
    "initYear" INTEGER NOT NULL,
    "lastYear" INTEGER,
    "status" "IngestionJobStatus" NOT NULL DEFAULT 'QUEUED',
    "totalSeasons" INTEGER NOT NULL,
    "processedSeasons" INTEGER NOT NULL DEFAULT 0,
    "failedSeasons" INTEGER NOT NULL DEFAULT 0,
    "currentYear" INTEGER,
    "errors" JSONB,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IngestionJob_pkey" PRIMARY KEY ("id")
);
